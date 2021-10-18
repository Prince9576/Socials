import React from "react";
import { Divider, Feed } from "semantic-ui-react";
import calculateTimeDiff from "../../utils/calculateTimeDiff";

const FollowerNotificaiton = ({ notification }) => {
  console.log("Follower Notification", { notification });
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
              started following you.
              <Feed.Date style={{ fontFamily: "Lato" }}>
                {calculateTimeDiff(notification.date)}
              </Feed.Date>
            </>
          </Feed.Summary>
        </Feed.Content>
      </Feed.Event>
      <Divider />
    </>
  );
};

export default FollowerNotificaiton;
