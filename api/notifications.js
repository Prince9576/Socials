const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const NotificationModel = require("../models/NotificationModel");
const PostModel = require("../models/PostModel");
const UserModel = require("../models/UserModel");

router.get("/", authMiddleware, async (req, res) => {
  const { userId } = req;
  try {
    const notifications = await NotificationModel.findOne({ user: userId })
      .populate({
        path: "notifications.post",
        model: PostModel,
      })
      .populate({ path: "notifications.user", model: UserModel });
    return res.status(200).send(notifications);
  } catch (error) {
    console.error("Notification GET error", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
