// ============================================================
// src/app/(dashboard)/dashboard/page.tsx — Dashboard overview
// ============================================================
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OwnerDashboardOverview } from "@/components/dashboard/OwnerDashboardOverview";
import { TenantDashboardOverview } from "@/components/dashboard/TenantDashboardOverview";
import { AdminDashboardOverview } from "@/components/dashboard/AdminDashboardOverview";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = session.user.role;
  const name = session.user.name ?? "";

  if (role === "owner") return <OwnerDashboardOverview userName={name} />;
  if (role === "admin") return <AdminDashboardOverview userName={name} />;
  return <TenantDashboardOverview userName={name} />;
}
