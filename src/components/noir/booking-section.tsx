"use client";

import { useState } from "react";
import { cases } from "./data";
import { SectionHeading, Reveal } from "./dossier-reveal";
import { playStamp, playPaperRustle } from "@/lib/paper-audio";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Users,
  User,
  Mail,
  Stamp,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function BookingSection() {
  const { toast } = useToast();
  const [caseId, setCaseId] = useState(cases[0].id);
  const [date, setDate] = useState("");
  const [detectives, setDetectives] = useState(4);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [stamping, setStamping] = useState(false);
  const [stamped, setStamped] = useState(false);

  const selected = cases.find((c) => c.id === caseId)!;
  const total = selected.price * detectives;

  const canSubmit = name.trim() && email.trim() && date;

  const handleStamp = () => {
    if (!canSubmit || stamped) return;
    setStamping(true);
    playStamp();
    setTimeout(() => {
      setStamping(false);
      setStamped(true);
      toast({
        title: "Seat Filed",
        description: `Your place is reserved for "${selected.title}" on ${date}. A dossier will arrive at ${email}.`,
      });
    }, 600);
  };

  const reset = () => {
    setStamped(false);
    setName("");
    setEmail("");
    setDate("");
    setDetectives(4);
    playPaperRustle(0.5);
  };

  return (
    <section
      id="book"
      className="relative px-6 py-24 md:px-12 md:py-32"
      aria-label="Book your seat"
    >
      {/* atmospheric glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 60%, rgba(246,168,38,0.06), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="RESERVATIONS · NIGHTLY 8:00 PM"
          title="Take Your Seat at the Table"
          body="Choose your case, name your night, and press the stamp. The ink is dry — your seat is filed the moment the stamp falls."
        />

        <Reveal>
          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_440px]">
            {/* ---------- FORM ---------- */}
            <div className="paper-surface rounded-sm p-7 md:p-9">
              {stamped ? (
                <ConfirmationView
                  selected={selected}
                  date={date}
                  detectives={detectives}
                  name={name}
                  total={total}
                  onReset={reset}
                />
              ) : (
                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleStamp();
                  }}
                >
                  <div>
                    <Label icon={<Stamp className="h-3.5 w-3.5" />}>
                      SELECT YOUR CASE
                    </Label>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      {cases.map((c) => {
                        const on = c.id === caseId;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            data-cursor="active"
                            onClick={() => {
                              setCaseId(c.id);
                              playPaperRustle(0.4);
                            }}
                            className={`relative border-2 p-3 text-left transition-all ${
                              on
                                ? "border-[var(--blood)] bg-[var(--blood)]/10"
                                : "border-[var(--ink)]/20 hover:border-[var(--ink)]/40"
                            }`}
                          >
                            <div className="font-typewriter text-[8px] tracking-[0.15em] text-[var(--ink-soft)]">
                              {c.code}
                            </div>
                            <div className="mt-1 font-display text-sm font-bold leading-tight text-[var(--ink)]">
                              {c.title}
                            </div>
                            <div className="mt-2 flex items-center justify-between font-typewriter text-[10px] text-[var(--blood)]">
                              <span>${c.price}</span>
                              <span>{c.duration}</span>
                            </div>
                            {on && (
                              <CheckCircle2 className="absolute right-2 top-2 h-4 w-4 text-[var(--blood)]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <Label icon={<Calendar className="h-3.5 w-3.5" />}>
                        THE NIGHT
                      </Label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="noir-input mt-2 w-full"
                        data-cursor="active"
                      />
                    </div>
                    <div>
                      <Label icon={<Users className="h-3.5 w-3.5" />}>
                        DETECTIVES · {detectives}
                      </Label>
                      <input
                        type="range"
                        min={3}
                        max={10}
                        value={detectives}
                        onChange={(e) => setDetectives(Number(e.target.value))}
                        className="noir-range mt-4 w-full"
                        data-cursor="active"
                      />
                      <div className="mt-1 flex justify-between font-typewriter text-[9px] text-[var(--ink-soft)]">
                        <span>3</span>
                        <span>10</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <Label icon={<User className="h-3.5 w-3.5" />}>
                        YOUR NAME
                      </Label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Det. ___"
                        className="noir-input mt-2 w-full"
                        data-cursor="active"
                      />
                    </div>
                    <div>
                      <Label icon={<Mail className="h-3.5 w-3.5" />}>
                        POSTAL ADDRESS (EMAIL)
                      </Label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@candlelight.tld"
                        className="noir-input mt-2 w-full"
                        data-cursor="active"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t-2 border-[var(--ink)]/15 pt-5">
                    <div>
                      <div className="font-typewriter text-[9px] tracking-[0.2em] text-[var(--ink-soft)]">
                        {detectives} SEAT(S) · ${selected.price} EACH
                      </div>
                      <div className="font-display text-3xl font-bold text-[var(--blood)]">
                        ${total}
                      </div>
                    </div>
                    <div className="font-typewriter text-[9px] text-right text-[var(--ink-soft)]">
                      PAY AT THE DOOR
                      <br />
                      <span className="text-[var(--ink)]">CANDLE &amp; COIN</span>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* ---------- GIANT PRESS STAMP CTA ---------- */}
            <div className="relative flex flex-col items-center justify-center">
              <StampCTA
                disabled={!canSubmit}
                stamping={stamping}
                stamped={stamped}
                onStamp={handleStamp}
              />
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`
        .noir-input {
          background: rgba(43, 29, 16, 0.06);
          border: 1.5px solid rgba(43, 29, 16, 0.25);
          color: var(--ink);
          font-family: var(--font-typewriter), monospace;
          font-size: 13px;
          padding: 10px 12px;
          border-radius: 2px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .noir-input:focus {
          border-color: var(--blood);
          box-shadow: 0 0 0 3px rgba(156,27,27,0.15);
        }
        .noir-input::placeholder { color: rgba(43,29,16,0.4); }
        .noir-range {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          background: rgba(43,29,16,0.25);
          border-radius: 2px;
          outline: none;
        }
        .noir-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--blood);
          border: 2px solid var(--paper);
          cursor: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        }
        .noir-range::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--blood);
          border: 2px solid var(--paper);
          cursor: none;
        }
      `}</style>
    </section>
  );
}

function Label({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-2 font-typewriter text-[10px] tracking-[0.2em] text-[var(--blood)]">
      {icon}
      {children}
    </label>
  );
}

function StampCTA({
  disabled,
  stamping,
  stamped,
  onStamp,
}: {
  disabled: boolean;
  stamping: boolean;
  stamped: boolean;
  onStamp: () => void;
}) {
  return (
    <div className="relative flex flex-col items-center">
      {/* instruction */}
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-2 font-typewriter text-[10px] tracking-[0.35em] text-[var(--blood-bright)]">
          <Sparkles className="h-3.5 w-3.5" /> PRESS FIRMLY
        </div>
        <p className="mt-2 font-serif-n text-sm text-[var(--sepia)]">
          {disabled
            ? "Complete the form to arm the stamp."
            : "One press files your seat. No refunds for the curious."}
        </p>
      </div>

      {/* the stamp */}
      <button
        type="button"
        data-cursor="active"
        disabled={disabled || stamped}
        onClick={onStamp}
        aria-label="Press the stamp to join the game"
        className={`stamp-block relative grid place-items-center transition-transform duration-200 ${
          disabled ? "opacity-40" : "hover:scale-[1.03]"
        } ${stamping ? "stamp-fire" : ""}`}
        style={{
          width: "min(86vw, 340px)",
          height: "min(86vw, 340px)",
          transform: "rotate(-7deg)",
          borderRadius: "8px",
        }}
      >
        {/* ink splash on fire */}
        {stamping && (
          <span
            className="ink-splash absolute inset-0 m-auto rounded-full"
            style={{
              width: "70%",
              height: "70%",
              background:
                "radial-gradient(circle, rgba(156,27,27,0.5), transparent 70%)",
            }}
          />
        )}

        <div className="relative z-10 px-6 text-center">
          <div className="font-typewriter text-[10px] tracking-[0.4em] text-[var(--blood)]">
            ✦ ADMIT ONE ✦
          </div>
          <div
            className="my-2 font-display font-black leading-[0.85] text-[var(--blood)]"
            style={{ fontSize: "clamp(2rem, 7vw, 3.2rem)" }}
          >
            JOIN
          </div>
          <div
            className="font-display font-black leading-[0.85] text-[var(--blood)]"
            style={{ fontSize: "clamp(2rem, 7vw, 3.2rem)" }}
          >
            THE GAME
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 font-typewriter text-[9px] tracking-[0.3em] text-[var(--blood)]/80">
            <span className="h-px w-6 bg-[var(--blood)]/60" />
            CRIMSON ROOM · 1947
            <span className="h-px w-6 bg-[var(--blood)]/60" />
          </div>
        </div>

        {/* corner stars */}
        <span className="absolute left-3 top-3 font-typewriter text-xs text-[var(--blood)]/70">✦</span>
        <span className="absolute right-3 top-3 font-typewriter text-xs text-[var(--blood)]/70">✦</span>
        <span className="absolute bottom-3 left-3 font-typewriter text-xs text-[var(--blood)]/70">✦</span>
        <span className="absolute bottom-3 right-3 font-typewriter text-xs text-[var(--blood)]/70">✦</span>
      </button>

      {/* stamped confirmation */}
      {stamped && (
        <div className="mt-6 flex items-center gap-2 fade-up">
          <CheckCircle2 className="h-5 w-5 text-[var(--blood-bright)]" />
          <span className="font-typewriter text-xs tracking-[0.2em] text-[var(--paper)]">
            STAMPED · SEAT FILED
          </span>
        </div>
      )}
    </div>
  );
}

function ConfirmationView({
  selected,
  date,
  detectives,
  name,
  total,
  onReset,
}: {
  selected: (typeof cases)[number];
  date: string;
  detectives: number;
  name: string;
  total: number;
  onReset: () => void;
}) {
  return (
    <div className="fade-up flex h-full flex-col">
      <div className="flex items-center gap-2 font-typewriter text-[10px] tracking-[0.25em] text-[var(--blood)]">
        <CheckCircle2 className="h-4 w-4" /> RESERVATION CONFIRMED
      </div>
      <h3 className="mt-3 font-display text-3xl font-bold text-[var(--ink)]">
        Your seat is filed, {name.split(" ")[0] || "Detective"}.
      </h3>
      <p className="mt-2 font-serif-n text-base leading-relaxed text-[var(--ink-soft)]">
        Present yourself at the candlelit table on the night below. A sealed
        dossier and your character brief will arrive by post. Do not be late —
        the first toast is also the last.
      </p>

      <div className="mt-6 space-y-3 border-t-2 border-[var(--ink)]/15 pt-5">
        <Row label="CASE" value={selected.title} />
        <Row label="NIGHT" value={new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} />
        <Row label="SEATS" value={`${detectives} detective(s)`} />
        <Row label="DOORS" value="7:30 PM · Curtain 8:00 PM" />
        <Row label="DUE AT DOOR" value={`$${total} (candle & coin)`} />
      </div>

      <button
        type="button"
        data-cursor="active"
        onClick={onReset}
        className="mt-auto inline-flex w-fit items-center gap-2 border-2 border-[var(--ink)]/30 px-5 py-2.5 font-typewriter text-[11px] tracking-[0.2em] text-[var(--ink)] transition-colors hover:border-[var(--blood)] hover:text-[var(--blood)]"
      >
        ← FILE ANOTHER SEAT
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="font-typewriter text-[10px] tracking-[0.2em] text-[var(--ink-soft)]">
        {label}
      </span>
      <span className="text-right font-serif-n text-sm text-[var(--ink)]">
        {value}
      </span>
    </div>
  );
}
