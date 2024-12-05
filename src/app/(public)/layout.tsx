// src/app/(public)/layout.tsx

export const metadata = { title: "Public | SnapZoška" };

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children} {/* Render public pages */}
    </div>
  );
}
