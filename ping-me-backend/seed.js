const mongoose = require('mongoose');

// Your mock data
const mockUsers = [
  { id: '1', name: 'Alice Johnson', username: 'alice_j', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400', followers: ['2', '3'], following: ['2'] },
  { id: '2', name: 'Bob Smith', username: 'bobsmith', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400', followers: ['1'], following: ['1', '3', '4'] },
  { id: '3', name: 'Carol Davis', username: 'carol_d', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400', followers: ['1', '2'], following: ['4'] },
  { id: '4', name: 'David Wilson', username: 'davidw', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400', followers: ['2', '3'], following: [] },
  { id: '5', name: 'Emily Clark', username: 'emilyc', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400', followers: ['1', '4'], following: ['6', '7'] },
  { id: '6', name: 'Frank Miller', username: 'frankm', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400', followers: ['5'], following: ['2', '8'] },
  { id: '7', name: 'Grace Lee', username: 'gracelee', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400', followers: ['5', '8'], following: ['9'] },
  { id: '8', name: 'Henry Adams', username: 'henrya', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400', followers: ['6', '7'], following: ['10'] },
  { id: '9', name: 'Ivy Brown', username: 'ivyb', avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400', followers: ['7'], following: ['1', '10'] },
  { id: '10', name: 'Jack Carter', username: 'jackc', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400', followers: ['8', '9'], following: ['2', '3'] }
];

const mockPosts = [
  { id: '1', userId: '2', content: 'Just launched my new project! Excited to share it with everyone.', likes: ['1', '3'], createdAt: new Date('2024-01-15T10:30:00') },
  { id: '2', userId: '1', content: 'Beautiful sunset today! Nature never fails to amaze me.', likes: ['2'], createdAt: new Date('2024-01-15T18:45:00') },
  { id: '3', userId: '3', content: 'Learning React hooks and loving the simplicity!', likes: ['1', '2', '4'], createdAt: new Date('2024-01-16T09:15:00') },
  { id: '4', userId: '4', content: 'Coffee and code - the perfect combination for productivity.', likes: ['2', '3'], createdAt: new Date('2024-01-16T14:20:00') },
  { id: '5', userId: '5', content: 'Architecture trends are evolving faster than ever!', likes: ['6', '7'], createdAt: new Date('2024-01-17T11:00:00') },
  { id: '6', userId: '6', content: 'Node.js streams are incredibly powerful once you get them.', likes: ['2', '5', '9'], createdAt: new Date('2024-01-18T09:40:00') },
  { id: '7', userId: '7', content: 'Design is not just what it looks like, it’s how it works.', likes: ['1', '3', '8'], createdAt: new Date('2024-01-18T17:15:00') },
  { id: '8', userId: '8', content: 'Morning runs keep me energized for the day!', likes: ['6', '10'], createdAt: new Date('2024-01-19T07:30:00') },
  { id: '9', userId: '9', content: 'Trying out TypeScript in my React app – loving the type safety.', likes: ['2', '5', '7'], createdAt: new Date('2024-01-19T13:50:00') },
  { id: '10', userId: '10', content: 'Weekend hackathon was a blast! Built a cool prototype.', likes: ['1', '4', '8'], createdAt: new Date('2024-01-20T20:10:00') }
];

const mockNotifications = [
  { id: '1', userId: '1', fromUserId: '2', type: 'follow', message: 'Bob Smith started following you', read: false, createdAt: new Date('2024-01-16T15:30:00') },
  { id: '2', userId: '1', fromUserId: '3', type: 'like', postId: '2', message: 'Carol Davis liked your post', read: false, createdAt: new Date('2024-01-16T16:45:00') },
  { id: '3', userId: '2', fromUserId: '1', type: 'post', postId: '2', message: 'Alice Johnson created a new post', read: true, createdAt: new Date('2024-01-15T19:00:00') },
  { id: '4', userId: '3', fromUserId: '4', type: 'follow', message: 'David Wilson started following you', read: false, createdAt: new Date('2024-01-16T12:15:00') },
  { id: '5', userId: '5', fromUserId: '6', type: 'like', postId: '5', message: 'Frank Miller liked your post', read: false, createdAt: new Date('2024-01-17T11:30:00') },
  { id: '6', userId: '6', fromUserId: '5', type: 'follow', message: 'Emily Clark started following you', read: false, createdAt: new Date('2024-01-17T12:00:00') },
  { id: '7', userId: '7', fromUserId: '9', type: 'like', postId: '7', message: 'Ivy Brown liked your post', read: true, createdAt: new Date('2024-01-18T18:00:00') },
  { id: '8', userId: '8', fromUserId: '10', type: 'follow', message: 'Jack Carter started following you', read: false, createdAt: new Date('2024-01-19T08:15:00') },
  { id: '9', userId: '9', fromUserId: '2', type: 'post', postId: '9', message: 'Bob Smith created a new post', read: false, createdAt: new Date('2024-01-19T14:00:00') },
  { id: '10', userId: '10', fromUserId: '7', type: 'like', postId: '10', message: 'Grace Lee liked your post', read: false, createdAt: new Date('2024-01-20T21:00:00') }
];

// Add the Mongoose schemas and models from your server.js file
const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  username: String,
  avatar: String,
  followers: [String],
  following: [String],
});
const postSchema = new mongoose.Schema({
  id: String,
  userId: String,
  content: String,
  likes: [String],
  createdAt: Date,
});
const notificationSchema = new mongoose.Schema({
  id: String,
  userId: String,
  fromUserId: String,
  type: String,
  postId: String,
  message: String,
  read: Boolean,
  createdAt: Date,
});

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Notification = mongoose.model('Notification', notificationSchema);

const mongoURI = 'mongodb+srv://Varma:Varma1234@cluster0.7mtauj2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully!');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Notification.deleteMany({});
    console.log('Old data cleared.');

    // Insert new data
    await User.insertMany(mockUsers);
    await Post.insertMany(mockPosts);
    await Notification.insertMany(mockNotifications);
    console.log('Database seeded successfully!');

  } catch (err) {
    console.error('Error seeding the database:', err);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

seedDatabase();