import { useMemo, useState } from "react";
import { Eye } from "lucide-react";
import mosaic from "@/assets/mosaic.jpg";

function shuffled(n: number) {
  const a = Array.from({ length: n }, (_, i) => i);
  do {
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j]!, a[i]!];
    }
  } while (a.every((v, i) => v === i));
  return a;
}

export function MosaicPuzzle({ size, onSolved }: { size: number; onSolved: () => void }) {
  const initial = useMemo(() => shuffled(size * size), [size]);
  const [tiles, setTiles] = useState(initial);
  const [sel, setSel] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [peek, setPeek] = useState(false);
  const solved = tiles.every((v, i) => v === i);

  const tap = (pos: number) => {
    if (solved) return;
    if (sel === null) return setSel(pos);
    if (sel === pos) return setSel(null);
    const next = [...tiles];
    [next[sel], next[pos]] = [next[pos]!, next[sel]!];
    setTiles(next);
    setSel(null);
    setMoves((m) => m + 1);
    if (next.every((v, i) => v === i)) setTimeout(onSolved, 400);
  };

  return (
    <div className="mt-3">
      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-muted-foreground">
        <span>Movimientos: {moves}</span>
        <button onPointerDown={() => setPeek(true)} onPointerUp={() => setPeek(false)} onPointerLeave={() => setPeek(false)}
          className="press flex items-center gap-1.5 rounded-full bg-sea-soft px-3 py-1.5 text-sea">
          <Eye className="h-4 w-4" /> Mantén para ver
        </button>
      </div>
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-4 border-gold bg-secondary shadow-soft">
        <div className="grid h-full w-full" style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, gap: solved ? 0 : 2 }}>
          {tiles.map((t, pos) => {
            const x = (t % size) * (100 / (size - 1));
            const y = Math.floor(t / size) * (100 / (size - 1));
            return (
              <button key={pos} onClick={() => tap(pos)} aria-label={`Pieza ${pos + 1}`}
                className={`transition-all duration-200 ${sel === pos ? "z-10 scale-95 ring-4 ring-primary" : ""}`}
                style={{ backgroundImage: `url(${mosaic})`, backgroundSize: `${size * 100}%`, backgroundPosition: `${x}% ${y}%` }} />
            );
          })}
        </div>
        {peek && <img src={mosaic} alt="Mosaico completo" className="absolute inset-0 h-full w-full object-cover animate-fade-in" />}
      </div>
    </div>
  );
}
