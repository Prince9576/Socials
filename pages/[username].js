import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./Profile.module.css";
import { parseCookies } from "nookies";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import { Button, Grid, Icon, Image } from "semantic-ui-react";
import Cookies from "js-cookie";
import ProfileMenuTabs from "../components/Profile/ProfileMenuTabs";

const ProfilePage = ({
  errorLoading,
  profile,
  followersLength,
  followingLength,
  userFollowStats,
  user,
}) => {
  const route = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [activeItem, setActiveItem] = useState("posts");
  const [loggedUserFollowStats, setLoggedUserFollowStats] =
    useState(userFollowStats);
  const handleItemClick = (item) => setActiveItem(item);

  console.log({ user, profile });

  const ownAccount = profile.user._id === user._id;
  const isFollowing =
    loggedUserFollowStats.following.length > 0 &&
    loggedUserFollowStats.following.filter(
      (following) => following.user === profile.user._id
    ).length > 0;

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      try {
        const { username } = route.query;
        const response = await axios.get(
          `${baseUrl}/api/profile/posts/${username}`,
          {
            headers: {
              Authorization: Cookies.get("token"),
            },
          }
        );
        console.log("profile posts resp", response);
        setPosts(response.data);
      } catch (error) {
        console.error("Error Getting Posts on Profile", error);
      }
      setLoading(false);
    };

    getPosts();
  }, []);
  console.log("Route", route);
  if (errorLoading)
    return (
      <div style={{ padding: "4rem", background: "#f4f4f4" }}>
        <Image
          size="medium"
          src="https://www.renaissancecapital.com/Content/Images/No-Profile-Found.png"
          centered
        />
      </div>
    );
  return (
    <div>
      <div className={styles.profile}>
        <div className={styles.cover}>
          <img
            style={{
              width: "100%",
              height: "8rem",
              objectFit: "cover",
              borderTopLeftRadius: "5px",
              borderTopRightRadius: "5px",
            }}
            src="https://newevolutiondesigns.com/images/freebies/rainbow-facebook-cover-1.jpg"
          />
          <div className={styles.dp}>
            <Image
              style={{
                border: "4px solid white",
                height: "130px",
                width: "130px",
              }}
              circular
              src={profile.user.profilePicUrl}
            />
            <Button
              size="mini"
              fluid
              color="blue"
              content={isFollowing ? "Following" : "Follow"}
              icon={isFollowing ? "check circle" : "add user"}
              color={isFollowing ? "instagram" : "twitter"}
            />
          </div>
        </div>
        <div className={styles["info-container"]}>
          <div className={styles.name}>{profile.user.name}</div>
          <div className={styles.socials}>
            <Icon
              name="facebook"
              className={styles.icon}
              style={{ color: "#3b5998" }}
            />
            <Icon name="youtube" className={styles.icon} color="red" />
            <Icon name="twitter" className={styles.icon} color="blue" />
            <Icon
              name="instagram"
              className={styles.icon}
              style={{ color: "#8a3ab9" }}
            />
          </div>
        </div>
      </div>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column>
            <ProfileMenuTabs
              activeItem={activeItem}
              handleItemClick={handleItemClick}
              followersLength={followersLength}
              followingLength={followingLength}
              ownAccount={ownAccount}
              loggedUserFollowStats={loggedUserFollowStats}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

ProfilePage.getInitialProps = async (ctx) => {
  try {
    const { username } = ctx.query;
    const { token } = parseCookies(ctx);
    const response = await axios.get(`${baseUrl}/api/profile/${username}`, {
      headers: {
        Authorization: token,
      },
    });
    console.log("profile resp", response);
    const { profile, followingLength, followersLength } = response.data;
    return {
      profile,
      followingLength,
      followersLength,
    };
  } catch (error) {
    return { errorLoading: true };
  }
};
export default ProfilePage;
