import InternalShell from "@/components/internal/InternalShell";
import PanelApp from "@/components/internal/PanelApp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Replash — Facility Panel",
  robots: { index: false, follow: false },
};

export default function PanelPage() {
  return (
    <InternalShell label="Private area · Facility">
      <PanelApp />
    </InternalShell>
  );
}
