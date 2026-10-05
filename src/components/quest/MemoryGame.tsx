import { useMemo, useState } from "react";

const SYMBOLS = ["🏛️", "🐺", "🌾", "⚔️", "🐬", "🌉"];

export function MemoryGame({ onSolved }: { onSolved: () => void }) {
  const deck = useMemo(() => {
    const d = [...SYMBOLS, ...SYMBOLS];
    for (let i = d.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [d[i], d[j]] = [d[j]!, d[i]!];
    }
    return d;
  }, []);
  const [open, setOpen] = useState<number[]>([]);
  const [found, setFound] = useState<number[]>([]);
  const [tries, setTries] = useState(0);

  const flip = (i: number) => {
    if (open.length === 2 || open.includes(i) || found.includes(i)) return;
    const next = [...open, i];
    setOpen(next);
    if (next.length === 2) {
      setTries((t) => t + 1);
      const [a, b] = next as [number, number];
      if (deck[a] === deck[b]) {
        const f = [...found, a, b];
        setTimeout(() => { setFound(f); setOpen([]); if (f.length === deck.length) setTimeout(onSolved, 300); }, 400);
      } else {
        setTimeout(() => setOpen([]), 900);
      }
    }
  };

  return (
    <div className="mt-3">
      <p className="mb-2 text-sm font-semibold text-muted-foreground">Intentos: {tries} · Parejas: {found.length / 2}/{SYMBOLS.length}</p>
      <div className="grid grid-cols-4 gap-2">
        {deck.map((s, i) => {
          const shown = open.includes(i) || found.includes(i);
          return (
            <button key={i} onClick={() => flip(i)} aria-label={shown ? s : "Carta oculta"}
              className={`press grid aspect-square place-items-center rounded-xl border-2 text-3xl transition-all ${
                found.includes(i) ? "border-success bg-success-soft" : shown ? "border-primary bg-card" : "border-gold bg-gradient-primary"}`}>
              {shown ? s : <span className="font-display text-xl font-bold text-primary-foreground">?</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
