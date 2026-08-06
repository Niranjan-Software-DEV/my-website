"use client";

import { useEffect, useRef, useState } from "react";
import { cases, type CaseDossier } from "./data";
import { playPaperFlip, playPaperRustle } from "@/lib/paper-audio";
import {
  FileText,
  MapPin,
  Clock,
  Users,
  Lock,
  Fingerprint,
  FlaskConical,
} from "lucide-react";

export default function DossierReveal() {
  return (
    <section
      id="dossiers"
      className="relative px-6 py-24 md:px-12 md:py-32"
      aria-label="Case dossiers"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="EVIDENCE LOCKER · 03 FILES"
          title="Open a Dossier"
          body="Three cases lie on the desk, stamped and waiting. Turn the page — read what the lamp will not. Each flips open with a whisper of old paper."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((c, i) => (
            <Reveal key={c.id} delay={i * 120}>
              <DossierCard dossier={c} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function DossierCard({ dossier }: { dossier: CaseDossier }) {
  const [flipped, setFlipped] = useState(false);
  const [revealedClues, setRevealedClues] = useState<boolean[]>(
    dossier.clues.map(() => false)
  );

  const flip = () => {
    setFlipped((f) => {
      const next = !f;
      if (next) playPaperFlip();
      else playPaperRustle(0.8);
      return next;
    });
  };

  const revealClue = (i: number) => {
    setRevealedClues((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      playPaperRustle(0.5);
      return next;
    });
  };

  return (
    <div
      className={`dossier-flip h-[470px] ${flipped ? "is-flipped" : ""}`}
      onClick={flip}
      data-cursor="active"
      role="button"
      aria-label={`${flipped ? "Close" : "Open"} dossier: ${dossier.title}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          flip();
        }
      }}
    >
      <div className="dossier-inner">
        {/* FRONT */}
        <div className="dossier-face dossier-front">
          <DossierFront dossier={dossier} />
        </div>
        {/* BACK */}
        <div className="dossier-face dossier-back">
          <DossierBack
            dossier={dossier}
            revealedClues={revealedClues}
            onReveal={revealClue}
          />
        </div>
      </div>
    </div>
  );
}

function DossierFront({ dossier }: { dossier: CaseDossier }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-sm paper-surface shadow-2xl">
      {/* folder tab */}
      <div
        className="absolute -top-1 left-6 h-9 w-40 rounded-t-sm"
        style={{
          background: "var(--paper-2)",
          boxShadow: "inset 0 6px 8px rgba(80,50,20,0.18)",
        }}
      />
      {/* red tape band */}
      <div className="absolute left-0 top-1/2 h-44 w-7 -translate-y-1/2 -rotate-3 bg-[var(--blood)]/70 shadow-lg" />
      <div className="absolute left-0 top-1/2 h-44 w-7 -translate-y-1/2 -rotate-3 bg-gradient-to-b from-transparent via-[var(--blood-bright)]/40 to-transparent" />

      <div className="flex h-full flex-col p-6 pl-12">
        <div className="flex items-center justify-between">
          <span className="font-typewriter text-[10px] tracking-[0.25em] text-[var(--ink-soft)]">
            {dossier.code}
          </span>
          <DifficultyBadge level={dossier.difficulty} />
        </div>

        <h3 className="mt-6 font-display text-2xl font-bold leading-tight text-[var(--ink)] md:text-[1.7rem]">
          {dossier.title}
        </h3>

        <p className="mt-3 font-serif-n text-sm italic leading-relaxed text-[var(--ink-soft)]">
          “{dossier.tagline}”
        </p>

        <div className="mt-auto space-y-2 font-typewriter text-[11px] text-[var(--ink-soft)]">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" /> {dossier.duration}
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5" /> {dossier.players} detectives
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">{dossier.setting}</span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-[var(--ink)]/15 pt-4">
          <span className="font-display text-2xl font-bold text-[var(--blood)]">
            ${dossier.price}
          </span>
          <span className="font-typewriter text-[10px] tracking-[0.25em] text-[var(--ink-soft)]">
            OPEN FILE →
          </span>
        </div>
      </div>

      {/* corner seal */}
      <div
        className="absolute right-4 top-4 grid h-16 w-16 place-items-center rounded-full border-[3px] border-[var(--blood)]/70 text-center font-typewriter text-[8px] leading-tight tracking-[0.12em] text-[var(--blood)]/80"
        style={{ transform: "rotate(-12deg)" }}
      >
        {dossier.seal}
      </div>
    </div>
  );
}

function DossierBack({
  dossier,
  revealedClues,
  onReveal,
}: {
  dossier: CaseDossier;
  revealedClues: boolean[];
  onReveal: (i: number) => void;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-sm paper-surface shadow-2xl">
      {/* lined-paper overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "repeating-linear-gradient(180deg, transparent 0px, transparent 27px, rgba(156,27,27,0.12) 27px, rgba(156,27,27,0.12) 28px)",
        }}
      />
      {/* red margin line */}
      <div className="pointer-events-none absolute left-8 top-0 h-full w-px bg-[var(--blood)]/40" />

      <div className="relative flex h-full flex-col p-6 pl-12">
        <div className="flex items-center justify-between">
          <span className="font-typewriter text-[10px] tracking-[0.2em] text-[var(--blood)]">
            ✦ CONFIDENTIAL — REVERSED
          </span>
          <span className="font-typewriter text-[10px] text-[var(--ink-soft)]">
            {dossier.code}
          </span>
        </div>

        <h3 className="mt-3 font-display text-xl font-bold leading-tight text-[var(--ink)]">
          {dossier.title}
        </h3>

        <div className="mt-3 flex items-start gap-2">
          <Fingerprint className="mt-0.5 h-4 w-4 shrink-0 text-[var(--blood)]" />
          <p className="font-serif-n text-[13px] leading-snug text-[var(--ink-soft)]">
            <span className="font-semibold text-[var(--ink)]">The Victim. </span>
            {dossier.victim}
          </p>
        </div>

        <p className="mt-2 font-serif-n text-[13px] leading-relaxed text-[var(--ink-soft)]">
          {dossier.summary}
        </p>

        <div className="mt-3">
          <div className="flex items-center gap-2 font-typewriter text-[10px] tracking-[0.2em] text-[var(--blood)]">
            <FlaskConical className="h-3.5 w-3.5" /> EVIDENCE LOG
          </div>
          <ul className="mt-2 space-y-1.5">
            {dossier.clues.map((clue, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReveal(i);
                  }}
                  className="group flex w-full items-start gap-2 text-left font-typewriter text-[11px] leading-snug text-[var(--ink-soft)]"
                  data-cursor="active"
                >
                  <Lock className="mt-0.5 h-3 w-3 shrink-0 text-[var(--blood)] transition-transform group-hover:scale-110" />
                  <span
                    className={
                      revealedClues[i] ? "clue-revealed" : "clue-hidden"
                    }
                  >
                    {revealedClues[i] ? clue : "█████████ ███████ ██ ███"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-[var(--ink)]/15 pt-4">
          <a
            href="#book"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 bg-[var(--blood)] px-4 py-2 font-typewriter text-[11px] tracking-[0.2em] text-[var(--paper)] transition-colors hover:bg-[var(--blood-bright)]"
            data-cursor="active"
          >
            <FileText className="h-3.5 w-3.5" /> BOOK THIS CASE
          </a>
          <span className="font-typewriter text-[10px] text-[var(--ink-soft)]">
            ← close
          </span>
        </div>
      </div>
    </div>
  );
}

function DifficultyBadge({ level }: { level: CaseDossier["difficulty"] }) {
  const color =
    level === "Rookie"
      ? "var(--ink-soft)"
      : level === "Sleuth"
        ? "var(--blood)"
        : "var(--blood-bright)";
  return (
    <span
      className="inline-flex items-center gap-1.5 border px-2 py-1 font-typewriter text-[9px] tracking-[0.2em]"
      style={{ borderColor: color, color }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: color }}
      />
      {level.toUpperCase()}
    </span>
  );
}

/* ---------- Shared section heading + scroll reveal ---------- */
export function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <Reveal>
      <div className="max-w-2xl">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-[var(--blood)]" />
          <span className="font-typewriter text-[11px] tracking-[0.35em] text-[var(--blood-bright)]">
            {eyebrow}
          </span>
        </div>
        <h2
          className="font-display font-bold leading-[0.95] text-[var(--paper)]"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          {title}
        </h2>
        {body && (
          <p className="mt-4 font-serif-n text-lg leading-relaxed text-[var(--sepia)]">
            {body}
          </p>
        )}
      </div>
    </Reveal>
  );
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => setInView(true), delay);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal-init ${inView ? "reveal-in" : ""} ${className}`}>
      {children}
    </div>
  );
}
