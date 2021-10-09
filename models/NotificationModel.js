const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" },
    notifications: [
      {
        user: { type: Schema.Types.ObjectId, ref: "user" },
        type: { type: String, enum: ["newLike", "newComment", "newFollower"] },
        post: { type: Schema.Types.ObjectId, ref: "post" },
        commentId: { type: String },
        text: { type: String },
        date: { type: Date, default: Date.now() },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Notification", NotificationSchema);
