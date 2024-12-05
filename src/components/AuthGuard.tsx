// src/components/AuthGuard.tsx

// NextAuth imports
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

// Relative imports
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

// Props interface for AuthGuard
interface AuthGuardProps {
  children: React.ReactNode;
  redirectPath: string;
}

// Server-side AuthGuard Component
const AuthGuard = async ({ children, redirectPath }: AuthGuardProps) => {
  const session = await getServerSession(authOptions);

  // Redirect unauthenticated users
  if (!session) {
    redirect(redirectPath);
  }

  return <>{children}</>;
};

export default AuthGuard;
