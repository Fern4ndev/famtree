import Link from "next/link";
import NavBar from "../../../components/layout/NavBar";
import MemberCard from "@/components/MemberCard";

export default async function CardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-night-950 px-6 py-24 text-white">
        <div className="text-center">
          <p className="text-[11px] tracking-[0.4em] text-white/60">
            CARTA CREADA
          </p>
          <h1 className="mt-3 font-display text-3xl text-gold-200">
            Lista para el álbum
          </h1>
        </div>
        <MemberCard memberId={id} />
        <Link
          href="/album"
          className="rounded-full border border-white/10 bg-white/5 px-7 py-3 text-sm tracking-[0.2em] backdrop-blur-xl transition-all hover:bg-white/10"
        >
          IR AL ÁLBUM
        </Link>
      </main>
    </>
  );
}
