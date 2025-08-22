import React from 'react';
import { useApp } from '../context/AppContext';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

export default function PostsPage() {
  const { state } = useApp();
  const sortedPosts = [...state.posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Posts</h1>
        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Share your thoughts and engage with others</p>
      </div>

      <CreatePost />

      <div className="space-y-4 sm:space-y-6">
        {sortedPosts.map(post => {
          const author = state.users.find(u => u.id === post.userId);
          return <PostCard key={post.id} post={post} author={author} />;
        })}
      </div>
    </div>
  );
}