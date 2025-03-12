// src/app/(private)/ulozene/page.tsx

import { Metadata } from "next";

// View component import
import SavedPostsView from "@/views/private/SavedPostsView";

export const metadata: Metadata = {
  title: "Uložené príspevky | ZoškaGram",
  description: "Vaše uložené príspevky na ZoškaGram"
};

/**
 * Saved Posts Page
 * 
 * This page displays posts that the user has saved/bookmarked.
 * It redirects unauthenticated users to the login page.
 */
const SavedPostsPage = () => <SavedPostsView />;

export default SavedPostsPage; 