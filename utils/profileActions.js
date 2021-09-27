import axios from "axios";
import baseUrl from "../utils/baseUrl";
import cookie from "js-cookie";
import catchErrors from "../utils/catchErrors";

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
