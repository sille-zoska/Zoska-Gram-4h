

import { Metadata } from "next";
import EditProfileView from "@/views/private/EditProfileView";

export const metadata: Metadata = {
  title: "Upraviť profil | ZoškaGram",
  description: "Spravujte svoj profil, upravte svoje informácie a nastavenia."
};

interface EditProfilePageProps {
  params: {
    id: string;
  };
}

export default function EditProfilePage({ params }: EditProfilePageProps) {
  return <EditProfileView profileId={params.id} />;
} 