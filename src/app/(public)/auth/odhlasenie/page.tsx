// src/app/auth/odhlasenie/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SignOutView from "@/views/auth/SignOutView";

// export const metadata = { title: "Odhlásenie | ZoškaGram" };

export default function SignOutPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    router.push("/");
  };

  return <SignOutView open={open} onClose={handleClose} />;
}