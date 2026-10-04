import { redirect } from "next/navigation";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { getSession } from "@/lib/auth";
export const dynamic = "force-dynamic";
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <AdminSidebar />

      <main className="min-h-screen pt-16 lg:ml-64 lg:pt-0">
        {children}
      </main>
    </div>
  );
}