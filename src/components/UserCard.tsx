import React from 'react';
import { UserPlus, UserMinus } from 'lucide-react';
import { User } from '../types';
import { useApp } from '../context/AppContext';

interface UserCardProps {
  user: User;
  isCurrentUser?: boolean;
}

export default function UserCard({ user, isCurrentUser }: UserCardProps) {
  const { state, dispatch } = useApp();
  const currentUser = state.users.find(u => u.id === state.currentUserId);
  const isFollowing = currentUser?.following?.includes(user.id) || false;

  const handleFollow = async () => {
    if (!isCurrentUser) {
      try {
        const response = await fetch('/api/users/toggle-follow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ followerId: state.currentUserId, followingId: user.id }),
        });

        if (response.ok) {
          const [usersRes, postsRes, notificationsRes] = await Promise.all([
            fetch('/api/users'),
            fetch('/api/posts'),
            fetch(`/api/notifications/${state.currentUserId}`),
          ]);
          const users = await usersRes.json();
          const posts = await postsRes.json();
          const notifications = await notificationsRes.json();

          dispatch({ type: 'FETCH_DATA', payload: { users, posts, notifications } });
        } else {
          console.error('Failed to toggle follow');
        }
      } catch (error) {
        console.error('Error toggling follow:', error);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1">
      <div className="flex items-center justify-between space-x-4">
        {/* Left side: Avatar and Text */}
        <div className="flex items-center space-x-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700 transition-all duration-300 hover:ring-blue-300 dark:hover:ring-blue-600"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</p>
          </div>
        </div>
        
        {/* Right side: Follow/Unfollow Button or "You" tag */}
        <div className="flex-shrink-0">
          {!isCurrentUser && (
            <button
              onClick={handleFollow}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                isFollowing
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 shadow-md'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
              }`}
            >
              {isFollowing ? <UserMinus size={16} /> : <UserPlus size={16} />}
              <span>{isFollowing ? 'Unfollow' : 'Follow'}</span>
            </button>
          )}
          
          {isCurrentUser && (
            <div className="px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 text-green-700 dark:text-green-300 rounded-lg font-medium shadow-md">
              You
            </div>
          )}
        </div>
      </div>
    </div>
  );
}