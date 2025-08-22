import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Heart, UserPlus, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Notification } from '../types';

export default function NotificationsPage() {
  const { state, dispatch } = useApp();
  const userNotifications = state.notifications
    .filter(n => n.userId === state.currentUserId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ', payload: state.currentUserId });
  };

  const handleNotificationClick = (notificationId: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'follow':
        return <UserPlus size={20} className="text-blue-500" />;
      case 'like':
        return <Heart size={20} className="text-red-500" />;
      case 'post':
        return <FileText size={20} className="text-green-500" />;
    }
  };

  const getFromUser = (fromUserId: string) => {
    return state.users.find(u => u.id === fromUserId);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-3 bg-red-500 text-white text-sm rounded-full px-3 py-1 animate-pulse">
                {unreadCount} unread
              </span>
            )}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Stay updated with your network activity</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            Mark all as read
          </button>
        )}
      </div>

      {userNotifications.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 sm:p-12 text-center transition-all duration-300">
          <Bell size={64} className="mx-auto mb-4 text-gray-300 dark:text-gray-600 animate-pulse" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No notifications yet</h3>
          <p className="text-gray-600 dark:text-gray-400">When you start interacting with others, you'll see notifications here</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {userNotifications.map(notification => {
            const fromUser = getFromUser(notification.fromUserId);
            return (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 cursor-pointer hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 ${
                  !notification.read ? 'ring-2 ring-blue-100 dark:ring-blue-900 bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={fromUser?.avatar}
                    alt={fromUser?.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getNotificationIcon(notification.type)}
                      {!notification.read && (
                        <div className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <p className="text-gray-900 dark:text-white font-medium mb-1 text-sm sm:text-base">
                      {notification.message}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}