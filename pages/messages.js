import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

import io from "socket.io-client";
import baseUrl from "../utils/baseUrl";
import { parseCookies } from "nookies";
import { Comment, Grid, Icon, Segment } from "semantic-ui-react";
import CommonNav from "../components/Layout/CommonNav";
import ChatList from "../components/Chats/ChatList";
import ChatBoard from "../components/Chats/ChatBoard";
import { useRouter } from "next/router";
import ChatListSearchComponent from "../components/Chats/ChatListSearch";
import getUserInfo from "../utils/getUserInfo";

const Messages = ({ user, chatsData }) => {
  const [chats, setChats] = useState(chatsData);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const socket = useRef();

  const [messages, setMessages] = useState([]);
  const [bannerData, setBannerData] = useState({ name: "", profilePicUrl: "" });
  const openChatId = useRef("");

  // CONNECTION
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

    if (chats && chats.length > 0 && !router.query.message) {
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

  // GET CHAT
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

      socket.current.on("noChatFound", async () => {
        console.log("Result no chat found", res);
        const res = await getUserInfo(router.query.message);
        if (!res.error) {
          setBannerData({ name: res.name, profilePicUrl: res.profilePicUrl });
          setMessages([]);
          openChatId.current = router.query.message;
        }
      });
    };

    if (socket.current) {
      loadMessages();
    }
  }, [router.query.message]);

  // SEND NEW MESSAGE
  useEffect(() => {
    if (socket.current) {
      socket.current.on("messageSent", ({ newMsg }) => {
        if (newMsg.receiver === openChatId.current) {
          setMessages((prev) => [...prev, newMsg]);
          setChats((prev) => {
            const previousChat = prev.find(
              (chat) => chat.messagesWith === newMsg.receiver
            );
            previousChat.lastMessage = newMsg.msg;
            previousChat.date = newMsg.date;

            return [...prev];
          });
        }
      });

      // RECEIVING MESSAGE WHEN CHAT IS OPEN
      socket.current.on("newMsgReceived", async ({ newMsg }) => {
        if (newMsg.sender === openChatId.current) {
          setMessages((prev) => [...prev, newMsg]);
          setChats((prev) => {
            const previousChat = prev.find(
              (chat) => chat.messagesWith === newMsg.sender
            );
            previousChat.lastMessage = newMsg.msg;
            previousChat.date = newMsg.date;

            return [...prev];
          });
        } else {
          // RECEIVING MESSAGE WHEN CHAT IS CLOSED && IF PREVIOUSLY MESSAGED
          const isPreviouslyMessaged =
            chats.filter((chat) => chat.messagesWith === newMsg.sender).length >
            0;

          console.log({ isPreviouslyMessaged });
          if (isPreviouslyMessaged) {
            setChats((prev) => {
              const previousChat = prev.find(
                (chat) => chat.messagesWith === newMsg.sender
              );
              previousChat.lastMessage = newMsg.msg;
              previousChat.date = newMsg.date;

              return [...prev];
            });
          } else {
            console.log("Setting chat");
            const { name, profilePicUrl } = await getUserInfo(newMsg.sender);
            const newChat = {
              messagesWith: newMsg.sender,
              name,
              profilePicUrl,
              lastMessage: newMsg.msg,
              date: newMsg.date,
            };

            setChats((prev) => [newChat, ...prev]);
          }
        }
      });
    }
  }, []);

  const sendMessage = (msg) => {
    if (socket.current) {
      socket.current.emit("sendNewMsg", {
        userId: user._id,
        receiverUserId: openChatId.current,
        msg,
      });
    }
  };
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
                justifyContent: "space-between",
              }}
            >
              {!isSearching && (
                <>
                  <h3 style={{ fontFamily: "Raleway", marginBottom: "0px" }}>
                    Messages
                  </h3>
                  <Icon
                    name="search"
                    color="grey"
                    size="large"
                    onClick={() => setIsSearching(true)}
                    style={{ cursor: "pointer" }}
                  />
                </>
              )}

              {isSearching && (
                <>
                  <ChatListSearchComponent
                    setChats={setChats}
                    chats={chats}
                    shrinken={true}
                  />
                  <Icon
                    name="close"
                    color="grey"
                    size="large"
                    onClick={() => setIsSearching(false)}
                    style={{ cursor: "pointer" }}
                  />
                </>
              )}
            </div>
            {chats && chats.length > 0
              ? chats.map((chat, i) => {
                  return (
                    <ChatList
                      key={i}
                      connectedUsers={connectedUsers}
                      chat={chat}
                      setChats={setChats}
                    />
                  );
                })
              : "No Chats Found"}
          </Segment>
        </Comment.Group>
      </Grid.Column>
      <Grid.Column floated="right" width="11">
        <Grid.Row>
          <CommonNav user={user} />
        </Grid.Row>
        <Grid.Row>
          {router.query.message && (
            <ChatBoard
              messages={messages}
              bannerData={bannerData}
              socket={socket}
              user={user}
              messagesWith={openChatId.current}
              setMessages={setMessages}
              sendMessage={sendMessage}
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
