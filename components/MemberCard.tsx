import AlbumCard from "@/components/AlbumCard";
import { createClient } from "@/lib/supabase/server";

/** Carta con datos reales: foto vía signed URL generada en servidor. */
export default async function MemberCard({ memberId }: { memberId: string }) {
  const supabase = await createClient();
  const { data: member } = await supabase
    .from("members")
    .select("id, full_name, photo_path, rarity")
    .eq("id", memberId)
    .single();

  if (!member || !member.photo_path) {
    return (
      <p role="alert" className="text-sm text-red-300">
        Carta no encontrada.
      </p>
    );
  }

  const { data: signed } = await supabase.storage
    .from("stickers")
    .createSignedUrl(member.photo_path, 3600);

  if (!signed?.signedUrl) {
    return (
      <p role="alert" className="text-sm text-red-300">
        No se pudo cargar la foto.
      </p>
    );
  }

  return (
    <AlbumCard
      name={member.full_name}
      imageUrl={signed.signedUrl}
      rarity={member.rarity as "common" | "rare" | "epic" | "legendary"}
    />
  );
}
