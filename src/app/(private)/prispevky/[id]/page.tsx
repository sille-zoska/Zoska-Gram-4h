// src/app/(private)/prispevky/[id]/page.tsx

import PostDetailView from "@/views/private/PostDetailView";

type PostDetailPageProps = {
  params: {
    id: string;
  };
};

/**
 * Post Detail Page Component
 * 
 * Displays details for a specific post.
 * This works for both regular posts and bookmarked posts.
 */
export default function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = params;
  
  return <PostDetailView postId={id} />;
}