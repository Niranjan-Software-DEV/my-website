"use client";

import { useEffect, useRef, useState } from "react";
import { suspects, connections } from "./data";
import { SectionHeading, Reveal } from "./dossier-reveal";
import { playTick, playPaperRustle } from "@/lib/paper-audio";
import { Pin, Gavel, Eye } from "lucide-react";

type Size = { w: number; h: number };

export default function SuspectBoard() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size>({ w: 0, h: 0 });
  const [active, setActive] = useState<string | null>(null);
  const [accused, setAccused] = useState<string | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () =>
      setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const byId = (id: string) => suspects.find((s) => s.id === id)!;
  const isRelated = (id: string) =>
    active &&
    connections.some(
      (c) =>
        (c.from === active && c.to === id) ||
        (c.to === active && c.from === id)
    );

  const pathFor = (from: string, to: string) => {
    const a = byId(from);
    const b = byId(to);
    const x1 = (a.x / 100) * size.w;
    const y1 = (a.y / 100) * size.h;
    const x2 = (b.x / 100) * size.w;
    const y2 = (b.y / 100) * size.h;
    // sagging string: midpoint dips down a little
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2 + Math.abs(x2 - x1) * 0.12 + 16;
    return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
  };

  return (
    <section
      id="board"
      className="relative px-6 py-24 md:px-12 md:py-32"
      aria-label="The suspect board"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="THE INVESTIGATION BOARD · CASE No. 047-Λ"
          title="Follow the Red String"
          body="Six suspects. Seven threads. Hover a photograph to light the connections — then pin the one who doesn't add up. The string never lies."
        />

        <Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* ---------- THE BOARD ---------- */}
            <div
              ref={wrapRef}
              className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-[var(--paper-edge)]/15"
              style={{
                background:
                  "radial-gradient(120% 100% at 50% 0%, #241a10 0%, #15100a 70%, #0e0a06 100%)",
                boxShadow:
                  "inset 0 0 80px rgba(0,0,0,0.7), inset 0 0 0 6px rgba(185,164,121,0.04)",
              }}
            >
              {/* cork / fabric texture */}
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23c)' opacity='0.5'/%3E%3C/svg%3E\")",
                  mixBlendMode: "overlay",
                }}
              />

              {/* pinned case photo in the center */}
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ transform: "translate(-50%, -50%) rotate(-3deg)" }}
              >
                <div className="relative paper-surface p-1.5" style={{ width: 108 }}>
                  <div
                    className="aspect-[3/4] bg-[var(--ink)]"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #2a1f15 0%, #141009 100%)",
                    }}
                  />
                  <Pin className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 text-[var(--blood-bright)]" />
                  <div className="mt-1 text-center font-typewriter text-[7px] tracking-[0.2em] text-[var(--ink-soft)]">
                    THE VICTIM
                  </div>
                </div>
              </div>

              {/* ---------- RED STRING SVG ---------- */}
              {size.w > 0 && (
                <svg
                  className="pointer-events-none absolute inset-0 z-20"
                  width={size.w}
                  height={size.h}
                  viewBox={`0 0 ${size.w} ${size.h}`}
                >
                  {connections.map((c, i) => {
                    const lit =
                      !active ||
                      active === c.from ||
                      active === c.to;
                    const d = pathFor(c.from, c.to);
                    return (
                      <g key={i} style={{ opacity: lit ? 1 : 0.18, transition: "opacity 0.3s" }}>
                        <path d={d} className="red-string-glow" />
                        <path
                          d={d}
                          className={`red-string ${active && (active === c.from || active === c.to) ? "string-pulse" : ""}`}
                        />
                        {/* label chip near midpoint */}
                        <StringLabel d={d} c={c} size={size} />
                      </g>
                    );
                  })}
                </svg>
              )}

              {/* ---------- SUSPECT PINS ---------- */}
              {suspects.map((s) => {
                const isActive = active === s.id;
                const related = isRelated(s.id);
                const dim = active && !isActive && !related;
                const isAccused = accused === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    data-cursor="active"
                    onMouseEnter={() => {
                      setActive(s.id);
                      playTick();
                    }}
                    onMouseLeave={() => setActive(null)}
                    onClick={() => {
                      setAccused((a) => (a === s.id ? null : s.id));
                      playPaperRustle(0.6);
                    }}
                    className="group absolute z-30 flex flex-col items-center"
                    style={{
                      left: `${s.x}%`,
                      top: `${s.y}%`,
                      transform: "translate(-50%, -50%)",
                      opacity: dim ? 0.4 : 1,
                      transition: "opacity 0.3s, transform 0.3s",
                    }}
                    aria-label={`Suspect: ${s.name}, ${s.role}`}
                  >
                    <div
                      className="relative"
                      style={{
                        transform: isActive ? "scale(1.12)" : "scale(1)",
                        transition: "transform 0.25s",
                      }}
                    >
                      {/* pushpin */}
                      <Pin
                        className="absolute -top-3 left-1/2 z-10 h-5 w-5 -translate-x-1/2 text-[var(--blood-bright)] drop-shadow"
                        style={{ transform: "rotate(8deg)" }}
                      />
                      <div
                        className="overflow-hidden border-2"
                        style={{
                          width: 72,
                          height: 84,
                          borderColor: isAccused
                            ? "var(--blood-bright)"
                            : isActive
                              ? "var(--amber-soft)"
                              : "var(--paper-edge)",
                          boxShadow: isActive
                            ? "0 0 0 2px rgba(246,168,38,0.4), 0 8px 18px rgba(0,0,0,0.6)"
                            : "0 8px 18px rgba(0,0,0,0.6)",
                          background: "var(--paper-2)",
                          transform: `rotate(${(s.x - 50) * -0.05}deg)`,
                        }}
                      >
                        {/* portrait */}
                        <img
                          src={s.photo}
                          alt={`Portrait of ${s.name}`}
                          className="h-full w-full object-cover"
                          style={{ filter: "grayscale(0.6) contrast(1.05) brightness(0.9) sepia(0.15)" }}
                          loading="lazy"
                        />
                      </div>
                      {isAccused && (
                        <div
                          className="absolute -inset-1 -z-0 border-2 border-dashed border-[var(--blood-bright)]"
                          style={{ transform: "rotate(-4deg)" }}
                        />
                      )}
                    </div>
                    <div className="mt-1.5 text-center">
                      <div
                        className="font-typewriter text-[10px] leading-tight text-[var(--paper)]"
                        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}
                      >
                        {s.name}
                      </div>
                      <div
                        className="font-typewriter text-[8px] tracking-[0.1em] text-[var(--sepia)]"
                        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}
                      >
                        {s.role}
                      </div>
                    </div>
                    {isAccused && (
                      <span className="mt-1 inline-flex items-center gap-1 bg-[var(--blood)] px-1.5 py-0.5 font-typewriter text-[7px] tracking-[0.2em] text-[var(--paper)]">
                        <Gavel className="h-2.5 w-2.5" /> ACCUSED
                      </span>
                    )}
                  </button>
                );
              })}

              {/* board header */}
              <div className="pointer-events-none absolute left-4 top-3 z-40 font-typewriter text-[9px] tracking-[0.3em] text-[var(--sepia)]/70">
                PERSONS OF INTEREST · 06
              </div>
              <div className="pointer-events-none absolute right-4 top-3 z-40 font-typewriter text-[9px] tracking-[0.3em] text-[var(--sepia)]/70">
                DET. ASHFORD · CONFIDENTIAL
              </div>
            </div>

            {/* ---------- DETAIL PANEL ---------- */}
            <div className="relative">
              <SuspectPanel
                suspect={active ? byId(active) : null}
                accused={accused}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* A small label sitting on the sag of each string */
