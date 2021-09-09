const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const PostModel = require("../models/PostModel");
const UserModel = require("../models/UserModel");

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

module.exports = router;
