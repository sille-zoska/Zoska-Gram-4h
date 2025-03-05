// src/app/(private)/profil/[id]/page.tsx

import ProfileDetailView from "@/views/private/ProfileDetailView";

export const metadata = { title: "Profil | ZoškaSnap" };

interface ProfilePageProps {
  params: {
    id: string;
  };
}

const ProfilePage = ({ params }: ProfilePageProps) => {
  return <ProfileDetailView profileId={params.id} />;
};

export default ProfilePage;
