"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-auto w-full border-t border-border bg-background px-6 pb-8 pt-16 md:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="group mb-1 flex items-center">
              <div className="h-25 transition-transform group-hover:scale-105 filter drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] drop-shadow-[0_0_20px_rgba(183,203,248,0.4)]">
                <img
                  src="/svg/logo.svg"
                  alt="FamTree Logo"
                  className="hidden sm:flex h-full w-auto object-contain"
                />
                <img
                  src="/svg/logo.svg"
                  alt="FamTree Logo"
                  className="flex sm:hidden h-full w-auto object-contain"
                />
              </div>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              A free, open-source gallery of cinematic video hero sections.
              Preview, download the video, and grab source code in HTML, React,
              or Next.js - ready to use in any project.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium text-foreground">
              Resources
            </h3>
            <ul className="space-y-3 text-sm text-muted">
              <li>
                <a href="#gallery" className="transition-colors hover:text-foreground">
                  Browse Gallery
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Submit a Hero
                </a>
              </li>
              <li>
                <a href="/tree" className="transition-colors hover:text-foreground">
                  Interactive Tree
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium text-foreground">
              Community
            </h3>
            <ul className="space-y-3 text-sm text-muted">
              <li>
                <a
                  href="https://github.com/CristianOlivera1/openhero"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  GitHub
                </a>
              </li>

              <li>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=oliverachavezcristian@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium text-foreground">Legal</h3>
            <ul className="space-y-3 text-sm text-muted">
              <li>
                <a
                  href="/privacy"
                  target="_blank"
                  className="transition-colors hover:text-foreground"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  target="_blank"
                  className="transition-colors hover:text-foreground"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between border-t border-border pt-8 text-xs text-muted md:flex-row">
          <p>
            Copyright &copy; {currentYear} FamTree. All rights reserved.
          </p>
          <div className="mt-4 flex items-center gap-4 md:mt-0">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
              aria-label="GitHub"
            >
              <Icon icon="mdi:github" width="20" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
