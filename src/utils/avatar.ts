/**
 * Generates an avatar URL for a user
 * @param name The user's name
 * @param avatarUrl Optional custom avatar URL
 * @returns URL for the user's avatar
 */
export const getAvatarUrl = (name?: string | null, avatarUrl?: string | null): string => {
    if (avatarUrl) {
        return avatarUrl;
    }

    // Use DiceBear for generating consistent avatars
    const seed = name || '?';
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=FF385C,1DA1F2`;
}; 