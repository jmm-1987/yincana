import { Link, createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, Gamepad2, Puzzle, RotateCcw, Trophy } from "lucide-react";
import { MemoryGame } from "@/components/quest/MemoryGame";
import { MosaicPuzzle } from "@/components/quest/MosaicPuzzle";
import { Confetti } from "@/components/quest/Confetti";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/minijuegos")({
  head: () => ({
    meta: [
      { title: "Minijuegos para los peques · Yincanas" },
      {
        name: "description",
        content:
          "Juega al mosaico y a las parejas. Minijuegos para compartir en familia, una iniciativa de la Federación Extremeña de Alzheimer.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/minijuegos` }],
  }),
  component: MiniGames,
});

function MiniGames() {
  const [game, setGame] = useState<"mosaico" | "parejas" | null>(null);
  const [round, setRound] = useState(0);
  const [solved, setSolved] = useState(false);
  const currentRound = useRef(0);
  const restart = () => {
    currentRound.current += 1;
    setSolved(false);
    setRound(currentRound.current);
  };
  const finish = () => {
    if (currentRound.current === round) setSolved(true);
  };
  const choose = (next: "mosaico" | "parejas") => {
    setGame(next);
    restart();
  };

  return (
    <main className="mx-auto max-w-3xl px-5 pb-8 md:px-8">
      <header className="flex flex-wrap items-center justify-between gap-3 py-4">
        <Link to="/" aria-label="Federación Extremeña de Alzheimer, inicio">
          <img
            src="/images/logonew02.png"
            alt="Federación Extremeña de Alzheimer"
            width={280}
            height={100}
            className="h-auto w-[180px] md:w-[220px]"
          />
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
        >
          <ArrowLeft size={16} /> Volver a destinos
        </Link>
      </header>
      <p className="mt-4 text-xs font-extrabold uppercase tracking-widest text-primary">
        JUGAR Y COMPARTIR EN FAMILIA
      </p>
      <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
        Pequeños juegos, <span className="italic text-primary">grandes sonrisas.</span>
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Elige un juego y disfruta a tu ritmo. Puedes jugar tantas veces como quieras, sin empezar
        una yincana.
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => choose("mosaico")}
          aria-pressed={game === "mosaico"}
          className={`press rounded-2xl border-2 p-4 text-left ${game === "mosaico" ? "border-primary bg-terra-soft" : "border-border bg-card hover:border-primary/40"}`}
        >
          <Puzzle className="mb-3 text-primary" size={28} />
          <span className="block font-bold">El mosaico</span>
          <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
            Coloca las 9 piezas y descubre la imagen.
          </span>
        </button>
        <button
          type="button"
          onClick={() => choose("parejas")}
          aria-pressed={game === "parejas"}
          className={`press rounded-2xl border-2 p-4 text-left ${game === "parejas" ? "border-primary bg-terra-soft" : "border-border bg-card hover:border-primary/40"}`}
        >
          <Gamepad2 className="mb-3 text-primary" size={28} />
          <span className="block font-bold">Las parejas</span>
          <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
            Da la vuelta a las cartas y encuentra las 6 parejas.
          </span>
        </button>
      </div>
      {game ? (
        <section
          className="mt-5 rounded-3xl border border-border bg-card p-4 shadow-soft md:p-6"
          aria-labelledby="game-title"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="game-title" className="text-2xl font-semibold">
              {game === "mosaico" ? "¡Completa el mosaico!" : "¡Encuentra las parejas!"}
            </h2>
            <button
              type="button"
              onClick={restart}
              className="press inline-flex min-h-11 items-center gap-2 rounded-xl bg-terra-soft px-3 text-sm font-bold text-primary"
            >
              <RotateCcw size={16} /> Reiniciar
            </button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {game === "mosaico"
              ? "Toca una pieza y después otra para intercambiarlas. Puedes ver la imagen completa como pista."
              : "Toca dos cartas. Si son iguales, forman una pareja; si no, prueba otra vez."}
          </p>
          <div className="mx-auto max-w-md">
            {game === "mosaico" ? (
              <MosaicPuzzle key={`mosaico-${round}`} size={3} onSolved={finish} />
            ) : (
              <MemoryGame key={`parejas-${round}`} onSolved={finish} />
            )}
          </div>
          {solved && (
            <>
              <Confetti key={`confetti-${game}-${round}`} />
              <div role="status" className="mt-4 rounded-2xl bg-terra-soft p-4 text-center">
                <Trophy className="mx-auto mb-2 text-primary" size={28} />
                <p className="font-bold text-primary">¡Lo has conseguido! ¡Buen trabajo!</p>
                <button
                  type="button"
                  onClick={restart}
                  className="press mt-3 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white"
                >
                  Volver a jugar
                </button>
              </div>
            </>
          )}
        </section>
      ) : (
        <p className="mt-6 rounded-2xl bg-terra-soft p-5 text-center text-sm text-primary">
          ¿Qué te apetece jugar? Elige el mosaico o las parejas para empezar.
        </p>
      )}
      <footer className="mt-6 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
        Una iniciativa de la Federación Extremeña de Alzheimer para sensibilizar jugando y compartir
        momentos en familia.
      </footer>
    </main>
  );
}
