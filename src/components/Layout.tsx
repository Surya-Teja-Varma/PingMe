import React, { useState } from 'react';
import { Bell, Home, FileText, User, Sun, Moon, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import NotificationDropdown from './NotificationDropdown';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: 'home' | 'posts' | 'notifications';
  onPageChange: (page: 'home' | 'posts' | 'notifications') => void;
}

export default function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const { state, dispatch } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const currentUser = state.users.find(u => u.id === state.currentUserId);
  const userNotifications = state.notifications.filter(n => n.userId === state.currentUserId);
  const unreadCount = userNotifications.filter(n => !n.read).length;

  const handleUserChange = (userId: string) => {
    dispatch({ type: 'SET_CURRENT_USER', payload: userId });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 sm:space-x-8">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400 transform rotate-12 animate-pulse" />
                  <div className="absolute inset-0 w-8 h-8 bg-blue-600 dark:bg-blue-400 rounded-full opacity-20 animate-ping"></div>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                  PingMe
                </h1>
              </div>
              
              {/* Navigation */}
              <nav className="hidden sm:flex space-x-2 lg:space-x-6">
                <button
                  onClick={() => onPageChange('home')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                    currentPage === 'home'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Home size={20} />
                  <span className="hidden lg:inline">Home</span>
                </button>
                <button
                  onClick={() => onPageChange('posts')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                    currentPage === 'posts'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <FileText size={20} />
                  <span className="hidden lg:inline">Posts</span>
                </button>
                <button
                  onClick={() => onPageChange('notifications')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                    currentPage === 'notifications'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Bell size={20} />
                  <span className="hidden lg:inline">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </nav>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Notification Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 transform hover:scale-110"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                
                <NotificationDropdown
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                  notifications={userNotifications}
                />
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 transform hover:scale-110 hover:rotate-12"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              {/* User Selector */}
              <div className="hidden sm:flex items-center space-x-3">
                <User size={16} className="text-gray-400 dark:text-gray-500" />
                <select
                  value={state.currentUserId}
                  onChange={(e) => handleUserChange(e.target.value)}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  {state.users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Navigation */}
              <div className="sm:hidden">
                <select
                  value={currentPage}
                  onChange={(e) => onPageChange(e.target.value as 'home' | 'posts' | 'notifications')}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <option value="home">Home</option>
                  <option value="posts">Posts</option>
                  <option value="notifications">Notifications {unreadCount > 0 && `(${unreadCount})`}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {children}
      </main>
    </div>
  );
}