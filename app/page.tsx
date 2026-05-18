import DevCard from './components/DevCard';
import NavBar from "./components/NavBar";
import CustomSplashCursor from '@/components/CustomSplashCursor';

export default function Home() {
  return (
    <>
      <CustomSplashCursor />
      <main className="min-h-screen bg-black text-white">
        <NavBar />
        <section className="pt-32 flex justify-center">
          <DevCard />
        </section>
      </main>
    </>
  );
}