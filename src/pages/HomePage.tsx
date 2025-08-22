import React from 'react';
import { useApp } from '../context/AppContext';
import UserCard from '../components/UserCard';

export default function HomePage() {
  const { state } = useApp();
  const currentUser = state.users.find(u => u.id === state.currentUserId);
  const followingUsers = state.users.filter(user => currentUser?.following.includes(user.id));
  const otherUsers = state.users.filter(user => user.id !== state.currentUserId && !currentUser?.following.includes(user.id));

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Following List Section */}
      {followingUsers.length > 0 && (
        <>
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">Following</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {followingUsers.map(user => (
              <UserCard key={user.id} user={user} isCurrentUser={user.id === state.currentUserId} />
            ))}
          </div>
        </>
      )}
      
      {/* All Users Section */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">Discover Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherUsers.map(user => (
          <UserCard key={user.id} user={user} isCurrentUser={user.id === state.currentUserId} />
        ))}
      </div>
    </div>
  );
}