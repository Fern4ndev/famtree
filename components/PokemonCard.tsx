"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";

/**
 * Tipos de Pokémon soportados por el glow del borde (definidos en
 * pokemon-card.css). Agrega más si los necesitas.
 */
export type PokemonType =
  | "fire"
  | "water"
  | "grass"
  | "lightning"
  | "psychic"
  | "fighting"
  | "darkness"
  | "metal"
  | "dragon"
  | "fairy";

export interface PokemonCardProps {
  /** Nombre del Pokémon, usado para el alt de la imagen */
  name: string;
  /** URL de la imagen del frente de la carta */
  imageUrl: string;
  /** Tipo principal, define el color del glow al hacer focus/activar */
  type?: PokemonType;
  /**
   * Rareza tal cual la usa el CSS original, ej. "rare shiny vmax".
   * Por ahora el CSS incluido solo trae reglas para esta rareza;
   * agrega el resto de los archivos de public/css/cards/*.css a
   * pokemon-card.css si quieres soportar otras.
   */
  rarity?: string;
  /**
   * PNG/WEBP que define la silueta a recortar del brillo (--mask).
   * Sin esto, el brillo cubre toda la carta en vez de solo el arte.
   */
  maskUrl?: string;
  /** PNG/WEBP de la lámina metálica (--foil) */
  foilUrl?: string;
  className?: string;
}

function clamp(v: number, min = 0, max = 100) {
  return Math.min(Math.max(v, min), max);
}
function round(v: number, p = 3) {
  return parseFloat(v.toFixed(p));
}
function adjust(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number) {
  return round(toMin + ((value - fromMin) * (toMax - toMin)) / (fromMax - fromMin));
}

export default function PokemonCard({
  name,
  imageUrl,
  type = "fire",
  rarity = "rare shiny vmax",
  maskUrl,
  foilUrl,
  className = "",
}: PokemonCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotatorRef = useRef<HTMLButtonElement>(null);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    const card = cardRef.current;
    const rotator = rotatorRef.current;
    if (!card || !rotator) return;

    const rect = rotator.getBoundingClientRect();
    const absoluteX = clientX - rect.left;
    const absoluteY = clientY - rect.top;
    const percentX = clamp(round((100 / rect.width) * absoluteX));
    const percentY = clamp(round((100 / rect.height) * absoluteY));
    const centerX = percentX - 50;
    const centerY = percentY - 50;

    const bgX = adjust(percentX, 0, 100, 37, 63);
    const bgY = adjust(percentY, 0, 100, 33, 67);
    const rotateX = round(-(centerX / 3.5));
    const rotateY = round(centerY / 3.5);
    const distFromCenter = clamp(
      Math.sqrt((percentY - 50) ** 2 + (percentX - 50) ** 2) / 50,
      0,
      1
    );

    card.classList.add("interacting");
    card.style.setProperty("--pointer-x", `${percentX}%`);
    card.style.setProperty("--pointer-y", `${percentY}%`);
    card.style.setProperty("--background-x", `${bgX}%`);
    card.style.setProperty("--background-y", `${bgY}%`);
    card.style.setProperty("--rotate-x", `${rotateX}deg`);
    card.style.setProperty("--rotate-y", `${rotateY}deg`);
    card.style.setProperty("--pointer-from-center", `${distFromCenter}`);
    card.style.setProperty("--card-opacity", "1");
    card.style.setProperty("--card-scale", "1.05");
  }, []);

  const resetCard = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.classList.remove("interacting");
    card.style.setProperty("--pointer-x", "50%");
    card.style.setProperty("--pointer-y", "50%");
    card.style.setProperty("--background-x", "50%");
    card.style.setProperty("--background-y", "50%");
    card.style.setProperty("--rotate-x", "0deg");
    card.style.setProperty("--rotate-y", "0deg");
    card.style.setProperty("--pointer-from-center", "0");
    card.style.setProperty("--card-opacity", "0");
    card.style.setProperty("--card-scale", "1");
  }, []);

  const foilStyle = {
    ...(maskUrl ? { ["--mask" as string]: `url(${maskUrl})` } : {}),
    ...(foilUrl ? { ["--foil" as string]: `url(${foilUrl})` } : {}),
  };

  return (
    <div className={`mx-auto w-full max-w-[300px] ${className}`}>
      <div
        ref={cardRef}
        className={`poke-card ${type} masked`}
        data-rarity={rarity}
      >
        <div className="poke-card__translater">
          <button
            ref={rotatorRef}
            type="button"
            className="poke-card__rotator"
            aria-label={`Carta Pokémon de ${name}`}
            onPointerMove={(e) => handleMove(e.clientX, e.clientY)}
            onPointerLeave={resetCard}
            onTouchMove={(e) => {
              const t = e.touches[0];
              if (t) handleMove(t.clientX, t.clientY);
            }}
            onTouchEnd={resetCard}
          >
            <div className="poke-card__front" style={foilStyle}>
              <Image
                src={imageUrl}
                alt={`Arte de la carta de ${name}`}
                fill
                sizes="300px"
                className="poke-card__art"
                priority
              />
              <div className="poke-card__shine" />
              <div className="poke-card__glare" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}