const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const ProfileModel = require("../models/ProfileModel");
const FollowerModel = require("../models/FollowerModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const isEmail = require("validator/lib/isEmail");
const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
const userPng =
  "https://res.cloudinary.com/indersingh/image/upload/v1593464618/App/user_mklcpl.png";

router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    if (username.length < 1) return res.status(401).send("Invalid Username");

    if (!regexUserName.test(username))
      return res.status(401).send("Invalid Username");

    const user = await UserModel.findOne({ username: username.toLowerCase() });

    if (user) return res.status(401).send("Username already taken");

    return res.status(200).send("Available");
  } catch (err) {
    console.error("Error at signup", err);
    return res.status(500).send("Internal Server Error");
  }
});

router.post("/", async (req, res) => {
  const {
    name,
    email,
    password,
    username,
    bio,
    instagram,
    facebook,
    youtube,
    twitter,
  } = req.body.user;

  if (!isEmail(email)) return res.status(401).send("Invalid Email");
  if (password.length < 6)
    return res.status(401).send("Password should be atleast 6 characters long");

  try {
    let user;
    user = await UserModel.findOne({ email: email.toLowerCase() });
    if (user) return res.status(401).send("Email already registered");
    user = new UserModel({
      name,
      email: email.toLowerCase(),
      password,
      username: username.toLowerCase(),
      profilePicUrl: req.body.profilePicUrl || userPng,
    });
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    let profileFields = {};
    profileFields.user = user._id;
    profileFields.bio = bio;
    profileFields.social = {};
    if (facebook) profileFields.social.facebook = facebook;
    if (youtube) profileFields.social.youtube = youtube;
    if (instagram) profileFields.social.instagram = instagram;
    if (twitter) profileFields.social.twitter = twitter;

    const profile = new ProfileModel(profileFields);
    await profile.save();

    const follower = new FollowerModel({
      user: user._id,
      following: [],
      followers: [],
    });
    await follower.save();

    const payload = { userId: user._id };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "2d" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json(token);
      }
    );
  } catch (err) {
    console.error("Error at signup", err);
    return res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
