import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: String,
  fromUserId: String,
  type: String, // "follow", "like", "post"
  postId: String,
  message: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Notification", notificationSchema);
