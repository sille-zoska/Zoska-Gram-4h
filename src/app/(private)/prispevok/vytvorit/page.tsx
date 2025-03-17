// src/app/(private)/prispevok/vytvorit/page.tsx

import { Metadata } from "next";

// View component import
import CreatePostView from "@/views/private/CreatePostView";

export const metadata: Metadata = {
  title: "Nový príspevok | ZoškaGram",
  description: "Vytvorte nový príspevok a zdieľajte ho s komunitou."
};

// Create Post Page
const CreatePostPage = () => <CreatePostView />;

export default CreatePostPage;
