import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AppState, User, Post, Notification } from '../types';

// The initial state now starts with empty arrays because data will be fetched from the backend.
const initialState: AppState = {
  currentUserId: '1',
  users: [],
  posts: [],
  notifications: [],
};

// Define new action types for fetching and updating data from the backend.
type AppAction =
  | { type: 'SET_CURRENT_USER'; payload: string }
  | { type: 'FETCH_DATA'; payload: { users: User[]; posts: Post[]; notifications: Notification[] } }
  | { type: 'UPDATE_POST'; payload: Post } // For updating a single post after a like action
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ'; payload: string };

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUserId: action.payload };

    // This action populates the state with data fetched from the backend.
    case 'FETCH_DATA':
      return {
        ...state,
        users: action.payload.users,
        posts: action.payload.posts,
        notifications: action.payload.notifications
      };

    // This action updates a single post in the state, typically after a successful API call.
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.id ? action.payload : post
        )
      };

    // The rest of the actions below are now initiated by API calls on the backend.
    // The frontend will only dispatch a 'FETCH_DATA' or 'UPDATE_POST' action after a successful response.
    // The previous logic for TOGGLE_LIKE, TOGGLE_FOLLOW, and ADD_POST is removed from here
    // because it now lives on the backend.

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        )
      };

    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.userId === action.payload
            ? { ...notification, read: true }
            : notification
        )
      };

    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // This useEffect hook is critical. It fetches all the necessary data from your backend
  // when the application first loads.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, postsRes, notificationsRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/posts'),
          fetch(`/api/notifications/${state.currentUserId}`),
        ]);

        const users: User[] = await usersRes.json();
        const posts: Post[] = await postsRes.json();
        const notifications: Notification[] = await notificationsRes.json();

        dispatch({ type: 'FETCH_DATA', payload: { users, posts, notifications } });
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    fetchData();
  }, [state.currentUserId]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}