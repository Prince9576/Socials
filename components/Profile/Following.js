import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Button, List, Image } from "semantic-ui-react";
import baseUrl from "../../utils/baseUrl";
import { NoFollowData } from "../Layout/NoData";
import Spinner from "../Layout/Spinner";
import router from "next/router";
import { followUser, unFollowUser } from "../../utils/profileActions";
const Following = ({
  user,
  profileUserId,
  loggedUserFollowStats,
  setLoggedUserFollowStats,
}) => {
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState([]);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const getFollowing = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${baseUrl}/api/profile/following/${profileUserId}`,
          {
            headers: {
              Authorization: Cookies.get("token"),
            },
          }
        );
        console.log("F", response);
        setFollowing(response.data);
      } catch (error) {
        console.error("Error Getting Followers", error);
      }
      setLoading(false);
    };

    getFollowing();
  }, [router.query]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : following.length > 0 ? (
        following.map((profileFollowing, index) => {
          const isFollowing =
            loggedUserFollowStats.following.length > 0 &&
            loggedUserFollowStats.following.filter((loggedUserFollowing) => {
              return loggedUserFollowing.user === profileFollowing.user._id;
            }).length > 0;

          return (
            <List
              style={{
                padding: "1rem",
                backgroundColor: index % 2 !== 0 ? "#fff" : "#f4f4f4",
              }}
              key={profileFollowing.user._id}
              divided
              verticalAlign="middle"
            >
              <List.Item>
                <List.Content floated="right">
                  {profileFollowing.user._id !== user._id && (
                    <Button
                      size="mini"
                      color={isFollowing ? "instagram" : "twitter"}
                      icon={isFollowing ? "check" : "add user"}
                      content={isFollowing ? "Following" : "Follow"}
                      disabled={followLoading}
                      style={{
                        minWidth: "150px",
                      }}
                      onClick={async () => {
                        setFollowLoading(true);
                        isFollowing
                          ? await unFollowUser({
                              userIdToUnfollow: profileFollowing.user._id,
                              setUserFollowStats: setLoggedUserFollowStats,
                            })
                          : await followUser({
                              userIdToFollow: profileFollowing.user._id,
                              setUserFollowStats: setLoggedUserFollowStats,
                            });
                        setFollowLoading(false);
                      }}
                    />
                  )}
                </List.Content>
                <Image src={profileFollowing.user.profilePicUrl} avatar />
                <List.Content
                  as="a"
                  href={`/${profileFollowing.user.username}`}
                >
                  <span
                    style={{
                      fontSize: "0.95rem",
                    }}
                  >
                    {profileFollowing.user.name}
                  </span>
                </List.Content>
              </List.Item>
            </List>
          );
        })
      ) : (
        <NoFollowData followingComponent={true} />
      )}
    </>
  );
};

export default Following;
