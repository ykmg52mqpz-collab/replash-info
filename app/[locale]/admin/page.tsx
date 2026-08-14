import InternalShell from "@/components/internal/InternalShell";
import AdminApp from "@/components/internal/AdminApp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Replash — Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <InternalShell label="Private area · Admin">
      <AdminApp />
    </InternalShell>
  );
}
