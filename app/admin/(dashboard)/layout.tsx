import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/admin/login?callbackUrl=/admin");
  }
  return <AdminShell user={session.user}>{children}</AdminShell>;
}
