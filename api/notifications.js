const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const NotificationModel = require("../models/NotificationModel");
const PostModel = require("../models/PostModel");
const UserModel = require("../models/UserModel");

router.get("/", authMiddleware, async (req, res) => {
  const { userId } = req;
  try {
    const posts = await PostModel.findOne({ user: userId });

    if (posts) {
      const notifications = await NotificationModel.findOne({ user: userId })
        .populate({ path: "notifications.user", model: UserModel })
        .populate({
          path: "notifications.post",
          model: PostModel,
          populate: {
            path: "comments",
            populate: {
              path: "user",
              model: UserModel,
            },
          },
        });
      return res.status(200).send(notifications);
    }
    const notifications = await NotificationModel.findOne({ user: userId });
    return res.status(200).send(notifications);
  } catch (error) {
    console.error("Notification GET error", error);
    return res.status(500).send("Internal Server Error");
  }
});

router.post("/", authMiddleware, async (req, res) => {
  const { userId } = req;
  try {
    const user = await UserModel.findById(userId);
    if (user.unreadNotification) {
      user.unreadNotification = false;
      await user.save();
    }
    return res.status(200).send("Updated");
  } catch (error) {
    console.error("Notification POST error", error);
    return res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
