// src/app/(home)/page.tsx

// Next.js imports
import { redirect } from "next/navigation";

// NextAuth imports
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

// Custom imports
import NonAuthHomeView from "@/views/home/HomeNonAuthView";

export const metadata = { title: "Domov | ZoškaGram" };

// HomePage Component
const HomePage = async () => {
  // Fetch session on the server
  const session = await getServerSession(authOptions);

  if (session) {
    // Redirect authenticated users to the feed page
    redirect("/prispevok");
  }

  // Render the unauthenticated home view for non-authenticated users
  return <NonAuthHomeView />;
};

export default HomePage;

























