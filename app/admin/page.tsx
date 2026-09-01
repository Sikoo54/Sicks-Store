// Admin dashboard: products CRUD + orders.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  if (cookies().get("admin_auth")?.value !== "ok") redirect("/admin/login");
  return <AdminDashboard />;
}
