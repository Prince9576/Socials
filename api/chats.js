const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const ChatModel = require("../models/ChatModel");
const UserModel = require("../models/UserModel");

// GET ALL CHATS

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const user = await ChatModel.findOne({ user: userId }).populate(
      "chats.messagesWith"
    );
    let chatsToBeSent = [];
    if (user.chats.length > 0) {
      chatsToBeSent = user.chats.map((chat) => {
        console.log({ chat });
        return {
          messagesWith: chat.messagesWith._id,
          name: chat.messagesWith.name,
          profilePicUrl: chat.messagesWith.profilePicUrl,
          lastMessage: chat.chat[chat.chat.length - 1].msg,
          date: chat.chat[chat.chat.length - 1].date,
        };
      });
    }

    return res.status(200).json(chatsToBeSent);
  } catch (error) {
    console.error("Chat fetch error", error);
    return res.status(500).send("Internal Server Error");
  }
});

router.get("/user/:userToFindId", authMiddleware, async (req, res) => {
  try {
    const { userToFindId } = req.params;
    const user = await UserModel.findById(userToFindId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    return res
      .status(200)
      .json({ name: user.name, profilePicUrl: user.profilePicUrl });
  } catch (error) {
    console.error("Chat User Info fetch error", error);
    return res.status(500).send("Internal Server Error");
  }
});

router.delete("/:messagesWith", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const { messagesWith } = req.params;
    console.log("Deleting Chat", { userId, messagesWith });
    const user = await ChatModel.findOne({ user: userId });
    console.log("User to be deleted", { user });
    const chatToDelete = user.chats.find(
      (chat) => chat.messagesWith.toString() === messagesWith
    );

    if (!chatToDelete) {
      return res.status(404).send("No chat found");
    }

    const index = user.chats
      .map((chat) => chat.messagesWith.toString())
      .indexOf(messagesWith);
    user.chats.splice(index, 1);
    await user.save();

    return res.status(200).send("Chat Deleted Successfully");
  } catch (error) {
    console.error("Chat Delete Error ", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
