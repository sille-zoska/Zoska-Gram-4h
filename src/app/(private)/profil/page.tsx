// /src/app/(private)/profil/page.tsx

import { Metadata } from "next";

// Custom imports
import ProfilesView from "@/views/private/ProfilesView";

export const metadata: Metadata = {
  title: "Môj profil | ZoškaGram",
  description: "Spravujte svoj profil, prezerajte svoje príspevky a sledujte svoju aktivitu."
};

// Search Page
const ProfilesPage = () => <ProfilesView />;

export default ProfilesPage;
