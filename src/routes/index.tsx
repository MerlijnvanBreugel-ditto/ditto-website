import { createFileRoute } from "@tanstack/react-router";

import { DownloadCta } from "@/components/home/DownloadCta";
import { Faq } from "@/components/home/Faq";
import { Footer } from "@/components/home/Footer";
import { Hero } from "@/components/home/Hero";
import { Nav } from "@/components/home/Nav";
import { PainPoints } from "@/components/home/PainPoints";
import { Preloader } from "@/components/home/Preloader";
import { Partners } from "@/components/home/Partners";
import { SuccessStories } from "@/components/home/SuccessStories";
import { ThisIsDitto } from "@/components/home/ThisIsDitto";
import { WhyDitto } from "@/components/home/WhyDitto";

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
        <DownloadCta />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
