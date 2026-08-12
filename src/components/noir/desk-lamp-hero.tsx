"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Coffee, Stamp } from "lucide-react";

/** Deterministic seeded PRNG (mulberry32) — identical on server & client. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Mote = {
  left: number;
  top: number;
  delay: number;
  dur: number;
  size: number;
};

/** Build dust motes deterministically so SSR & client match exactly. */
function buildMotes(count: number, seed: number): Mote[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }).map(() => ({
    left: 30 + rand() * 60,
    top: rand() * 80,
    delay: rand() * 8,
    dur: 7 + rand() * 8,
    size: 1 + rand() * 2.5,
  }));
}

/**
 * Hero: a noir detective's desk lit by a flickering articulated desk lamp.
 * The light cone flickers, dust drifts in the beam, and the title is
 * "typed" into view under the lamp's glow.
 */
export default function DeskLampHero() {
  const fullTitle = "THE CRIMSON ROOM";
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(fullTitle.slice(0, i));
      if (i >= fullTitle.length) {
        clearInterval(id);
        setTimeout(() => setDone(true), 350);
      }
    }, 95);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] w-full overflow-hidden"
      aria-label="The Crimson Room — murder mystery experience"
    >
      {/* Ambient base */}
      <div className="absolute inset-0 bg-[var(--noir-void)]" />

      {/* The desk + lamp scene */}
      <div className="absolute inset-0">
        {/* ---------- LIGHT CONE (flickers) ---------- */}
        <div
          className="lamp-flicker absolute"
          style={{
            top: "-5%",
            right: "2%",
            width: "78%",
            height: "120%",
            background:
              "conic-gradient(from 200deg at 88% 8%, rgba(246,168,38,0.30) 0deg, rgba(246,168,38,0.16) 18deg, rgba(246,168,38,0.05) 38deg, transparent 60deg, transparent 360deg)",
            filter: "blur(26px)",
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
        {/* warmer core beam */}
        <div
          className="lamp-glow absolute"
          style={{
            top: "0%",
            right: "8%",
            width: "55%",
            height: "100%",
            background:
              "radial-gradient(120% 80% at 86% 6%, rgba(255,201,102,0.34) 0%, rgba(246,168,38,0.16) 22%, rgba(246,168,38,0.04) 45%, transparent 70%)",
            filter: "blur(14px)",
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
        {/* Pool of light on the desk surface */}
        <div
          className="lamp-flicker absolute"
          style={{
            bottom: "-8%",
            right: "6%",
            width: "85%",
            height: "55%",
            background:
              "radial-gradient(60% 90% at 70% 100%, rgba(246,168,38,0.22) 0%, rgba(246,168,38,0.07) 40%, transparent 70%)",
            filter: "blur(20px)",
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />

        {/* ---------- DUST MOTES in the beam ---------- */}
        <DustMotes />

        {/* ---------- DESK SURFACE ---------- */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[42%]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(29,22,13,0.4) 18%, #1d160d 55%, #120c07 100%)",
            boxShadow: "inset 0 30px 80px rgba(0,0,0,0.6)",
          }}
        />
        {/* desk wood grain */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[42%] opacity-50"
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(74,53,32,0.10) 0px, rgba(74,53,32,0.10) 2px, transparent 2px, transparent 40px), repeating-linear-gradient(180deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 7px)",
          }}
        />

        {/* ---------- DESK PROPS ---------- */}
        {/* Manilla folder (left, in the dim) */}
        <div
          className="absolute"
          style={{
            left: "5%",
            bottom: "8%",
            width: "min(26vw, 320px)",
            transform: "rotate(-6deg)",
          }}
        >
          <div
            className="paper-surface aspect-[3/2] rounded-sm shadow-2xl"
            style={{ opacity: 0.82, filter: "brightness(0.6)" }}
          >
            <div className="p-4">
              <div className="h-1.5 w-2/3 bg-[var(--ink)]/30 mb-2" />
              <div className="h-1 w-full bg-[var(--ink)]/20 mb-1.5" />
              <div className="h-1 w-5/6 bg-[var(--ink)]/20 mb-1.5" />
              <div className="h-1 w-4/6 bg-[var(--ink)]/20" />
            </div>
          </div>
        </div>

        {/* Coffee cup */}
        <div
          className="absolute hidden sm:block"
          style={{ left: "26%", bottom: "13%" }}
        >
          <Coffee
            className="text-[var(--sepia)]"
            style={{
              width: 46,
              height: 46,
              filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.6)) brightness(0.7)",
            }}
            strokeWidth={1.2}
          />
        </div>

        {/* The lit note in the centre — "CASE FILE" */}
        <div
          className="absolute z-10"
          style={{
            left: "50%",
            bottom: "10%",
            transform: "translateX(-50%) rotate(2deg)",
            width: "min(38vw, 360px)",
          }}
        >
          <div
            className="paper-surface aspect-[3/2] rounded-sm"
            style={{
              boxShadow:
                "0 30px 60px rgba(0,0,0,0.7), 0 0 40px rgba(246,168,38,0.18)",
              filter: "brightness(0.96)",
            }}
          >
            <div className="flex h-full flex-col p-5">
              <div className="font-typewriter text-[10px] tracking-[0.3em] text-[var(--blood)]">
                CASE FILE — CONFIDENTIAL
              </div>
              <div className="mt-auto font-typewriter text-[11px] leading-relaxed text-[var(--ink-soft)]">
                <p className="mb-1">One guest will not leave the table.</p>
                <p>The rest will name the killer by dawn.</p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-[var(--ink)]/30" />
                <span className="font-typewriter text-[9px] text-[var(--ink-soft)]/70">
                  Det. M. Ashford
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Photograph pin */}
        <div
          className="absolute hidden md:block"
          style={{ right: "30%", bottom: "16%", transform: "rotate(-8deg)" }}
        >
          <div
            className="paper-surface p-1"
            style={{ width: 90, filter: "brightness(0.75)" }}
          >
            <div
              className="aspect-square bg-[var(--ink)]/40"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #3a2a1a 0%, #22160d 100%)",
              }}
            />
          </div>
        </div>

        {/* ---------- THE DESK LAMP (SVG) ---------- */}
        <DeskLamp />
      </div>

      {/* ---------- TITLE + COPY ---------- */}
      <div className="relative z-20 flex min-h-[100svh] flex-col">
        <header className="flex items-center justify-between px-6 py-5 md:px-12">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full border border-[var(--paper-edge)]/40">
              <span className="font-display text-lg text-[var(--blood-bright)]">
                C
              </span>
            </div>
            <div className="font-typewriter text-xs tracking-[0.35em] text-[var(--sepia)]">
              CRIMSON ROOM · EST. 2002
            </div>
          </div>
          <nav className="hidden gap-8 font-typewriter text-xs tracking-[0.25em] text-[var(--sepia)] md:flex">
            <a href="#dossiers" className="transition-colors hover:text-[var(--paper)]">
              DOSSIERS
            </a>
            <a href="#board" className="transition-colors hover:text-[var(--paper)]">
              THE BOARD
            </a>
            <a href="#book" className="transition-colors hover:text-[var(--paper)]">
              BOOK A SEAT
            </a>
          </nav>
        </header>

        <div className="flex flex-1 flex-col justify-center px-6 md:px-12">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-[var(--blood)]" />
              <span className="font-typewriter text-[11px] tracking-[0.4em] text-[var(--blood-bright)]">
                AN IMMERSIVE MURDER MYSTERY
              </span>
            </div>

            <h1
              className={`font-display font-black leading-[0.92] text-[var(--paper)] ${
                done ? "caret-blink" : ""
              }`}
              style={{
                fontSize: "clamp(2.6rem, 8vw, 6.5rem)",
                textShadow:
                  "0 0 30px rgba(246,168,38,0.25), 0 4px 30px rgba(0,0,0,0.8)",
              }}
            >
              {typed}
            </h1>

            <p
              className="mt-6 max-w-xl font-serif-n text-lg leading-relaxed text-[var(--paper-2)]/85 md:text-xl"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}
            >
              Six guests. One locked room. A killer among friends. Take your
              seat at the candlelit table, open the dossier, and follow the red
              string to the truth — before the lamp burns out.
            </p>

            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <a
                href="#book"
                className="group relative inline-flex items-center gap-3 overflow-hidden border-2 border-[var(--blood)] bg-[var(--blood)]/10 px-8 py-4 font-typewriter text-sm tracking-[0.25em] text-[var(--paper)] transition-all hover:bg-[var(--blood)]/25"
              >
                <Stamp className="h-4 w-4" />
                ENTER THE INVESTIGATION
              </a>
              <a
                href="#dossiers"
                className="inline-flex items-center gap-2 font-typewriter text-xs tracking-[0.3em] text-[var(--sepia)] transition-colors hover:text-[var(--paper)]"
              >
                READ THE DOSSIERS
                <ChevronDown className="h-4 w-4 animate-bounce" />
              </a>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="flex items-center justify-center pb-6">
          <div className="flex flex-col items-center gap-2 text-[var(--sepia)]/60">
            <span className="font-typewriter text-[10px] tracking-[0.4em]">
              SCROLL TO BEGIN
            </span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Desk lamp drawn in SVG, with a glowing bulb ---------- */
