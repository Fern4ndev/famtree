"use client";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-[calc(100vh)] overflow-hidden bg-[#02040b] text-white">
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/img/background.png"
          alt="Family Background"
          fill
          priority
          className="object-cover  scale-80"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,220,160,0.08),transparent_60%)]" />
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d7b98e]/10 blur-3xl" />
        <div className="relative z-10"></div>
      </div>


      <div className="relative z-10
        mx-auto
        flex
        h-full
        max-w-7xl
        flex-col
        items-center
        justify-center
        gap-3
        px-6
        text-center">

        <div className="mb-5 rounded-full border border-white/10 bg-white/5 px-8 py-2 backdrop-blur-xl">
          <span className="text-xs tracking-[0.4em] text-white/70">
            THE NEXT GENERATION FAMILY ALBUM
          </span>
        </div>

        <p className="mb-2 text-lg tracking-[0.8em] text-white/70">
          PRESERVE YOUR
        </p>

        <div className="relative flex items-center justify-center">

          <Image
            src="/svg/family-legacy.svg"
            alt="Family Legacy"
            width={1200}
            height={300}
            priority
            loading="eager"
            className="w-[18rem]
            md:w-[32rem]
            xl:w-[36rem]
            h-auto
            select-none
            pointer-events-none"
          />
        </div>
        <div className="mt-0 flex justify-center">
          <Image
            src="/svg/line.svg"
            alt="Separator"
            width={1200}
            height={300}
            priority
            className="
      w-[22rem]
  md:w-[34rem]
  xl:w-[44rem]
  h-auto
  opacity-90
  drop-shadow-[0_0_25px_rgba(255,220,160,0.35)]
  animate-pulse
    "
          />
        </div>

        <p className="mt-2 max-w-xl text-sm md:text-base leading-relaxed text-white/65">
          Create <strong className="text-gray-200">beautiful</strong> family albums, connect generations,<br />
          and explore your ancestry through immersive<br />
          interactive trees.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-5">

          <button className="rounded-full bg-gradient-to-b from-[#f9e6c0] to-[#b89a68] px-7 py-3 text-sm font-medium tracking-[0.2em] text-black shadow-[0_0_40px_rgba(255,220,160,0.35)] transition-all hover:scale-105">
            START YOUR JOURNEY
          </button>

          <button className="rounded-full border border-white/10 bg-white/5 px-7 py-3 text-sm tracking-[0.2em] text-white backdrop-blur-xl transition-all hover:bg-white/10">
            WATCH DEMO
          </button>
        </div>
        {/* FEATURES */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8">

          {/* BEAUTIFUL ALBUMS */}
          <div className="group flex items-center gap-3 transition-all duration-300 hover:scale-105">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 group-hover:border-[#d7b98e]/40 group-hover:shadow-[0_0_30px_rgba(255,220,160,0.15)]">
              <Image
                src="/svg/albums.svg"
                alt="Albums"
                width={32}
                height={32}
                className="
                h-8
                w-8
                object-contain
                opacity-80
                transition-all
                duration-300
                group-hover:opacity-100
                group-hover:scale-110
                "
              />


            </div>

            <div className="text-left">
              <h3 className="text-base font-medium tracking-[0.15em] text-white">
                BEAUTIFUL ALBUMS
              </h3>

              <p className="mt-1 text-base text-white/55">
                Save precious memories
              </p>
            </div>
          </div>

          {/* INTERACTIVE TREE */}
          <div className="group flex items-center gap-3 transition-all duration-300 hover:scale-105">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">

              <Image
                src="/svg/tree.svg"
                alt="Interactive Tree"
                width={32}
                height={32}
                className="
                  h-8
                  w-8
                  object-contain
                  opacity-80
                  transition-all
                  duration-300
                  group-hover:opacity-100
                  group-hover:scale-110
                "
              />

            </div>

            <div className="text-left">
              <h3 className="text-base font-medium tracking-[0.15em] text-white">
                INTERACTIVE TREE
              </h3>

              <p className="mt-1 text-base text-white/55">
                Visualize your heritage
              </p>
            </div>
          </div>

          {/* PRIVATE & SECURE */}
          <div className="group flex items-center gap-3 transition-all duration-300 hover:scale-105">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 group-hover:border-[#d7b98e]/40 group-hover:shadow-[0_0_30px_rgba(255,220,160,0.15)]">

              <Image
                src="/svg/shield.svg"
                alt="Private & Secure"
                width={32}
                height={32}
                className="
        h-8
        w-8
        object-contain
        opacity-80
        transition-all
        duration-300
        group-hover:opacity-100
        group-hover:scale-110
      "
              />

            </div>

            <div className="text-left">
              <h3 className="text-base font-medium tracking-[0.15em] text-white">
                PRIVATE & SECURE
              </h3>

              <p className="mt-1 text-base text-white/55">
                Your data, your control
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
