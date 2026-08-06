/**
 * Paper-rustle audio synthesized via the Web Audio API.
 * No external files needed — we build the sound from filtered noise bursts
 * with fast envelopes, layered to mimic the crinkle of paper.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  return ctx;
}

/** A single paper crinkle — short filtered noise with a snappy envelope. */
function crinkle(audio: AudioContext, when: number, gain: number, dur: number) {
  const length = Math.floor(audio.sampleRate * dur);
  const buffer = audio.createBuffer(1, length, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    // crackly noise: sparse pops + hiss
    const pop = Math.random() < 0.012 ? (Math.random() * 2 - 1) * 0.9 : 0;
    const hiss = (Math.random() * 2 - 1) * 0.25;
    data[i] = (pop + hiss) * (1 - i / length);
  }

  const src = audio.createBufferSource();
  src.buffer = buffer;

  const bp = audio.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 2200 + Math.random() * 2600;
  bp.Q.value = 0.7;

  const hp = audio.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 600;

  const g = audio.createGain();
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(gain, when + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, when + dur);

  src.connect(bp);
  bp.connect(hp);
  hp.connect(g);
  g.connect(audio.destination);
  src.start(when);
  src.stop(when + dur + 0.02);
}

/** A soft low thud — the impact of a stamp pressing paper. */
function thud(audio: AudioContext, when: number, gain = 0.18) {
  const osc = audio.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(160, when);
  osc.frequency.exponentialRampToValueAtTime(50, when + 0.18);

  const g = audio.createGain();
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(gain, when + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, when + 0.28);

  // noise click for the "snap" of impact
  const len = Math.floor(audio.sampleRate * 0.03);
  const buf = audio.createBuffer(1, len, audio.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const noise = audio.createBufferSource();
  noise.buffer = buf;
  const ng = audio.createGain();
  ng.gain.setValueAtTime(gain * 1.2, when);
  ng.gain.exponentialRampToValueAtTime(0.0001, when + 0.03);

  osc.connect(g);
  g.connect(audio.destination);
  noise.connect(ng);
  ng.connect(audio.destination);
  osc.start(when);
  osc.stop(when + 0.3);
  noise.start(when);
  noise.stop(when + 0.04);
}

/** A short rustle of paper — several crinkles spread over ~0.5s. */
export function playPaperRustle(intensity = 1) {
  const audio = getCtx();
  if (!audio) return;
  const now = audio.currentTime;
  const count = 4 + Math.floor(Math.random() * 4);
  for (let i = 0; i < count; i++) {
    const t = now + (i / count) * 0.45 + Math.random() * 0.05;
    crinkle(audio, t, 0.08 * intensity + Math.random() * 0.06, 0.12 + Math.random() * 0.1);
  }
}

/** A heavier paper flip — longer, more crinkles. */
export function playPaperFlip() {
  const audio = getCtx();
  if (!audio) return;
  const now = audio.currentTime;
  const count = 9;
  for (let i = 0; i < count; i++) {
    const t = now + (i / count) * 0.75 + Math.random() * 0.04;
    crinkle(audio, t, 0.06 + Math.random() * 0.07, 0.14 + Math.random() * 0.12);
  }
  // a soft woosh under it
  const len = Math.floor(audio.sampleRate * 0.5);
  const buf = audio.createBuffer(1, len, audio.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    d[i] = (Math.random() * 2 - 1) * (1 - i / len) * 0.3;
  }
  const src = audio.createBufferSource();
  src.buffer = buf;
  const bp = audio.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 900;
  bp.Q.value = 0.5;
  const g = audio.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.05, now + 0.1);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
  src.connect(bp);
  bp.connect(g);
  g.connect(audio.destination);
  src.start(now);
  src.stop(now + 0.55);
}

/** The decisive stamp impact: thud + paper crumple + ink spread hiss. */
export function playStamp() {
  const audio = getCtx();
  if (!audio) return;
  const now = audio.currentTime;
  thud(audio, now, 0.22);
  // paper crumple underneath
  for (let i = 0; i < 6; i++) {
    const t = now + 0.02 + (i / 6) * 0.35 + Math.random() * 0.04;
    crinkle(audio, t, 0.07 + Math.random() * 0.06, 0.12 + Math.random() * 0.1);
  }
}

/** A tiny tick for hovering interactive clues. */
export function playTick() {
  const audio = getCtx();
  if (!audio) return;
  const now = audio.currentTime;
  const osc = audio.createOscillator();
  osc.type = "square";
  osc.frequency.setValueAtTime(1800, now);
  const g = audio.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.015, now + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
  osc.connect(g);
  g.connect(audio.destination);
  osc.start(now);
  osc.stop(now + 0.06);
}
