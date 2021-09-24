import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./Profile.module.css";
import { parseCookies } from "nookies";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import { Grid, Image } from "semantic-ui-react";
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

  const ownAccount = profile.user_id === user._id;

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
          <Image
            className={styles.dp}
            size="tiny"
            circular
            src={user.profilePicUrl}
            style={{
              bottom: "0",
              position: "absolute",
            }}
          />
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
