"use client";

import { useState } from "react";
import { playPaperRustle } from "@/lib/paper-audio";

export default function NoirFooter() {
  const [signed, setSigned] = useState(false);

  return (
    <footer className="mt-auto border-t border-[var(--paper-edge)]/15 bg-[var(--noir-bg)]">
      {/* ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-[var(--blood)]/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full border border-[var(--paper-edge)]/40">
                <span className="font-display text-lg text-[var(--blood-bright)]">
                  C
                </span>
              </div>
              <div>
                <div className="font-display text-lg font-bold text-[var(--paper)]">
                  The Crimson Room
                </div>
                <div className="font-typewriter text-[10px] tracking-[0.25em] text-[var(--sepia)]">
                  EST. 1947 · BLACKMORE
                </div>
              </div>
            </div>
            <p className="mt-4 max-w-sm font-serif-n text-sm leading-relaxed text-[var(--sepia)]">
              An immersive murder-mystery supper, staged nightly in a room that
              has never quite forgiven its guests. Bring your wits. Leave your
              alibi at the door.
            </p>
          </div>

          {/* columns */}
          <FooterCol
            title="THE CASES"
            links={["The Last Train", "Ravenwood Manor", "The Crimson Sonata", "Private Bookings"]}
          />
          <FooterCol
            title="THE HOUSE"
            links={["Our Story", "The Detective's Code", "Gift a Seat", "Press Kit"]}
          />
          <FooterCol
            title="VISIT"
            links={["14 Candle Lane, Blackmore", "Doors 7:30 / Curtain 8:00", "+44 0141 000 1947", "seats@crimsonroom.tld"]}
          />
        </div>

        {/* guestbook line */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-[var(--paper-edge)]/10 pt-6 sm:flex-row sm:items-center">
          <div className="font-typewriter text-[10px] tracking-[0.2em] text-[var(--sepia)]">
            © 1947–{new Date().getFullYear()} THE CRIMSON ROOM · ALL THREADS LEAD
            SOMEWHERE
          </div>
          <button
            type="button"
            data-cursor="active"
            onClick={() => {
              setSigned((s) => !s);
              playPaperRustle(0.7);
            }}
            className="inline-flex items-center gap-2 border border-[var(--paper-edge)]/25 px-4 py-2 font-typewriter text-[10px] tracking-[0.2em] text-[var(--sepia)] transition-colors hover:border-[var(--blood)] hover:text-[var(--paper)]"
          >
            {signed ? "✓ SIGNED THE GUESTBOOK" : "SIGN THE GUESTBOOK"}
          </button>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div className="font-typewriter text-[10px] tracking-[0.3em] text-[var(--blood-bright)]">
        {title}
      </div>
      <ul className="mt-4 space-y-2">
        {links.map((l) => (
          <li
            key={l}
            className="font-serif-n text-sm text-[var(--sepia)] transition-colors hover:text-[var(--paper)]"
          >
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}
