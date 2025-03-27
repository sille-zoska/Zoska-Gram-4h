import { Metadata } from "next";
import FeedView from "@/views/private/FeedView";

export const metadata: Metadata = {
  title: "Hlavná stránka | ZoškaGram",
  description: "Prezerajte si príspevky od vašich spolužiakov a priateľov."
};

export default function FeedPage() {
  return <FeedView />;
} 