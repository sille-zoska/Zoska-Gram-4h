import { Metadata } from "next";
import EditProfileView from "@/views/private/EditProfileView";

export const metadata: Metadata = {
  title: "Upraviť profil | ZoškaGram",
  description: "Spravujte svoj profil, upravte svoje informácie a nastavenia."
};

export default function EditProfilePage() {
  return <EditProfileView />;
} 