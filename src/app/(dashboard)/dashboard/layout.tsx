// ============================================================
// src/app/(dashboard)/dashboard/layout.tsx — Dashboard layout
// ============================================================
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Navbar } from "@/components/layout/Navbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="pt-16 flex">
        <DashboardSidebar role={session.user.role} />
        <main className="flex-1 min-w-0 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
