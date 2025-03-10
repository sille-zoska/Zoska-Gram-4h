// /src/app/(private)/prispevok/page.tsx

import { Metadata } from "next";

// Custom imports
import FeedView from "@/views/private/FeedView";

export const metadata: Metadata = {
  title: "Príspevky | ZoškaGram",
  description: "Prezerajte si najnovšie príspevky od vašich spolužiakov a učiteľov.",
};

// Search Page
const FeedPage = () => <FeedView />;

export default FeedPage;
