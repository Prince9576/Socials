import axios from "axios";
import React, { useEffect, useState } from "react";
import baseUrl from "../utils/baseUrl";
import { parseCookies } from "nookies";
import cookie from "js-cookie";
import { NoNotifications } from "../components/Layout/NoData";
import LikeNotificaiton from "../components/Notifications/LikeNotification";
import CommentNotificaiton from "../components/Notifications/CommentNotification";
import FollowerNotificaiton from "../components/Notifications/FollowerNotification";
import { Feed } from "semantic-ui-react";

const Notifications = ({
  notifications,
  errorLoading,
  user,
  userFollowStats,
}) => {
  const [loggedInUserFollowStats, setUserFollowerStats] =
    useState(userFollowStats);
  console.log("Inside Notif", notifications);
  useEffect(() => {
    const notificationsRead = async () => {
      try {
        await axios.post(
          `${baseUrl}/api/notifications`,
          {},
          {
            headers: {
              Authorization: cookie.get("token"),
            },
          }
        );
      } catch (error) {
        console.error("Notifications Read ", error);
      }
    };
    notificationsRead();
  }, []);

  return (
    <>
      {notifications.length <= 0 && <NoNotifications />}
      {notifications.length > 0 && (
        <>
          <div
            style={{
              minHeight: "10rem",
              maxHeight: "45rem",
              overflow: "auto",
              padding: "20px 25px",
              background: "#f9f9f9",
              width: "100%",
            }}
          >
            <Feed size="small">
              {notifications.map((notification) => {
                return (
                  <>
                    {
                      <>
                        {notification.type === "newLike" &&
                          notification.post !== null && (
                            <LikeNotificaiton
                              user={user}
                              notification={notification}
                            />
                          )}
                        {notification.type === "newComment" &&
                          notification.post !== null && (
                            <CommentNotificaiton
                              user={user}
                              notification={notification}
                            />
                          )}
                        {notification.type === "newFollower" && (
                          <FollowerNotificaiton notification={notification} />
                        )}
                      </>
                    }
                  </>
                );
              })}
            </Feed>
          </div>
        </>
      )}
    </>
  );
};

Notifications.getInitialProps = async (ctx) => {
  const { token } = parseCookies(ctx);
  try {
    const res = await axios.get(`${baseUrl}/api/notifications`, {
      headers: {
        Authorization: token,
      },
    });
    return {
      notifications: res.data.notifications,
    };
  } catch (error) {
    return {
      errorLoading: true,
    };
  }
};

export default Notifications;
