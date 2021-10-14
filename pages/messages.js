import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import baseUrl from "../utils/baseUrl";
import { parseCookies } from "nookies";
import { Comment, Grid, Segment } from "semantic-ui-react";
import CommonNav from "../components/Layout/CommonNav";
import ChatList from "../components/Chats/ChatList";
import ChatBoard from "../components/Chats/ChatBoard";
import { useRouter } from "next/router";

const Messages = ({ user, chatsData }) => {
  const [chats, setChats] = useState(chatsData);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const router = useRouter();
  const socket = useRef();

  const [messages, setMessages] = useState([]);
  const [bannerData, setBannerData] = useState({ name: "", profilePicUrl: "" });
  const openChatId = useRef("");

  useEffect(() => {
    if (!socket.current) {
      socket.current = io(baseUrl);
    }
    if (socket.current) {
      socket.current.emit("join", { userId: user._id });
      socket.current.on("connectedUsers", ({ users }) => {
        users.length > 0 && setConnectedUsers(users);
        console.log("Online users", users);
      });
    }

    if (chats.length > 0 && !router.query.message) {
      router.push(`/messages?message=${chats[0].messagesWith}`, undefined, {
        shallow: true,
      });
    }

    return () => {
      if (socket.current) {
        socket.current.emit("disconnect");
        socket.current.off();
      }
    };
  }, []);

  useEffect(() => {
    const loadMessages = () => {
      console.log("Loaded called");
      socket.current.emit("loadMessages", {
        userId: user._id,
        messagesWith: router.query.message,
      });

      socket.current.on("messagesLoaded", ({ chat }) => {
        console.log("Messages Loaded", { chat });
        setMessages(chat.chat);
        setBannerData({
          name: chat.messagesWith.name,
          profilePicUrl: chat.messagesWith.profilePicUrl,
        });
        openChatId.current = chat.messagesWith._id;
      });
    };

    if (socket.current) {
      loadMessages();
    }
  }, [router.query.message]);

  return (
    <Grid>
      <Grid.Column floated="left" width="5">
        <Comment.Group size="big">
          <Segment raised style={{ overflow: "auto", height: "44.75rem" }}>
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#f4f4f4",
                display: "flex",
                alignItems: "center",
                borderRadius: ".5em",
              }}
            >
              <h3 style={{ fontFamily: "Raleway", marginBottom: "0px" }}>
                Messages
              </h3>
              <span
                style={{
                  height: "18px",
                  width: "18px",
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: "50%",
                  fontFamily: "sans-serif",
                  fontSize: "10px",
                  marginLeft: "7px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                3
              </span>
            </div>
            {chats.map((chat, i) => {
              return (
                <ChatList
                  key={i}
                  connectedUsers={connectedUsers}
                  chat={chat}
                  setChats={setChats}
                />
              );
            })}
          </Segment>
        </Comment.Group>
      </Grid.Column>
      <Grid.Column floated="right" width="11">
        <Grid.Row>
          <CommonNav user={user} />
        </Grid.Row>
        <Grid.Row>
          {router.query.message && messages.length > 0 && (
            <ChatBoard
              messages={messages}
              bannerData={bannerData}
              socket={socket}
              user={user}
              messagesWith={openChatId.current}
              setMessages={setMessages}
            />
          )}
        </Grid.Row>
      </Grid.Column>
    </Grid>
  );
};

Messages.getInitialProps = async (ctx) => {
  const { token } = parseCookies(ctx);
  try {
    const res = await axios.get(`${baseUrl}/api/chats`, {
      headers: {
        Authorization: token,
      },
    });
    return {
      chatsData: res.data,
    };
  } catch (error) {
    return {
      errorLoading: true,
    };
  }
};

export default Messages;
