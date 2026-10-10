import PokemonCard from "@/components/PokemonCard";

export default function AlbumPage() {
  return (
    <>
      <PokemonCard
        name="Charizard"
        imageUrl="/img/flor-amarilla-historia-e3gbi9vd.png"
        type="fire"
        rarity="rare shiny vmax"
        maskUrl="/cards/charizard-mask.webp" // opcional
        foilUrl="/cards/charizard-foil.webp" // opcional
      />
    </>
  );
}