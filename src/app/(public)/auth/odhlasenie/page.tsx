// src/app/auth/odhlasenie/page.tsx

import SignOutView from "@/views/auth/SignOutView";

export const metadata = { title: "Odhlásenie | ZoškaGram" };

export default function SignOutPage() {
  return <SignOutView open={true} />;
}