"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Magnifying-glass cursor.
 * - Follows the mouse with a glass lens + brass handle.
 * - Grows + glows amber when hovering interactive "clue" elements.
 * - On touch devices it is hidden (see globals.css).
 */
export default function MagnifyingCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const isTouch =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none)").matches;
    if (isTouch) return;

    const move = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      const el = e.target as HTMLElement | null;
      if (!el) return;
      const interactive = el.closest(
        'a, button, [role="button"], .clue-zone, [data-cursor="active"], input, select, textarea, label'
      );
      setActive(!!interactive);
    };

    const leave = () => setVisible(false);

    const loop = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.28;
      pos.current.y += (target.current.y - pos.current.y) * 0.28;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);
    window.addEventListener("mouseenter", () => setVisible(true));

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`magnifier-cursor ${active ? "is-active" : ""}`}
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden
    >
      <div className="lens">
        <div className="crosshair" />
      </div>
      <div className="handle" />
    </div>
  );
}
