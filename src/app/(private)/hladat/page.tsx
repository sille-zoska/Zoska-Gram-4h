// src/app/(private)/hladat/page.tsx

import { Metadata } from "next";

// View component import
import ProfilesView from "@/views/private/ProfilesView";

export const metadata: Metadata = {
  title: "Hľadať | ZoškaGram",
  description: "Nájdite a sledujte svojich spolužiakov, učiteľov a priateľov."
};

// Search Page
const SearchPage = () => <ProfilesView />;

export default SearchPage;
