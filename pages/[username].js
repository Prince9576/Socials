import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { parseCookies } from "nookies";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import { Grid, Image } from "semantic-ui-react";
import Cookies from "js-cookie";
import ProfileMenuTabs from "../components/Profile/ProfileMenuTabs";
import ProfileHeader from "../components/Profile/ProfileHeader";
import { PlaceHolderPosts } from "../components/Layout/PlaceHolderGroup";
import CardPost from "../components/Posts/CardPost";
import MessageToastr from "../components/Common/MessageToastr";
import { NoPosts } from "../components/Layout/NoData";
import Followers from "../components/Profile/Followers";
import Following from "../components/Profile/Following";
import { UpdateProfile } from "../components/Profile/UpdateProfile";
import ProfileSettings from "../components/Profile/ProfileSettings";

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
  const [showToastr, setShowToastr] = useState({ show: false, type: "" });

  const [activeItem, setActiveItem] = useState("posts");
  const [loggedUserFollowStats, setLoggedUserFollowStats] =
    useState(userFollowStats);
  const handleItemClick = (item) => setActiveItem(item);

  console.log("Profile Data", { user, profile });

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
  }, [route.query.username]);

  useEffect(() => {
    if (showToastr) {
      setTimeout(() => {
        setShowToastr(false);
      }, 3000);
    }
  }, [showToastr]);

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
      <ProfileHeader
        profile={profile}
        isFollowing={isFollowing}
        loading={loading}
        user={user}
        setUserFollowStats={setLoggedUserFollowStats}
      />
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

        <Grid.Row>
          <Grid.Column>
            {activeItem === "posts" && (
              <>
                {loading ? (
                  <PlaceHolderPosts />
                ) : posts.length > 0 ? (
                  <>
                    {posts.map((post) => (
                      <CardPost
                        key={post._id}
                        post={post}
                        setPosts={setPosts}
                        setShowToastr={setShowToastr}
                        user={user}
                      />
                    ))}
                  </>
                ) : (
                  <NoPosts />
                )}
              </>
            )}

            {activeItem === "followers" && (
              <Followers
                user={user}
                profileUserId={profile.user._id}
                loggedUserFollowStats={loggedUserFollowStats}
                setLoggedUserFollowStats={setLoggedUserFollowStats}
              />
            )}
            {activeItem === "following" && (
              <Following
                user={user}
                profileUserId={profile.user._id}
                loggedUserFollowStats={loggedUserFollowStats}
                setLoggedUserFollowStats={setLoggedUserFollowStats}
              />
            )}
            {activeItem === "update" && <UpdateProfile Profile={profile} />}
            {activeItem === "settings" && (
              <ProfileSettings newMessagePopup={user.newMessagePopup} />
            )}
          </Grid.Column>
        </Grid.Row>
        {showToastr.show && showToastr.type === "error" && (
          <MessageToastr
            type={showToastr.type}
            header="Delete Unsuccessful"
            content="The post cannot be deleted right now, Please try again later."
          />
        )}
        {showToastr.show && showToastr.type === "success" && (
          <MessageToastr
            type={showToastr.type}
            header="Post Deleted Successfully"
            content="The post have been deleted successfully !"
          />
        )}
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
