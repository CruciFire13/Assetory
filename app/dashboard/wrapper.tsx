// app/dashboard/dashboard-wrapper.tsx
import { registerUser } from "@/lib/actions/registerUser";
import DashboardPage from "./client";

export default async function DashboardWrapper() {
  await registerUser();
  return <DashboardPage />;
}
