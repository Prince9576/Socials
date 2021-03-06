import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Button, List, Image } from "semantic-ui-react";
import baseUrl from "../../utils/baseUrl";
import { NoFollowData } from "../Layout/NoData";
import Spinner from "../Layout/Spinner";
import router from "next/router";
import { followUser, unFollowUser } from "../../utils/profileActions";
const Followers = ({
  user,
  profileUserId,
  loggedUserFollowStats,
  setLoggedUserFollowStats,
}) => {
  const [loading, setLoading] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const getFollowers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${baseUrl}/api/profile/followers/${profileUserId}`,
          {
            headers: {
              Authorization: Cookies.get("token"),
            },
          }
        );
        console.log("F", response);
        setFollowers(response.data);
      } catch (error) {
        console.error("Error Getting Followers", error);
      }
      setLoading(false);
    };

    getFollowers();
  }, [router.query]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : followers.length > 0 ? (
        followers.map((follower, index) => {
          const isFollowing =
            loggedUserFollowStats.following.length > 0 &&
            loggedUserFollowStats.following.filter((loggedUserFollowing) => {
              return loggedUserFollowing.user === follower.user._id;
            }).length > 0;

          return (
            <List
              style={{
                padding: "1rem",
                backgroundColor: index % 2 !== 0 ? "#fff" : "#f4f4f4",
              }}
              key={follower.user._id}
              divided
              verticalAlign="middle"
            >
              <List.Item>
                <List.Content floated="right">
                  {follower.user._id !== user._id && (
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
                              userIdToUnfollow: follower.user._id,
                              setUserFollowStats: setLoggedUserFollowStats,
                            })
                          : await followUser({
                              userIdToFollow: follower.user._id,
                              setUserFollowStats: setLoggedUserFollowStats,
                            });
                        setFollowLoading(false);
                      }}
                    />
                  )}
                </List.Content>
                <Image src={follower.user.profilePicUrl} avatar />
                <List.Content as="a" href={`/${follower.user.username}`}>
                  <span
                    style={{
                      fontSize: "0.95rem",
                    }}
                  >
                    {follower.user.name}
                  </span>
                </List.Content>
              </List.Item>
            </List>
          );
        })
      ) : (
        <NoFollowData followersComponent={true} />
      )}
    </>
  );
};

export default Followers;
