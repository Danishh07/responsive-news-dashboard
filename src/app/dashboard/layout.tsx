import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

import DashboardLayout from "@/components/layout/DashboardLayout";

export const metadata: Metadata = {
  title: "Dashboard - News Dashboard",
  description: "News Dashboard - Your centralized platform for news management",
};

export default async function DashboardLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get the user's session - now with Google OAuth enabled
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login");
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
