export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  followers: string[];
  following: string[];
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  likes: string[];
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string; // recipient
  fromUserId: string; // sender
  type: 'follow' | 'post' | 'like';
  postId?: string; // for post and like notifications
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface AppState {
  currentUserId: string;
  users: User[];
  posts: Post[];
  notifications: Notification[];
}