import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import DashboardPreview from "@/components/sections/DashboardPreview";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-dark-950">
      <Navbar />
      <Hero />
      <Features />
      <DashboardPreview />
      <Footer />
    </main>
  );
}
