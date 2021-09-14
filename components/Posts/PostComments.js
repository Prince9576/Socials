import React, { Fragment, useState } from "react";
import { Comment, Divider, Icon, Image } from "semantic-ui-react";
import calculateTimeDiff from "../../utils/calculateTimeDiff";
import { deleteComment } from "../../utils/postActions";

const PostComments = ({ comment, postId, user, setComments, lastComment }) => {
  const [disabled, setDisabled] = useState(false);
  return (
    <Fragment>
      <Comment.Group size="tiny">
        <Comment>
          <Comment.Avatar src={comment.user.profilePicUrl} />
          {(user.role === "root" || comment.user._id === user._id) && (
            <Image floated="right">
              <Icon
                name="trash alternate"
                style={{ cursor: "pointer" }}
                color="red"
                disabled={disabled}
                onClick={async () => {
                  setDisabled(true);
                  await deleteComment({
                    postId,
                    commentId: comment._id,
                    user,
                    setComments,
                  });
                  setDisabled(false);
                }}
              />{" "}
            </Image>
          )}
          <Comment.Content>
            <Comment.Author as="a" href={`/${comment.user.username}`}>
              {comment.user.name}
            </Comment.Author>
            <Comment.Metadata style={{ fontFamily: "Lato" }}>
              {calculateTimeDiff(comment.date)}
            </Comment.Metadata>
            <Comment.Text>{comment.text}</Comment.Text>
          </Comment.Content>
        </Comment>
      </Comment.Group>
      {!lastComment && <Divider style={{ borderTop: "1px solid #f7f7f7" }} />}
    </Fragment>
  );
};

export default PostComments;
