const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const UserModel = require("../models/UserModel");
const ProfileModel = require("../models/ProfileModel");
const FollowerModel = require("../models/FollowerModel");
const PostModel = require("../models/PostModel");

// GET PROFILE INFO
router.get("/:username", authMiddleware, async (req, res) => {
  try {
    const { username } = req.params;
    const user = await UserModel.findOne({ username: username.toLowerCase() });
    if (!user) return res.status(401).send("User Not Found");

    const profile = await ProfileModel.findOne({ user: user._id }).populate({
      path: "user",
      model: UserModel,
    });
    const followerStats = await FollowerModel.findOne({ user: user._id });

    res.status(200).json({
      profile,
      followingLength:
        followerStats.following.length > 0 ? followerStats.following.length : 0,
      followerLength:
        followerStats.followers.length > 0 ? followerStats.followers.length : 0,
    });
  } catch (error) {
    console.error("Error fetching Profile", error);
    return res.status(500).send("Internal Server Error");
  }
});

// GET ALL POSTS OF A USER

router.get("/posts/:username", authMiddleware, async (req, res) => {
  try {
    const { username } = req.params;
    const user = await UserModel.findOne({ username: username.toLowerCase() });
    if (!user) return res.status(401).send("User Not Found");

    const posts = await PostModel.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate("user")
      .populate("comments.user");

    res.json(posts);
  } catch (error) {
    console.error("Error fetching Profile Posts", error);
    return res.status(500).send("Internal Server Error");
  }
});

// GET FOLLOWERS
router.get("/followers/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = FollowerModel.findOne({ user: userId }).populate(
      "followers.user"
    );
    res.status(200).json(user.followers);
  } catch (error) {
    console.error("Error fetching Followers", error);
    return res.status(500).send("Internal Server Error");
  }
});

// GET FOLLOWING
router.get("/following/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = FollowerModel.findOne({ user: userId }).populate(
      "following.user"
    );
    res.status(200).json(user.following);
  } catch (error) {
    console.error("Error fetching Followers", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
