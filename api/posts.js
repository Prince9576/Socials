const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const PostModel = require("../models/PostModel");
const UserModel = require("../models/UserModel");
const uuid = require("uuid").v4;

// POST A POST
router.post("/", authMiddleware, async (req, res) => {
  const { text, picUrl, location } = req.body;
  if (text.length < 1)
    return res.status(401).send("Text must be 1 character long");

  try {
    const newPost = {
      user: req.userId,
      text,
    };

    if (location) newPost.location = location;
    if (picUrl) newPost.picUrl = picUrl;

    const post = await new PostModel(newPost).save();

    return res.json(post);
  } catch (error) {
    console.error("Error Posting Post", error);
    return res.status(500).send("Internal Server Error");
  }
});

//GET ALL POSTS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate("user")
      .populate("comments.user");
    return res.json(posts);
  } catch (error) {
    console.error("Error Getting Posts", error);
    return res.status(500).send("Internal Server Error");
  }
});

// GET POST BY ID
router.get("/:postId", authMiddleware, async (req, res) => {
  try {
    const id = req.params.postId;
    const post = await PostModel.findById(id);
    console.log({ id, post });
    if (!post) return res.status(401).send("Post Not Found");
    return res.status(200).send(post);
  } catch (error) {
    console.error("Error Getting Post", error);
    return res.status(500).send("Internal Server Error");
  }
});

// DELETE POST
router.delete("/:postId", authMiddleware, async (req, res) => {
  const { userId } = req;
  const { postId } = req.params;
  try {
    const post = await PostModel.findById(postId);
    if (!post) return res.status(401).send("Post Not Found");

    const user = await UserModel.findById(userId);
    // Check If User is admin

    if (post.user.toString() !== userId) {
      if (user.role === "root") {
        await post.remove();
        return res.status(200).send("Post Deleted Successfully");
      } else {
        return res.status(401).send("Unauthorized");
      }
    }

    await post.remove();
    return res.status(200).send("Post Deleted Successfully");
  } catch (error) {
    console.error("Error Deleting Post", error);
    return res.status(500).send("Internal Server Error");
  }
});

// LIKE A POST

router.post("/like/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { userId } = req;
  try {
    const post = await PostModel.findById(postId);
    if (!post) return res.status(401).send("Post Not Found");

    // Post already liked or not
    const isLiked =
      post.likes.filter((like) => {
        return like.user.toString() === userId;
      }).length > 0;

    console.log("Is Liked", isLiked);

    if (isLiked) return res.status(401).send("Post Already Liked");

    await post.likes.unshift({ user: userId });
    await post.save();

    return res.status(200).send("Post Liked Successfully");
  } catch (error) {
    console.error("Error Liking Post", error);
    return res.status(500).send("Internal Server Error");
  }
});

// UNLIKE A POST

router.put("/unlike/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { userId } = req;
  try {
    const post = await PostModel.findById(postId);
    if (!post) return res.status(401).send("Post Not Found");

    // Post already liked or not
    const notLiked =
      post.likes.filter((like) => {
        return like.user.toString() === userId;
      }).length === 0;

    console.log("Is Liked", notLiked);

    if (notLiked) return res.status(401).send("Post Not Liked Before");

    const index = post.likes
      .map((like) => like.user.toString())
      .indexOf(userId);
    await post.likes.splice(index, 1);
    await post.save();

    return res.status(200).send("Post Unliked Successfully");
  } catch (error) {
    console.error("Error Liking Post", error);
    return res.status(500).send("Internal Server Error");
  }
});

// GET ALL LIKES
router.get("/like/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await PostModel.findById(postId).populate("likes.user");
    if (!post) return res.status(401).send("Post Not Found");

    res.status(200).json(post.likes);
  } catch (error) {
    console.error("Error Liking Post", error);
    return res.status(500).send("Internal Server Error");
  }
});

// POST A COMMENT

router.post("/comment/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;
  try {
    if (text.length < 1)
      return res.status(401).send("Comment Must be atleast 1 character long");
    const post = await PostModel.findById(postId);
    if (!post) return res.status(401).send("Post Not Found");

    const newComment = {
      _id: uuid(),
      user: req.userId,
      text,
      date: Date.now(),
    };

    await post.comments.unshift(newComment);
    await post.save();

    return res.status(200).send("Comment added successfully");
  } catch (error) {
    console.error("Error Posting Comment", error);
    return res.status(500).send("Internal Server Error");
  }
});

// DELETE A COMMENT

router.delete(
  "/comment/:commentId/:postId",
  authMiddleware,
  async (req, res) => {
    const { commentId, postId } = req.params;
    const { userId } = req;
    try {
      const post = await PostModel.findById(postId);
      if (!post) return res.status(401).send("Post Not Found");

      const comment = post.comments.find(
        (comment) => comment._id === commentId
      );
      if (!comment) return res.status(404).send("Comment Not Found");

      const deleteComment = () => {
        const index = post.comments.map((c) => c._id).indexOf(comment._id);
        await post.comments.splice(index, 1);
        await post.save();
        return res.status(200).send("Comment Deleted Successfully");
      };
      const user = await UserModel.findById(userId);
      if (comment.user.toString() !== userId) {
        if (user.role === "root") {
          deleteComment();
        } else {
          return res.status(401).send("Unauthorized");
        }
      }

      deleteComment();
    } catch (error) {
      console.error("Error Deleting Comment", error);
      return res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
