import React, { useState } from "react";
import { Divider, Feed, Modal } from "semantic-ui-react";
import calculateTimeDiff from "../../utils/calculateTimeDiff";
import PostModal from "../Posts/PostModal";

const CommentNotificaiton = ({ notification, user }) => {
  const [likes, setLikes] = useState(notification.post.likes);
  const [comments, setComments] = useState(notification.post.comments);
  const [showModal, setShowModal] = useState(false);
  const isLiked =
    likes.length > 0 &&
    likes.filter((like) => like.user === user._id).length > 0;
  return (
    <>
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        closeIcon
        closeOnDimmerClick
        style={{
          width: !notification.post.picUrl && "35%",
        }}
      >
        <PostModal
          post={notification.post}
          user={user}
          likes={likes}
          setLikes={setLikes}
          isLiked={isLiked}
          comments={comments}
          setComments={setComments}
          imageAvailable={notification.post.picUrl}
        />
      </Modal>
      <Feed.Event>
        <Feed.Label
          style={{ height: "32.5px", width: "32.5px", overflow: "hidden" }}
          image={notification.user.profilePicUrl}
        />
        <Feed.Content>
          <Feed.Summary>
            <>
              <Feed.User as="a" href={`/${notification.user.username}`}>
                {notification.user.name}
              </Feed.User>{" "}
              commented on your{" "}
              <span
                style={{ color: "#4183c4", cursor: "pointer" }}
                onClick={() => {
                  setShowModal(true);
                }}
              >
                Post
              </span>
              <Feed.Date style={{ fontFamily: "Lato" }}>
                {calculateTimeDiff(notification.date)}
              </Feed.Date>
            </>
          </Feed.Summary>
          {notification.post.picUrl && (
            <Feed.Extra images>
              <img
                style={{
                  border: "3px solid white",
                  cursor: "pointer",
                }}
                src={notification.post.picUrl}
                onClick={() => {
                  setShowModal(true);
                }}
              />
            </Feed.Extra>
          )}
          <Feed.Extra text>
            <strong>"{notification.text}"</strong>
          </Feed.Extra>
        </Feed.Content>
      </Feed.Event>
      <Divider />
    </>
  );
};

export default CommentNotificaiton;
