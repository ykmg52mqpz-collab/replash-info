import InternalShell from "@/components/internal/InternalShell";
import IngestApp from "@/components/internal/IngestApp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Replash — Test Camera",
  robots: { index: false, follow: false },
};

export default function IngestPage() {
  return (
    <InternalShell label="Private area · Camera">
      <IngestApp />
    </InternalShell>
  );
}
