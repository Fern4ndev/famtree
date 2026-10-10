import NavBar from "../../components/layout/NavBar";
import CustomSplashCursor from '../../components/ui/CustomSplashCursor';
import DevCard from "../components/FamilyCard";

export default function CardPage() {
  return (
    <>
      <CustomSplashCursor />
      <NavBar />
      <main className="min-h-screen bg-black text-white">
        <section className="pt-32 flex justify-center">
          <DevCard />
        </section>
      </main>
    </>
  );
}