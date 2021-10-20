import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

import io from "socket.io-client";
import baseUrl from "../utils/baseUrl";
import { parseCookies } from "nookies";
import { Grid, Icon, Sidebar } from "semantic-ui-react";
import CommonNav from "../components/Layout/CommonNav";
import ChatBoard from "../components/Chats/ChatBoard";
import { useRouter } from "next/router";
import getUserInfo from "../utils/getUserInfo";
import newMsgSound from "../utils/newMsgSound";
import cookie from "js-cookie";
import ChatSidebar from "../components/Chats/ChatSidebar";
import { NoChats } from "../components/Layout/NoData";
import { Media } from "../utils/Media.tsx";

const Messages = ({ user, chatsData }) => {
  const [chats, setChats] = useState(chatsData);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const router = useRouter();
  const socket = useRef();
  const divRef = useRef();

  const iconStyle = {
    position: "fixed",
    zIndex: 2,
    top: "50%",
    transform: "translate(-50%,-50%)",
    fontSize: "3em",
  };

  const [messages, setMessages] = useState([]);
  const [bannerData, setBannerData] = useState({ name: "", profilePicUrl: "" });
  const openChatId = useRef("");

  const scrollToBottom = (divRef) => {
    divRef.current && divRef.current.scrollIntoView({ behaviour: "smooth" });
  };

  // CONNECTION
  useEffect(() => {
    if (!socket.current) {
      socket.current = io(baseUrl);
    }
    if (socket.current) {
      socket.current.emit("join", { userId: user._id });
      socket.current.on("connectedUsers", ({ users }) => {
        users.length > 0 && setConnectedUsers(users);
      });
    }

    if (chats && chats.length > 0 && !router.query.message) {
      router.push(`/messages?message=${chats[0].messagesWith}`, undefined, {
        shallow: true,
      });
    }

    const messagesRead = async () => {
      try {
        const res = await axios.post(
          `${baseUrl}/api/chats`,
          {},
          {
            headers: {
              Authorization: cookie.get("token"),
            },
          }
        );
        console.log("res", res);
      } catch (error) {
        console.error("Messages Read ", error);
      }
    };
    messagesRead();

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
        divRef.current && scrollToBottom(divRef);
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
        newMsgSound();
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

  useEffect(() => {
    divRef.current && scrollToBottom(divRef);
  }, [messages]);

  const sendMessage = (msg) => {
    if (socket.current) {
      socket.current.emit("sendNewMsg", {
        userId: user._id,
        receiverUserId: openChatId.current,
        msg,
      });
    }
  };

  const deleteChat = async (messagesWith) => {
    try {
      const currentChat = chats.find(
        (chat) => chat.messagesWith === messagesWith
      );
      if (!currentChat.lastMessage) {
        setChats((prev) =>
          prev.filter((chat) => chat.messagesWith !== messagesWith)
        );
        router.push("/messages");
        return;
      }
      await axios.delete(`${baseUrl}/api/chats/${messagesWith}`, {
        headers: {
          Authorization: cookie.get("token"),
        },
      });
      setChats((prev) =>
        prev.filter((chat) => chat.messagesWith !== messagesWith)
      );
      router.push("/messages");
    } catch (error) {
      console.error(error);
      alert("Error Deleting Messages");
    }
  };
  return (
    <>
      <Media greaterThanOrEqual="tab">
        <Grid>
          <Grid.Column floated="left" width="5">
            <ChatSidebar
              isSearching={isSearching}
              setIsSearching={setIsSearching}
              chats={chats}
              setChats={setChats}
              deleteChat={deleteChat}
              connectedUsers={connectedUsers}
            />
          </Grid.Column>

          <Grid.Column floated="right" width="11">
            <Grid.Row>
              <CommonNav user={user} />
            </Grid.Row>
            <Grid.Row>
              {router.query.message ? (
                <ChatBoard
                  messages={messages}
                  bannerData={bannerData}
                  socket={socket}
                  user={user}
                  messagesWith={openChatId.current}
                  setMessages={setMessages}
                  sendMessage={sendMessage}
                  divRef={divRef}
                />
              ) : (
                <NoChats />
              )}
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </Media>

      <Media lessThan="tab">
        <Grid>
          <Grid.Column floated="right" width="16">
            {!sidebarVisible && (
              <Icon
                name="arrow alternate circle right"
                color="teal"
                onClick={() => setSidebarVisible((prev) => !prev)}
                style={iconStyle}
              />
            )}
            {sidebarVisible && (
              <Icon
                name="arrow alternate circle left"
                color="teal"
                onClick={() => setSidebarVisible((prev) => !prev)}
                style={iconStyle}
              />
            )}
            <Sidebar.Pushable>
              <Sidebar
                animation="overlay"
                inverted
                onHide={() => setSidebarVisible(false)}
                vertical
                visible={sidebarVisible}
                style={{ width: "100%" }}
              >
                <ChatSidebar
                  isSearching={isSearching}
                  setIsSearching={setIsSearching}
                  chats={chats}
                  setChats={setChats}
                  deleteChat={deleteChat}
                  connectedUsers={connectedUsers}
                  setSidebarVisible={setSidebarVisible}
                />
              </Sidebar>
              <Sidebar.Pusher>
                <Grid.Row>
                  <CommonNav user={user} />
                </Grid.Row>
                <Grid.Row>
                  {router.query.message ? (
                    <ChatBoard
                      messages={messages}
                      bannerData={bannerData}
                      socket={socket}
                      user={user}
                      messagesWith={openChatId.current}
                      setMessages={setMessages}
                      sendMessage={sendMessage}
                      divRef={divRef}
                    />
                  ) : (
                    <NoChats />
                  )}
                </Grid.Row>
              </Sidebar.Pusher>
            </Sidebar.Pushable>
          </Grid.Column>
        </Grid>
      </Media>
    </>
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
