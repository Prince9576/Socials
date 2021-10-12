const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const ChatModel = require("../models/ChatModel");

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

module.exports = router;
