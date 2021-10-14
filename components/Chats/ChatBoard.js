import React from "react";
import { Grid } from "semantic-ui-react";
import Banner from "./Banner";
import MessageInputField from "./MessageInputField";

const ChatBoard = ({ messages, bannerData, socket, user, messagesWith }) => {
  return (
    <div
      style={{
        boxShadow:
          "0 2px 4px 0 rgb(34 36 38 / 12%), 0 2px 10px 0 rgb(34 36 38 / 15%);",
        height: "40rem",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Banner bannerData={bannerData} />
      </div>
      <div style={{ flex: "0 0 80%", padding: "1rem", overflow: "auto" }}>
        Messages Area
      </div>
      <div>
        <MessageInputField
          socket={socket}
          user={user}
          messagesWith={messagesWith}
        />
      </div>
    </div>
  );
};

export default ChatBoard;
