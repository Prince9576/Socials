import axios from "axios";
import baseUrl from "../utils/baseUrl";
import cookie from "js-cookie";
import catchErrors from "../utils/catchErrors";
import Router from "next/router";

const Axios = axios.create({
  baseURL: `${baseUrl}/api/profile`,
  headers: {
    Authorization: cookie.get("token"),
  },
});

export const followUser = async ({ userIdToFollow, setUserFollowStats }) => {
  console.log("Following User", { userIdToFollow, setUserFollowStats });
  try {
    const res = await Axios.post(`/follow/${userIdToFollow}`);
    setUserFollowStats((prev) => ({
      ...prev,
      following: [...prev.following, { user: userIdToFollow }],
    }));
  } catch (error) {
    console.error("Error Following User", error);
  }
};

export const unFollowUser = async ({
  userIdToUnfollow,
  setUserFollowStats,
}) => {
  try {
    const res = await Axios.post(`/unfollow/${userIdToUnfollow}`);
    setUserFollowStats((prev) => ({
      ...prev,
      following: prev.following.filter(
        (following) => following.user !== userIdToUnfollow
      ),
    }));
  } catch (error) {
    console.error("Error Following User", error);
  }
};

export const updateProfile = async ({
  profile,
  setLoading,
  setError,
  setErrorMsg,
  profilePicUrl,
}) => {
  try {
    const { bio, facebook, youtube, instagram, twitter } = profile;
    const result = await Axios.post("/updateProfile", {
      bio,
      facebook,
      instagram,
      youtube,
      twitter,
      profilePicUrl,
    });
    setLoading(false);
    console.log("Result", result);
    Router.reload();
  } catch (error) {
    setError(true);
    setErrorMsg(error);
    console.error("Error Updating Profile", error);
  }
};
