const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const UserModel = require("../models/UserModel");
const ProfileModel = require("../models/ProfileModel");
const FollowerModel = require("../models/FollowerModel");
const PostModel = require("../models/PostModel");
const bcrypt = require("bcryptjs");

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
      followersLength:
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
    console.log("Followers", userId);
    const user = await FollowerModel.findOne({ user: userId }).populate({
      path: "followers.user",
      model: UserModel,
    });
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
    const user = await FollowerModel.findOne({ user: userId }).populate({
      path: "following.user",
      model: UserModel,
    });
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

  if (user.user.toString() === userToFollow.user.toString())
    return res.status(401).send("Cannot Follow Itself");

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

  await userToFollow.followers.unshift({ user: userId });
  await userToFollow.save();

  return res.status(200).send("Successfully Followed");
});

// UNFOLLOW A USER
router.post("/unfollow/:userIdToUnfollow", authMiddleware, async (req, res) => {
  const { userId } = req;
  const { userIdToUnfollow } = req.params;

  try {
    const user = await FollowerModel.findOne({ user: userId });
    const userToUnfollow = await FollowerModel.findOne({
      user: userIdToUnfollow,
    });
    // console.log({ user: user, userIdToUnFollow: userToUnfollow });

    if (!user || !userToUnfollow) return res.status(404).send("Not Found");

    // Check If User is even Following or not
    const isFollowing =
      user.following.length > 0 &&
      user.following.filter(
        (following) => following.user.toString() === userIdToUnfollow
      ).length === 0;

    if (isFollowing) {
      return res.status(401).send("User not following");
    }

    // console.log({ user, following: user.following });

    const followingIndex = user.following
      .map((following) => following.user.toString())
      .indexOf(userIdToUnfollow);
    await user.following.splice(followingIndex, 1);
    await user.save();

    console.log({ userToUnfollow, followers: userToUnfollow.followers });

    const followerIndex = userToUnfollow.followers
      .map((followers) => followers.user.toString())
      .indexOf(userId);
    await userToUnfollow.followers.splice(followerIndex, 1);
    await userToUnfollow.save();
    return res.status(200).send("Successfully Unfollowed");
  } catch (error) {
    console.error("Error Unfollowing", error);
    return res.status(500).send("Internal Server Error");
  }
});

router.post("/updateProfile", authMiddleware, async (req, res) => {
  console.log("Reached /update", req.body);
  try {
    const { userId } = req;
    const { bio, instagram, facebook, youtube, twitter, profilePicUrl } =
      req.body;

    const Profile = await ProfileModel.findOne({ user: userId });
    console.log("Profile", Profile);
    let profileFields = {};
    profileFields.user = userId;
    profileFields.bio = bio;
    profileFields.social = { ...Profile.social };
    if (facebook) profileFields.social.facebook = facebook;
    if (youtube) profileFields.social.youtube = youtube;
    if (instagram) profileFields.social.instagram = instagram;
    if (twitter) profileFields.social.twitter = twitter;

    await ProfileModel.findOneAndUpdate(
      { user: userId },
      { $set: profileFields },
      { new: true }
    );
    if (profilePicUrl) {
      const user = await UserModel.findById(userId);
      user.profilePicUrl = profilePicUrl;
      await user.save();
    }

    res.status(200).send("Profile Updated");
  } catch (error) {
    console.error("Error Updating Profile", error);
    return res.status(500).send("Internal Server Error");
  }
});

// UPDATE PASSWORD
router.post("/settings/password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (newPassword.length < 6)
      return res
        .status(401)
        .json({ msg: "Password must be 6 characters long" });

    const user = await UserModel.findById(req.userId).select("+password");
    const isPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isPassword) {
      return res.status(401).json({ msg: "Incorrect Password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ msg: "Updated" });
  } catch (error) {
    console.error("Error Updating Password", error);
    return res.status(500).send("Internal Server Error");
  }
});

// UPDATE MESSAGE POPUP SETTINGS
router.post("/settings/messagePopup", authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (user.newMessagePopup) {
      user.newMessagePopup = false;
      await user.save();
    } else {
      user.newMessagePopup = true;
      await user.save();
    }
    return res.status(200).send("Successful");
  } catch (error) {
    console.error("Error Updating Message Popup", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
