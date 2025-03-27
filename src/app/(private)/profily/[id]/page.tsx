import { Metadata } from "next";
import ProfileDetailView from "@/views/private/ProfileDetailView";

export const metadata: Metadata = {
  title: "Profil používateľa | ZoškaGram",
  description: "Prezrite si profil používateľa, jeho príspevky a aktivitu."
};

interface ProfilePageProps {
  params: {
    id: string;
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  return <ProfileDetailView profileId={params.id} />;
} 