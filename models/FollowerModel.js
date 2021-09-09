const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FollowerSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" },
    following: [
      {
        user: { type: Schema.Types.ObjectId, ref: "user" },
      },
    ],
    followers: [
      {
        user: { type: Schema.Types.ObjectId, ref: "user" },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Follower", FollowerSchema);
