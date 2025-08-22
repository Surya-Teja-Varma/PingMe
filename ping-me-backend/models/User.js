import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  avatar: String,
  followers: [String],
  following: [String]
});

export default mongoose.model("User", userSchema);