function StringLabel({
  d,
  c,
  size,
}: {
  d: string;
  c: { label: string };
  size: Size;
}) {
  // approximate midpoint via the path's bounding box center
  const ref = useRef<SVGPathElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (ref.current) {
      const bb = ref.current.getBBox();
      setPos({ x: bb.x + bb.width / 2, y: bb.y + bb.height / 2 });
    }
  }, [d, size]);

  return (
    <>
      <path ref={ref} d={d} fill="none" stroke="none" />
      {pos && (
        <g transform={`translate(${pos.x}, ${pos.y + 6})`}>
          <rect
            x={-Math.max(c.label.length * 3.4, 24)}
            y={-7}
            width={Math.max(c.label.length * 6.8, 48)}
            height={14}
            rx={2}
            fill="rgba(10,8,6,0.82)"
            stroke="rgba(197,40,40,0.5)"
            strokeWidth={0.6}
          />
          <text
            x={0}
            y={3}
            textAnchor="middle"
            className="font-typewriter"
            style={{ fontSize: 8, letterSpacing: "0.05em", fill: "#e2d3b0" }}
          >
            {c.label}
          </text>
        </g>
      )}
    </>
  );
}

function SuspectPanel({
  suspect,
  accused,
}: {
  suspect: ReturnType<typeof suspects.find> | null;
  accused: string | null;
}) {
  if (!suspect) {
    return (
      <div className="paper-surface h-full min-h-[320px] rounded-sm p-6">
        <div className="flex items-center gap-2 font-typewriter text-[10px] tracking-[0.25em] text-[var(--blood)]">
          <Eye className="h-3.5 w-3.5" /> AWAITING EXAMINATION
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-[var(--ink)]">
          Hover a photograph.
        </h3>
        <p className="mt-2 font-serif-n text-sm leading-relaxed text-[var(--ink-soft)]">
          Move the lens over a suspect to read their alibi and motive. Click to
          mark them for accusation. The board remembers who you distrust.
        </p>
        <div className="mt-6 space-y-2 border-t border-[var(--ink)]/15 pt-4 font-typewriter text-[10px] text-[var(--ink-soft)]">
          <div className="flex justify-between">
            <span>SUSPECTS ON BOARD</span>
            <span className="text-[var(--ink)]">06</span>
          </div>
          <div className="flex justify-between">
            <span>RED THREADS</span>
            <span className="text-[var(--ink)]">07</span>
          </div>
          <div className="flex justify-between">
            <span>ACCUSED</span>
            <span className="text-[var(--blood)]">
              {accused ? "01" : "—"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      key={suspect.id}
      className="paper-surface h-full min-h-[320px] rounded-sm p-6 fade-up"
    >
      <div className="flex items-center justify-between">
        <span className="font-typewriter text-[10px] tracking-[0.25em] text-[var(--blood)]">
          PERSON OF INTEREST
        </span>
        <span className="font-typewriter text-[9px] text-[var(--ink-soft)]">
          #{suspect.id.toUpperCase()}
        </span>
      </div>
      <h3 className="mt-3 font-display text-2xl font-bold text-[var(--ink)]">
        {suspect.name}
      </h3>
      <p className="font-serif-n text-sm italic text-[var(--ink-soft)]">
        {suspect.role}
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <div className="font-typewriter text-[9px] tracking-[0.2em] text-[var(--blood)]">
            STATED ALIBI
          </div>
          <p className="mt-1 font-serif-n text-sm leading-relaxed text-[var(--ink)]">
            “{suspect.alibi}”
          </p>
        </div>
        <div>
          <div className="font-typewriter text-[9px] tracking-[0.2em] text-[var(--blood)]">
            POSSIBLE MOTIVE
          </div>
          <p className="mt-1 font-serif-n text-sm leading-relaxed text-[var(--ink)]">
            {suspect.motive}
          </p>
        </div>
      </div>

      {accused === suspect.id && (
        <div className="mt-5 flex items-center gap-2 border-2 border-[var(--blood)] bg-[var(--blood)]/10 p-3">
          <Gavel className="h-4 w-4 text-[var(--blood)]" />
          <span className="font-typewriter text-[10px] tracking-[0.2em] text-[var(--blood)]">
            MARKED FOR ACCUSATION
          </span>
        </div>
      )}
    </div>
  );
}
