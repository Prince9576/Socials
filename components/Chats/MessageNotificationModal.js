import React, { useState } from "react";
import { Form, Modal } from "semantic-ui-react";
import Link from "next/link";
import calculateTimeDiff from "../../utils/calculateTimeDiff";

const MessageNotificationModal = ({
  socket,
  setShowNewMessageModal,
  showNewMessageModal,
  newMessageReceived,
  user,
}) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Modal
        size="small"
        closeIcon
        closeOnDimmerClick
        open={showNewMessageModal}
        onClose={() => setShowNewMessageModal(false)}
      >
        <Modal.Header
          content={`New Message from ${newMessageReceived.senderName}`}
        ></Modal.Header>

        <Modal.Content>
          <div
            className="bubbleWrapper"
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              paddingBottom: "0",
              paddingLeft: "0",
            }}
          >
            <div className="inlineContainer">
              <img
                className="inlineIcon"
                src={newMessageReceived.senderProfilePicUrl}
              />
            </div>
            <div className="otherBubble other">{newMessageReceived.msg}</div>
          </div>
          <span
            className="other"
            style={{ fontSize: "0.75rem", fontFamily: "Lato" }}
          >
            {calculateTimeDiff(newMessageReceived.date)}
          </span>
          <div
            style={{
              width: "100%",
              borderRadius: "5px",
              margin: "1rem 0",
            }}
          >
            <Form
              reply
              onSubmit={(e) => {
                e.preventDefault();
                if (socket.current) {
                  socket.current.emit("sendNewMessageFromPopup", {
                    userId: user._id,
                    receiverUserId: newMessageReceived.sender,
                    msg: text,
                  });

                  socket.current.on("messageSentFromPopup", () => {
                    setShowNewMessageModal(false);
                  });
                }
              }}
            >
              <Form.Input
                size="large"
                placeholder="Send new message"
                value={text}
                action={{
                  color: "blue",
                  icon: "telegram place",
                  disabled: text === "",
                  loading: loading,
                }}
                onChange={(e) => setText(e.target.value)}
              />
            </Form>
          </div>

          <div style={{ marginTop: "5px" }}>
            <Link href={`/messages?message=${newMessageReceived.sender}`}>
              <a>View All Messages</a>
            </Link>
          </div>
        </Modal.Content>
      </Modal>
    </>
  );
};
export default MessageNotificationModal;
