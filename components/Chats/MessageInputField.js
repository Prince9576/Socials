import React, { useState } from "react";
import { Form } from "semantic-ui-react";

const MessageInputField = ({ sendMessage }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <div
      style={{
        width: "100%",
        borderRadius: "5px",
      }}
    >
      <Form
        reply
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(text);
          setText("");
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
  );
};

export default MessageInputField;