function DeskLamp() {
  return (
    <svg
      className="absolute"
      style={{ right: "6%", bottom: "8%", width: "min(34vw, 360px)" }}
      viewBox="0 0 360 420"
      fill="none"
      aria-hidden
    >
      <defs>
        <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff4d6" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#ffc966" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#f6a826" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3a3328" />
          <stop offset="45%" stopColor="#6b5d44" />
          <stop offset="100%" stopColor="#2a241a" />
        </linearGradient>
        <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1f1810" />
          <stop offset="50%" stopColor="#3a2e1d" />
          <stop offset="100%" stopColor="#161009" />
        </linearGradient>
        <linearGradient id="shadeInner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe9b0" />
          <stop offset="100%" stopColor="#f6a826" />
        </linearGradient>
      </defs>

      {/* Bulb glow — flickers via parent .lamp-glow? We add class here */}
      <circle
        className="lamp-glow"
        cx="245"
        cy="120"
        r="120"
        fill="url(#bulbGlow)"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Base */}
      <ellipse cx="60" cy="395" rx="70" ry="14" fill="#0a0806" opacity="0.7" />
      <path
        d="M20 392 Q60 372 100 392 L92 380 Q60 366 28 380 Z"
        fill="url(#metal)"
        stroke="#0a0806"
        strokeWidth="1.5"
      />
      <rect x="54" y="360" width="12" height="24" fill="url(#metal)" stroke="#0a0806" strokeWidth="1.5" />

      {/* Lower arm */}
      <rect
        x="56"
        y="220"
        width="8"
        height="145"
        rx="4"
        fill="url(#metal)"
        stroke="#0a0806"
        strokeWidth="1.5"
        transform="rotate(8 60 290)"
      />
      {/* Joint */}
      <circle cx="64" cy="222" r="11" fill="#4a4030" stroke="#0a0806" strokeWidth="2" />
      <circle cx="64" cy="222" r="4" fill="#1a140c" />

      {/* Upper arm */}
      <rect
        x="62"
        y="150"
        width="8"
        height="80"
        rx="4"
        fill="url(#metal)"
        stroke="#0a0806"
        strokeWidth="1.5"
        transform="rotate(-28 66 190)"
      />
      {/* Joint at shade */}
      <circle cx="200" cy="140" r="10" fill="#4a4030" stroke="#0a0806" strokeWidth="2" />
      <circle cx="200" cy="140" r="3.5" fill="#1a140c" />

      {/* Shade (trapezoid) */}
      <path
        d="M196 138 L300 70 L326 120 L214 168 Z"
        fill="url(#shade)"
        stroke="#0a0806"
        strokeWidth="2"
      />
      {/* Shade inner glow */}
      <path
        d="M202 142 L296 80 L318 118 L218 160 Z"
        fill="url(#shadeInner)"
        opacity="0.85"
        className="lamp-flicker"
      />
      {/* Shade rim */}
      <path
        d="M214 168 L326 120"
        stroke="#0a0806"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M196 138 L300 70"
        stroke="#0a0806"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---------- Drifting dust motes inside the light cone ---------- */
function DustMotes() {
  // Deterministic so the server and client render identical motes.
  const motes = useState<Mote[]>(() => buildMotes(22, 1947))[0];

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {motes.map((m, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: m.size,
            height: m.size,
            background: "rgba(255,220,150,0.7)",
            boxShadow: "0 0 4px rgba(255,220,150,0.6)",
            animation: `dust-drift ${m.dur}s linear ${m.delay}s infinite`,
            mixBlendMode: "screen",
          }}
        />
      ))}
    </div>
  );
}
