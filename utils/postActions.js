import axios from "axios";
import baseUrl from "../utils/baseUrl";
import cookie from "js-cookie";
import catchErrors from "../utils/catchErrors";

const Axios = axios.create({
  baseURL: `${baseUrl}/api/posts`,
  headers: {
    Authorization: cookie.get("token"),
  },
});
export const submitNewPost = async ({
  user,
  text,
  location,
  picUrl,
  setPosts,
  setNewPost,
  setError,
}) => {
  try {
    const res = await Axios.post("/", {
      text,
      location,
      picUrl,
    });
    console.log("Res", { res });
    const newPost = {
      _id: res.data,
      user,
      text,
      location,
      picUrl,
      likes: [],
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
    setNewPost({ text: "", location: "" });
  } catch (error) {
    const errorMsg = catchErrors(error);
    setError(errorMsg);
  }
};
