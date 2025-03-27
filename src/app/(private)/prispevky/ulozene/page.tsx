import { Metadata } from "next";
import SavedPostsView from "@/views/private/SavedPostsView";

export const metadata: Metadata = {
  title: "Uložené príspevky | ZoškaGram",
  description: "Vaše uložené príspevky na ZoškaGram."
};

export default function SavedPostsPage() {
  return <SavedPostsView />;
} 