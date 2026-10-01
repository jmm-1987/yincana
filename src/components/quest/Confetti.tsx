import { useMemo } from "react";

const COLORS = ["var(--primary)", "var(--gold)", "var(--sea)", "var(--success)"];

export function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        i,
        left: Math.random() * 100,
        dx: `${(Math.random() - 0.5) * 160}px`,
        dur: `${1.6 + Math.random() * 1.6}s`,
        delay: `${Math.random() * 0.4}s`,
        color: COLORS[i % COLORS.length],
        w: 6 + Math.random() * 6,
        round: Math.random() > 0.6,
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.i}
          className="animate-confetti absolute top-0"
          style={
            {
              left: `${p.left}%`,
              width: p.w,
              height: p.round ? p.w : p.w * 1.8,
              background: p.color,
              borderRadius: p.round ? 999 : 2,
              animationDelay: p.delay,
              "--dx": p.dx,
              "--dur": p.dur,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
