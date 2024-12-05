// src/app/(home)/page.tsx

<<<<<<< HEAD

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import NonAuthHomeView from '@/views/home/HomeNonAuthView'


export const metadata = { title: "Domov | ZoškaSnap" };

export default async function HomePage() {
=======
// Next.js imports
import { redirect } from "next/navigation";

// NextAuth imports
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

// Custom imports
import NonAuthHomeView from "@/views/home/HomeNonAuthView";

export const metadata = { title: "Domov | ZoškaSnap" };

// HomePage Component
const HomePage = async () => {
>>>>>>> c12de16 (Initial commit with all project files)
  // Fetch session on the server
  const session = await getServerSession(authOptions);

  if (session) {
    // Redirect authenticated users to the feed page
    redirect("/prispevok");
  }

  // Render the unauthenticated home view for non-authenticated users
  return <NonAuthHomeView />;
<<<<<<< HEAD
}
=======
};

export default HomePage;




>>>>>>> c12de16 (Initial commit with all project files)














