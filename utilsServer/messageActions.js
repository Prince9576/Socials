const ChatModel = require("../models/ChatModel");
const UserModel = require("../models/UserModel");

const loadMessages = async (userId, messagesWith) => {
  try {
    if (!userId || !messagesWith) {
      return { error: "No info" };
    }
    const user = await ChatModel.findOne({ user: userId }).populate(
      "chats.messagesWith"
    );
    const chat = user.chats.find(
      (chat) => chat.messagesWith._id.toString() === messagesWith
    );
    console.log("123 entered", { chat, messagesWith });
    if (!chat) {
      return { error: "No_Chat_found" };
    }

    return { chat };
  } catch (error) {
    return { error };
  }
};

const sendNewMessage = async ({ userId, receiverUserId, msg }) => {
  console.log("Sending Message", { userId, receiverUserId, msg });
  try {
    const sender = await ChatModel.findOne({ user: userId });

    const receiver = await ChatModel.findOne({ user: receiverUserId });

    const newMsg = {
      msg,
      sender: userId,
      receiver: receiverUserId,
      date: Date.now(),
    };

    await sendNewMessageHelper(newMsg, sender, receiverUserId);
    await sendNewMessageHelper(newMsg, receiver, userId);
    return { newMsg };
  } catch (error) {
    console.error("Send Message Error", error);
    return { error };
  }
};

const sendNewMessageHelper = async (newMsg, person1, person2Id) => {
  const previousChats = person1.chats.find(
    (chat) => chat.messagesWith.toString() === person2Id
  );

  if (previousChats) {
    previousChats.chat.push(newMsg);
    await person1.save();
  } else {
    const newChat = { messagesWith: person2Id, chat: [newMsg] };
    person1.chat.unshift(newChat);
    await person1.save();
  }
};

const setMsgToUnread = async (userId) => {
  const user = await UserModel.findById(userId);
  if (!user.unreadMessage) {
    user.unreadMessage = true;
    await user.save();
  }
};

module.exports = { loadMessages, sendNewMessage, setMsgToUnread };
