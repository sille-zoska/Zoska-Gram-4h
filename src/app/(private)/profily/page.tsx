import { Metadata } from "next";
import ProfilesView from "@/views/private/ProfilesView";

export const metadata: Metadata = {
  title: "Hľadať profily | ZoškaGram",
  description: "Nájdite a sledujte svojich spolužiakov, učiteľov a priateľov."
};

export default function ProfilesPage() {
  return <ProfilesView />;
} 