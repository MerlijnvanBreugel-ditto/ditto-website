import { createFileRoute } from "@tanstack/react-router";

import { Footer } from "@/components/home/Footer";
import { Nav } from "@/components/home/Nav";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <Nav />
      <main className="relative bg-soft-sand">
        {/* Sections are added checkpoint by checkpoint (see docs/framer-extraction.md §2). */}
        <div className="h-[200vh]" />
      </main>
      <Footer />
    </>
  );
}
