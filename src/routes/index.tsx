import { createFileRoute } from "@tanstack/react-router";

import { Footer } from "@/components/home/Footer";
import { Hero } from "@/components/home/Hero";
import { Nav } from "@/components/home/Nav";
import { PainPoints } from "@/components/home/PainPoints";
import { Partners } from "@/components/home/Partners";
import { SuccessStories } from "@/components/home/SuccessStories";
import { ThisIsDitto } from "@/components/home/ThisIsDitto";
import { WhyDitto } from "@/components/home/WhyDitto";
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
        <PainPoints />
        <ThisIsDitto />
        <SuccessStories />
        <Partners />
        <WhyDitto />
        {/* Remaining sections are added checkpoint by checkpoint (docs/framer-extraction.md §2). */}
        <div className="h-[200vh]" />
      </main>
      <Footer />
    </>
  );
}
