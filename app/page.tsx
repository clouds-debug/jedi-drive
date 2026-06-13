import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Process } from "@/components/Process";
import { Reviews } from "@/components/Reviews";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { HomepageAmbient } from "@/components/HomepageAmbient";

export default function HomePage() {
  return (
    <>
      <HomepageAmbient />
      <Nav />
      <main>
        <Hero />
        <Features />
        <Process />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
