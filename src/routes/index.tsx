import { createFileRoute } from "@tanstack/react-router";

import { Footer } from "@/components/home/Footer";
import { Hero } from "@/components/home/Hero";
import { Nav } from "@/components/home/Nav";
import { Preloader } from "@/components/home/Preloader";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <Preloader />
      <Nav />
      <main className="relative bg-soft-sand">
        <Hero />
        {/* Remaining sections are added checkpoint by checkpoint (docs/framer-extraction.md §2). */}
        <div className="h-[200vh]" />
      </main>
      <Footer />
    </>
  );
}
