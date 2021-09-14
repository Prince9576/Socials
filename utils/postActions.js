import axios from "axios";
import baseUrl from "../utils/baseUrl";
import cookie from "js-cookie";
import catchErrors from "../utils/catchErrors";
import { mongo } from "mongoose";

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

export const deletePost = async ({ postId, setPosts, setShowToastr }) => {
  console.log({ postId });
  try {
    const res = await Axios.delete(`/${postId}`);
    setPosts((prev) => prev.filter((post) => post._id !== postId));
    console.log(res);
    setShowToastr({
      show: true,
      type: "success",
    });
  } catch (error) {
    console.log("Delete error", { error });
    const errorMsg = catchErrors(error, console.error);
    setShowToastr({
      show: true,
      type: "error",
    });
  }
};

export const likePost = async ({ postId, userId, setLikes, like = true }) => {
  console.log({ like, postId, userId });
  try {
    if (like) {
      await Axios.put(`/like/${postId}`);
      setLikes((prev) => [...prev, { user: userId }]);
    } else {
      await Axios.put(`/unlike/${postId}`);
      setLikes((prev) => prev.filter((like) => like.user !== userId));
    }
  } catch (error) {
    console.log("Like error", { error });
    catchErrors(error, console.error);
  }
};

export const postComment = async ({
  postId,
  text,
  setText,
  user,
  setComments,
}) => {
  try {
    const res = await Axios.post(`/comment/${postId}`, { text });
    const newComment = {
      _id: res.data,
      text,
      user,
      date: Date.now(),
    };
    console.log({ res });
    setComments((prev) => [newComment, ...prev]);
    setText(text);
  } catch (error) {
    console.log("Comment error", { error });
    catchErrors(error, console.error);
  }
};

export const deleteComment = async ({
  postId,
  commentId,
  userId,
  setComments,
}) => {
  try {
    await Axios.delete(`/comment/${commentId}/${postId}`);
    setComments((prev) => prev.filter((comment) => comment._id !== commentId));
  } catch (error) {
    console.log("Delete comment error", { error });
    catchErrors(error, console.error);
  }
};
