const UserModel = require("../models/UserModel");
const NotificationModel = require("../models/NotificationModel");

const setNotificationsToUnread = async (userId) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user.unreadNotification) {
      user.unreadNotification = true;
      await user.save();
    }
    return;
  } catch (error) {
    console.error("Error setting Notifications", error);
  }
};

const newLikeNotification = async (userId, postId, userIdToNotify) => {
  try {
    const userToNotify = await NotificationModel.findOne({
      user: userIdToNotify,
    });

    const notification = {
      user: userId,
      type: "newLike",
      post: postId,
      date: Date.now(),
    };

    await userToNotify.notifications.unshift(notification);
    await userToNotify.save();
    await setNotificationsToUnread(userIdToNotify);
    return;
  } catch (error) {
    console.error("Error Generating Notifications", error);
  }
};

const newRemoveLikeNotification = async (userId, postId, userIdToNotify) => {
  try {
    const userToNotify = await NotificationModel.findOne({
      user: userIdToNotify,
    });

    const notificationToRemove = userToNotify.notifications.find(
      (notification) => {
        notification.type === "newLike" &&
          notification.user.toString() === userId &&
          notification.post.toString() === postId;
      }
    );

    const index = userToNotify.notifications
      .map((n) => n._id.toString())
      .indexOf(notificationToRemove._id.toString());

    await userToNotify.notifications.splice(index, 1);
    await userToNotify.save();
    return;
  } catch (error) {
    console.error("Error removing Notifications", error);
  }
};

module.exports = { newLikeNotification, newRemoveLikeNotification };
