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
        return (
          notification.type === "newLike" &&
          notification.user.toString() === userId &&
          notification.post.toString() === postId
        );
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

const newCommentNotification = async (
  userId,
  postId,
  commentId,
  userIdToNotify,
  text
) => {
  try {
    const userToNotify = await NotificationModel.findOne({
      user: userIdToNotify,
    });
    const newNotificaiton = {
      type: "newComment",
      post: postId,
      user: userId,
      commentId,
      text,
      date: Date.now(),
    };

    await userToNotify.notifications.unshift(newNotificaiton);
    await userToNotify.save();
    await setNotificationsToUnread(userIdToNotify);
  } catch (error) {
    console.log("Error getting notification");
  }
};

const newRemoveCommentNotification = async (
  userId,
  postId,
  commentId,
  userIdToNotify
) => {
  try {
    const userToNotify = await NotificationModel.findOne({
      user: userIdToNotify,
    });

    const notificationToRemove = userToNotify.notifications.find(
      (notification) => {
        return (
          notification.type === "newComment" &&
          notification.user.toString() === userId &&
          notification.post.toString() === postId &&
          notification.commentId === commentId
        );
      }
    );

    console.log({ notificationToRemove });

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

const newFollowerNotification = async (userId, userIdToNotify) => {
  try {
    console.log("New follower Notif Called");
    const userToNotify = await NotificationModel.findOne({
      user: userIdToNotify,
    });
    const newNotificaiton = {
      type: "newFollower",
      user: userId,
      date: Date.now(),
    };

    await userToNotify.notifications.unshift(newNotificaiton);
    await userToNotify.save();
    await setNotificationsToUnread(userIdToNotify);
  } catch (error) {
    console.error("Notification follower remove", error);
  }
};

const newRemoveFollowerNotification = async (userId, userIdToNotify) => {
  try {
    const userToNotify = await NotificationModel.findOne({
      user: userIdToNotify,
    });
    const notificationToRemove = userToNotify.notifications.find(
      (notification) => {
        return (
          notification.type === "newFollower" &&
          notification.user.toString() === userId
        );
      }
    );

    console.log({
      notificationToRemove,
    });

    const index = userToNotify.notifications
      .map((notification) => notification._id.toString())
      .indexOf(notificationToRemove._id.toString());

    await userToNotify.notifications.splice(index, 1);
    await userToNotify.save();
  } catch (error) {
    console.error("Remving follower notif failed", error);
  }
};
module.exports = {
  newLikeNotification,
  newRemoveLikeNotification,
  newCommentNotification,
  newRemoveCommentNotification,
  newFollowerNotification,
  newRemoveFollowerNotification,
};
