"use client";
import MetallicPaint from "@/components/ui/MetallicPaint";
import { LiquidMetalButton } from "@/components/ui/LiquidMetalButton";
import Link from "next/link";


export default function NavBar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-xl transition-all duration-300 animate-fade-in">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* LOGO */}
        <Link href="/" className="group flex items-center z-50">
          <div className="relative flex items-center justify-center w-[250px] h-[150px] overflow-hidden drop-shadow-[0_0_25px_rgba(255,255,255,0.18)]">
            <MetallicPaint
              imageSrc="/svg/logo.svg"
              seed={42}
              scale={4}
              patternSharpness={1}
              noiseScale={0.5}

              speed={0.25}
              liquid={0.8}
              mouseAnimation={false}

              brightness={2}
              contrast={0.65}
              refraction={0.015}
              blur={0.01}
              chromaticSpread={1.5}
              fresnel={1}
              angle={0}
              waveAmplitude={1}
              distortion={1}
              contour={0.3}

              // Colors
              lightColor="#ffffff"
              darkColor="#5e5873"
              tintColor="#c5b3ff"
            />
          </div>
        </Link>

        {/* NAV LINKS */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-neutral-300 md:flex">
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          {/* SUBMIT BUTTON */}
          <LiquidMetalButton>
            <div className="relative z-20 flex items-center gap-2 text-[#f9f9f9] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <g
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                >
                  <path d="M17 9.002c2.175.012 3.353.109 4.121.877C22 10.758 22 12.172 22 15v1c0 2.829 0 4.243-.879 5.122C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.878C2 20.242 2 18.829 2 16v-1c0-2.828 0-4.242.879-5.121c.768-.768 1.946-.865 4.121-.877"></path>

                  <path
                    strokeLinejoin="round"
                    d="M12 15V2m0 0l3 3.5M12 2L9 5.5"
                  ></path>
                </g>
              </svg>

              <span className="text-sm font-medium tracking-wide">
                Submit
              </span>
            </div>
          </LiquidMetalButton>

          {/* GITHUB BUTTON */}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/Fern4ndev/"
            className="hidden sm:inline-flex items-center"
          >
            <LiquidMetalButton>
              <span className="flex items-center gap-2 text-[#dddddd] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] transition-colors hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"></path>
                </svg>

                <span className="text-sm font-medium tracking-wide">
                  GitHub
                </span>
              </span>
            </LiquidMetalButton>
          </a>

          {/* MOBILE MENU BUTTON */}
          <button
            className="p-2 text-white md:hidden z-50"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M20 7H4m16 5H4m16 5H4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
