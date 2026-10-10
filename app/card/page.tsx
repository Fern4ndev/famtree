import NavBar from "../../components/layout/NavBar";
import NewMemberForm from "./NewMemberForm";

export default function CardPage() {
  return (
    <>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center gap-8 bg-night-950 px-6 py-24 text-white">
        <div className="text-center">
          <p className="text-[11px] tracking-[0.4em] text-white/60">CARTAS</p>
          <h1 className="mt-3 font-display text-3xl text-gold-200 sm:text-4xl">
            Nueva carta
          </h1>
          <p className="mt-2 text-sm text-white/55">
            Sube la foto, llena los datos y pégala en tu álbum.
          </p>
        </div>
        <NewMemberForm />
      </main>
    </>
  );
}
