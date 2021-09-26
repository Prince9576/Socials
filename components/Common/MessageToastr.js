import React from "react";
import { Message, Icon } from "semantic-ui-react";

const MessageToastr = ({ header, content, type }) => {
  function addStyles() {
    return {
      position: "fixed",
      bottom: "1rem",
      width: "30rem",
      left: "2rem",
    };
  }
  return type === "error" ? (
    <Message style={addStyles()} icon error size="small">
      <Icon name="warning" />
      <Message.Content>
        <Message.Header>{header}</Message.Header>
        {content}
      </Message.Content>
    </Message>
  ) : (
    <Message style={addStyles()} icon success size="small">
      <Icon name="check circle" />
      <Message.Content>
        <Message.Header>{header}</Message.Header>
        {content}
      </Message.Content>
    </Message>
  );
};

export default MessageToastr;
