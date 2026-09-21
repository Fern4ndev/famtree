"use client";

import React, { useEffect, useRef, useState } from "react";

export default function FamilyMemberCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  const [transform, setTransform] = useState(
    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)"
  );

  const [glarePosition, setGlarePosition] = useState({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const resetCard = () => {
    setTransform(
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)"
    );
    setGlarePosition({
      x: 50,
      y: 50,
      opacity: 0,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!inside) {
        resetCard();
        return;
      }

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -15;
      const rotateY = ((x - centerX) / centerX) * 15;

      setTransform(
        `perspective(1000px)
         rotateX(${rotateX}deg)
         rotateY(${rotateY}deg)
         scale3d(1.03,1.03,1.03)`
      );

      setGlarePosition({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.5,
      });
    };

    document.body.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.body.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="flex justify-center items-center py-10">
      <div
        ref={cardRef}
        className="relative w-[280px] h-[520px] rounded-[30px] transition-all duration-200 ease-out will-change-transform"
        style={{
          transform,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Glare */}
        <div className="absolute inset-0 rounded-[30px] overflow-hidden pointer-events-none z-30">
          <div
            className="absolute w-[200%] h-[200%] transition-opacity duration-300"
            style={{
              opacity: glarePosition.opacity,
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%,
              rgba(255,230,170,.45) 0%,
              rgba(255,255,255,.15) 20%,
              transparent 60%)`,
              transform: "translate(-25%,-25%)",
            }}
          />
        </div>

        {/* Outer Golden Glow */}
        <div
          className="absolute inset-0 rounded-[30px]"
          style={{
            background:
              "linear-gradient(180deg,#b8863b 0%,#e8c87b 20%,#8f6226 100%)",
            padding: "2px",
            boxShadow:
              "0 0 8px rgba(255,200,100,.35),0 0 30px rgba(255,180,50,.18)",
          }}
        >
          {/* Card */}
          <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-[#04080f]">
            {/* Background decoration */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,196,90,.12),transparent_55%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#0d1119,#05070d)]" />
            </div>

            {/* Decorative border */}
            <div className="absolute inset-[14px] rounded-[22px] border border-[#8e6a32]/60 z-10" />

            {/* Corner ornaments (puedes reemplazarlos por SVG después) */}
            <div className="absolute inset-[18px] rounded-[18px] border border-[#d8b46d]/20 pointer-events-none" />

            {/* Content */}
            <div className="relative z-20 flex flex-col items-center px-6 py-7 h-full">
              {/* Photo */}
              <div className="relative mt-4">
                <div className="w-[190px] h-[240px] rounded-t-[100px] rounded-b-[18px] overflow-hidden border border-[#c8a25a]/40 bg-[#111]">
                  {/* REEMPLAZA ESTA IMAGEN */}
                  <img
                    src="/placeholder-person.jpg"
                    alt="family member"
                    className="w-full h-full object-cover grayscale"
                  />
                </div>

                {/* Arco decorativo */}
                <div className="absolute inset-0 rounded-t-[100px] rounded-b-[18px] border border-[#e0bc77]/20 pointer-events-none" />
              </div>

              {/* Nombre */}
              <h2 className="mt-7 text-[32px] font-light tracking-wide text-[#f3d28c] text-center leading-none">
                William Johnson
              </h2>

              {/* Fechas */}
              <p className="mt-3 text-[15px] tracking-[0.2em] text-[#c6b28d]">
                1885 - 1967
              </p>

              {/* Divider */}
              <div className="w-16 h-px bg-[#a87a34]/70 my-5" />

              {/* Ocupación */}
              <div className="flex items-center gap-2 text-[#d2b074] text-[15px]">
                {/* TU ICONO */}
                <div className="w-4 h-4 rounded-full border border-current opacity-70" />
                <span>Teacher</span>
              </div>

              {/* Ciudad */}
              <div className="flex items-center gap-2 text-[#a9a7a2] text-[14px] mt-3">
                {/* TU ICONO */}
                <div className="w-4 h-4 rounded-full border border-current opacity-70" />
                <span>Chicago, Illinois, USA</span>
              </div>

              {/* Adorno inferior */}
              <div className="mt-auto mb-4 flex items-center gap-2 opacity-80">
                <div className="h-px w-10 bg-[#8e6a32]" />
                <div className="w-2 h-2 rotate-45 border border-[#cda863]" />
                <div className="h-px w-10 bg-[#8e6a32]" />
              </div>
            </div>

            {/* Brillo interno */}
            <div className="absolute inset-0 rounded-[28px] shadow-[inset_0_0_60px_rgba(255,210,120,.05)] pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}