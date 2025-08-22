import React from 'react';
import { Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Post, User } from '../types';
import { useApp } from '../context/AppContext';

interface PostCardProps {
  post: Post;
  author: User | undefined;
}

export default function PostCard({ post, author }: PostCardProps) {
  const { state, dispatch } = useApp();
  const isLiked = post.likes?.includes(state.currentUserId) || false;

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: state.currentUserId }),
      });

      if (!response.ok) {
        throw new Error('Failed to like post');
      }

      const postsRes = await fetch('/api/posts');
      const posts = await postsRes.json();
      dispatch({ type: 'FETCH_DATA', payload: { ...state, posts } });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  if (!author) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01]">
      <div className="flex justify-between items-start space-x-4">
        {/* Left side: Avatar, Name, Content */}
        <div className="flex items-start space-x-4">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700 transition-all duration-300 hover:ring-blue-300 dark:hover:ring-blue-600"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{author.name}</h3>
              <span className="text-gray-500 dark:text-gray-400 text-sm hidden sm:inline">@{author.username}</span>
              <span className="text-gray-400 dark:text-gray-500 hidden sm:inline">·</span>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(post.createdAt, { addSuffix: true })}
              </span>
            </div>
            
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4 text-sm sm:text-base">{post.content}</p>
          </div>
        </div>
        
        {/* Right side: Like button and count */}
        <div className="flex items-center" style={{paddingRight:"20px",paddingTop:"6px"}}>
          <button
            onClick={handleLike}
            className={`flex flex-col items-center space-y-1 transition-all duration-200 transform hover:scale-110 active:scale-95 ${
              isLiked
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
            }`}
          >
            <Heart size={23} className={`${isLiked ? 'fill-current animate-pulse' : ''} transition-all duration-200`} />
            <span className="text-xs font-medium">{post.likes?.length || 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
}