import NavBar from "../../components/layout/NavBar";

// El editor de cartas llega en Fase 1. Ruta reservada.
export default function CardPage() {
  return (
    <>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-night-950 px-6 text-white">
        <p className="text-[11px] tracking-[0.4em] text-white/60">
          CARTAS
        </p>
        <h1 className="font-display text-3xl text-gold-200">
          Crear carta
        </h1>
        <p className="max-w-sm text-center text-sm leading-relaxed text-white/55">
          Aquí podrás subir la foto de tu familiar, llenar sus datos y pegarla
          en tu álbum. Disponible en la Fase 1.
        </p>
      </main>
    </>
  );
}
