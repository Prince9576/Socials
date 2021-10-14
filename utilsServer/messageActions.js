const ChatModel = require("../models/ChatModel");

const loadMessages = async (userId, messagesWith) => {
  try {
    console.log("123 entered");
    const user = await ChatModel.findOne({ user: userId }).populate(
      "chats.messagesWith"
    );
    const chat = user.chats.find(
      (chat) => chat.messagesWith._id.toString() === messagesWith
    );

    if (!chat) {
      return { error: "No Chat found" };
    }

    return { chat };
  } catch (error) {
    return { error };
  }
};

module.exports = { loadMessages };
