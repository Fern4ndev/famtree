import CustomSplashCursor from '../components/ui/CustomSplashCursor';
import Footer from "../components/layout/Footer";
import Hero from "../components/layout/Hero";

export default function Home() {
  return (
    <>
      <CustomSplashCursor />
      <main className="min-h-screen bg-black text-white">
        <Hero />
      </main>
      <Footer />
    </>
  );
}