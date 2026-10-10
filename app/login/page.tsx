"use client";

import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      alert(error.message);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <button
        onClick={signInWithGoogle}
        className="rounded-lg border px-6 py-3"
      >
        Continuar con Google
      </button>
    </main>
  );
}