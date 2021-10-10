import React from "react";
import { Divider, Feed } from "semantic-ui-react";
import calculateTimeDiff from "../../utils/calculateTimeDiff";

const CommentNotificaiton = ({ notification }) => {
  return (
    <>
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
              <a href={`/post/${notification.post._id}`}> Post </a>
              <Feed.Date style={{ fontFamily: "Lato" }}>
                {calculateTimeDiff(notification.date)}
              </Feed.Date>
            </>
          </Feed.Summary>
          {notification.post.picUrl && (
            <Feed.Extra images>
              {" "}
              <a href={`/post/${notification.post._id}`}>
                <img src={notification.post.picUrl} />
              </a>{" "}
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
