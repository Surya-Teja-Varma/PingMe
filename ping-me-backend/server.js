import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// A helper function to get __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected successfully!');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Mongoose Schemas & Models
const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  username: String,
  avatar: String,
  followers: [String],
  following: [String],
});

const postSchema = new mongoose.Schema({
  userId: String,
  content: String,
  likes: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

const notificationSchema = new mongoose.Schema({
  userId: String,
  fromUserId: String,
  type: String,
  message: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Notification = mongoose.model('Notification', notificationSchema);

// API Routes
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find({});
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

app.post('/api/posts/:id/like', async (req, res) => {
  const { userId } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const hasLiked = post.likes.includes(userId);
    if (hasLiked) {
      post.likes = post.likes.filter(id => id !== userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();

    if (post.userId !== userId) {
      const notification = new Notification({
        userId: post.userId,
        fromUserId: userId,
        type: 'like',
        message: 'Your post was liked.',
      });
      await notification.save();
    }

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error liking post' });
  }
});

app.post('/api/posts', async (req, res) => {
  const { userId, content } = req.body;
  try {
    const newPost = new Post({
      userId,
      content,
      likes: [],
      createdAt: new Date(),
    });
    await newPost.save();

    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating post' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

app.post('/api/users/toggle-follow', async (req, res) => {
  const { followerId, followingId } = req.body;
  try {
    const follower = await User.findOne({ id: followerId });
    const following = await User.findOne({ id: followingId });

    if (!follower || !following) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollowing = follower.following.includes(followingId);
    if (isFollowing) {
      follower.following = follower.following.filter(id => id !== followingId);
      following.followers = following.followers.filter(id => id !== followerId);
    } else {
      follower.following.push(followingId);
      following.followers.push(followerId);
      
      const notification = new Notification({
        userId: followingId,
        fromUserId: followerId,
        type: 'follow',
        message: `${follower.name} started following you`,
      });
      await notification.save();
    }

    await follower.save();
    await following.save();

    res.json({ follower, following });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error toggling follow' });
  }
});

app.get('/api/notifications/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

app.put('/api/notifications/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Error marking notification as read' });
  }
});

app.put('/api/notifications/mark-all-read/:userId', async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.params.userId },
      { read: true }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Error marking all notifications as read' });
  }
});

// Serve the static frontend files.
app.use(express.static(path.join(__dirname, '..', 'dist')));

// A catch-all route for the single-page application.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});