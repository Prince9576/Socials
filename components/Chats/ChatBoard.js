import React from "react";
import Message from "./Message";
import Banner from "./Banner";
import MessageInputField from "./MessageInputField";

const ChatBoard = ({
  messages,
  bannerData,
  socket,
  user,
  messagesWith,
  setMessages,
  sendMessage,
}) => {
  console.log("Messages", messages);
  return (
    <div
      style={{
        height: "40rem",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow:
          "0 2px 4px 0 rgb(34 36 38 / 12%), 0 2px 10px 0 rgb(34 36 38 / 15%)",
      }}
    >
      <div>
        <Banner bannerData={bannerData} />
      </div>
      <div
        style={{
          flex: "0 0 80%",
          padding: "1rem",
          overflow: "auto",
          borderRadius: "4px",
          backgroundColor: "#f4f4f4",
        }}
      >
        {messages.map((message, i) => {
          return (
            <Message
              message={message}
              key={i}
              user={user}
              messagesWith={messagesWith}
              senderProfilePic={bannerData.profilePicUrl}
              setMessages={setMessages}
            />
          );
        })}
      </div>
      <div>
        <MessageInputField sendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default ChatBoard;
