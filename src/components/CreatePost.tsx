import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CreatePost() {
  const { state, dispatch } = useApp();
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const currentUser = state.users.find(u => u.id === state.currentUserId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      try {
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: state.currentUserId, content: content.trim() }),
        });

        if (response.ok) {
          const postsRes = await fetch('/api/posts');
          const posts = await postsRes.json();
          dispatch({ type: 'FETCH_DATA', payload: { ...state, posts } });
          
          setContent('');
          setIsExpanded(false);
        } else {
          console.error('Failed to create post');
        }
      } catch (error) {
        console.error('Error creating post:', error);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6 hover:shadow-md dark:hover:shadow-xl transition-all duration-300">
      <div className="flex items-start space-x-4">
        <img
          src={currentUser?.avatar}
          alt={currentUser?.name}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
        />
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="What's on your mind?"
              className={`w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                isExpanded ? 'h-20 sm:h-24' : 'h-12'
              }`}
            />
            
            {isExpanded && (
              <div className="flex items-center justify-between mt-3">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {content.length}/280 characters
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsExpanded(false);
                      setContent('');
                    }}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-all duration-200 transform hover:scale-105 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!content.trim()}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:shadow-none"
                  >
                    <PlusCircle size={16} />
                    <span>Post</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}