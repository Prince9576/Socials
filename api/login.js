const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const FollowerModel = require("../models/FollowerModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const isEmail = require("validator/lib/isEmail");
const authMiddleware = require("../middleware/authMiddleware");
const NotificationModel = require("../models/NotificationModel");

router.get("/", authMiddleware, async (req, res) => {
  const userId = req.userId;
  try {
    const user = await UserModel.findById(userId);
    const followerStats = await FollowerModel.findOne({ user: userId });
    return res.status(200).json({
      user,
      followerStats,
    });
  } catch (err) {
    console.error("Error getting auth", err);
    return res.status(500).send("Internal Server Error");
  }
});

router.post("/", async (req, res) => {
  const { email, password } = req.body.user;

  if (!isEmail(email)) return res.status(401).send("Invalid Email");
  if (password.length < 6)
    return res.status(401).send("Password should be atleast 6 characters long");

  try {
    let user;
    user = await UserModel.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!user) return res.status(401).send("Email id not registered");

    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) return res.status(401).send("Password is wrong");

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

    const notificationModel = await NotificationModel.findOne({
      user: user._id,
    });
    if (!notificationModel) {
      await new NotificationModel({ user: user._id, notifications: [] }).save();
    }
  } catch (err) {
    console.error("Error at signup", err);
    return res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
