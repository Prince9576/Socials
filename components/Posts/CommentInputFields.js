import React, { Fragment, useState } from "react";
import { Form } from "semantic-ui-react";
const CommentInputField = ({ postId, user, setComments }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState();
  return (
    <Fragment>
      <Form reply style={{ marginBottom: "10px" }}>
        <Form.Input
          size="mini"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add Comment"
          action={{
            color: "blue",
            icon: "edit",
            loading,
            disabled: text === "" || loading,
          }}
        />
      </Form>
    </Fragment>
  );
};

export default CommentInputField;
