"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import CustomSplashCursor from "@/components/ui/CustomSplashCursor";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.07.72-2.44 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28v-3.1H1.29a12 12 0 0 0 0 10.76l3.98-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.76c1.76 0 3.34.61 4.58 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.29 6.62l3.98 3.1C6.22 6.87 8.87 4.76 12 4.76Z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    createClient()
      .auth.getSession()
      .then(({ data }) => {
        if (data.session) router.replace("/album");
        else setChecking(false);
      });
  }, [router]);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/album` },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-night-950">
        <p className="text-sm tracking-[0.3em] text-cream-300/60" role="status">
          CARGANDO…
        </p>
      </main>
    );
  }

  return (
    <>
      <CustomSplashCursor />
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-night-950 px-6 text-white">
        {/* Fondo: misma imagen y atmósfera dorada de la landing */}
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src="/img/background.png"
            alt=""
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,220,160,0.10),transparent_60%)]" />
          <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/10 blur-3xl" />
        </div>

        <section
          aria-labelledby="login-title"
          className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-[0_0_60px_rgba(255,220,160,0.12)] backdrop-blur-xl sm:p-10"
        >
          <p className="text-[11px] tracking-[0.4em] text-white/60">
            FAMTREE · TU LEGADO FAMILIAR
          </p>
          <h1
            id="login-title"
            className="mt-4 font-display text-3xl leading-tight text-gold-200 sm:text-4xl"
          >
            Bienvenido a tu historia
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            Guarda las fotos de tu familia en cartas coleccionables y pégalas
            en tu álbum. Tu información, bajo tu control.
          </p>

          <div className="my-6 flex items-center gap-3" aria-hidden="true">
            <div className="h-px flex-1 bg-gold-700/60" />
            <div className="h-1.5 w-1.5 rotate-45 border border-gold-400" />
            <div className="h-px flex-1 bg-gold-700/60" />
          </div>

          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="flex w-full min-h-[48px] cursor-pointer items-center justify-center gap-3 rounded-full bg-gradient-to-b from-gold-200 to-gold-500 px-7 py-3 text-sm font-medium tracking-[0.15em] text-black shadow-[0_0_40px_rgba(255,220,160,0.35)] transition-all hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-200 disabled:cursor-wait disabled:opacity-70"
          >
            <GoogleIcon />
            {loading ? "CONECTANDO…" : "CONTINUAR CON GOOGLE"}
          </button>

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-300">
              {error}
            </p>
          )}

          <p className="mt-6 text-xs leading-relaxed text-white/45">
            Al continuar aceptas que tu álbum se guarde de forma privada.
            Solo tú decides qué compartir.
          </p>

          <Link
            href="/"
            className="mt-4 inline-block text-xs tracking-[0.2em] text-cream-300/70 underline-offset-4 transition-colors hover:text-gold-200 hover:underline"
          >
            ← VOLVER AL INICIO
          </Link>
        </section>
      </main>
    </>
  );
}
