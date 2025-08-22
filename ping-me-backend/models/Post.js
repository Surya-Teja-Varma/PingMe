import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId: String,
  content: String,
  likes: [String],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Post", postSchema);
