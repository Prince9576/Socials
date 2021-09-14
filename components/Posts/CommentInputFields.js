import React, { Fragment, useState } from "react";
import { Form } from "semantic-ui-react";
import { postComment } from "../../utils/postActions";
const CommentInputField = ({ postId, user, setComments }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await postComment({ postId, text, setText, user, setComments });
    setLoading(false);
    setText("");
  };
  return (
    <Fragment>
      <Form reply style={{ marginBottom: "10px" }} onSubmit={handleSubmit}>
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
