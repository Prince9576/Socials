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

// FOLLOW A USER
router.post("/follow/:userIdToFollow", authMiddleware, async (req, res) => {
  const { userId } = req;
  const { userIdToFollow } = req.params;

  const user = await FollowerModel.findOne({ user: userId });
  const userToFollow = await FollowerModel.findOne({ user: userIdToFollow });

  if (!user || !userToFollow) return res.status(404).send("Not Found");

  // Check If User is Already Following
  const isFollowing =
    user.following.length > 0 &&
    user.following.filter(
      (following) => following.user.toString() === userIdToFollow
    ).length > 0;

  if (isFollowing) {
    return res.status(401).send("User already following");
  }

  await user.following.unshift({ user: userIdToFollow });
  await user.save();

  await userToFollow.followers.unshift({ user: user });
  await userToFollow.save();

  return res.status(200).send("Successfully Followed");
});

// UNFOLLOW A USER
router.post("/unfollow/:userIdToUnfollow", authMiddleware, async (req, res) => {
  const { userId } = req;
  const { userIdToUnfollow } = req.params;

  const user = await FollowerModel.findOne({ user: userId });
  const userToUnfollow = await FollowerModel.findOne({
    user: userIdToUnfollow,
  });

  if (!user || !userToUnfollow) return res.status(404).send("Not Found");

  // Check If User is even Following or not
  const isFollowing =
    user.following.length > 0 &&
    user.following.filter(
      (following) => following.user.toString() === userIdToUnfollow
    ).length > 0;

  if (isFollowing) {
    return res.status(401).send("User not following");
  }

  const followingIndex = user.following
    .map((following) => following.user.toString())
    .indexOf(userIdToUnfollow);
  await user.following.splice(followingIndex, 1);
  await user.save();

  const followerIndex = userToUnfollow.followers
    .map((followers) => followers.user.toString())
    .indexOf(userId);
  await userIdToUnfollow.followers.splice(followerIndex, 1);
  await userToFollow.save();
  return res.status(200).send("Successfully Unfollowed");
});

module.exports = router;
