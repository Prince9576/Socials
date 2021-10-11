const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  chats: [
    {
      messagesWith: { type: Schema.Types.ObjectId, ref: "User" },
      chat: [
        {
          msg: { type: String, required: true },
          sender: { type: String, required: true },
          receiver: { type: String, required: true },
          date: { type: Date },
        },
      ],
    },
  ],
});
module.exports = mongoose.model("Chat", ChatSchema);
