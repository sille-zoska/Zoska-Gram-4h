// src/app/(private)/profil/[id]/page.tsx

import ProfileDetailView from "@/views/private/ProfileDetailView";

export const metadata = { 
  title: "Profil používateľa | ZoškaGram",
  description: "Prezrite si profil používateľa, jeho príspevky a aktivitu."
};

interface ProfilePageProps {
  params: {
    id: string;
  };
}

const ProfilePage = ({ params }: ProfilePageProps) => {
  return <ProfileDetailView profileId={params.id} />;
};

export default ProfilePage;
