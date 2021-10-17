import React from "react";
import calculateTimeDiff from "../../utils/calculateTimeDiff";

const Message = ({
  message,
  user,
  setMessages,
  messagesWith,
  senderProfilePic,
  divRef,
}) => {
  const ifYouSender = message.sender === user._id;

  return (
    <div className="bubbleWrapper" ref={divRef}>
      <div className={ifYouSender ? "inlineContainer own" : "inlineContainer"}>
        <img
          className="inlineIcon"
          src={ifYouSender ? user.profilePicUrl : senderProfilePic}
        />
        <div className={ifYouSender ? "ownBubble own" : "otherBubble other"}>
          {message.msg}
        </div>
      </div>
      <span
        style={{
          fontFamily: "Lato",
          fontSize: "0.75rem",
        }}
        className={ifYouSender ? "own" : "other"}
      >
        {calculateTimeDiff(message.date)}
      </span>
    </div>
  );
};

export default Message;
