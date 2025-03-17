/**
 * Represents the loading state of a component or data.
 * - IDLE: Initial state, no loading has occurred yet
 * - LOADING: Data is currently being fetched or operation is in progress
 * - LOADED: Operation completed successfully
 * - ERROR: Operation failed with an error
 */
export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error'
}

/**
 * Represents a user profile
 */
export interface Profile {
  id: string;
  userId: string;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  interests: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Extended user type with ID field
 * Augments the NextAuth User type
 */
export interface ExtendedUser {
  id?: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
} 