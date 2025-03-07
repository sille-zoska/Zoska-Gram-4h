// src/app/(private)/profil/upravit/page.tsx

import { Metadata } from "next";
import EditProfileView from "@/views/private/EditProfileView";

export const metadata: Metadata = {
  title: "Upraviť profil | ZoskaGram",
  description: "Upraviť svoj profil na ZoskaGram",
};

export default function EditProfilePage() {
  return <EditProfileView />;
} 