import { useState } from "react";
import {
  Compass, Users, Play, Lock, Check, SkipForward, Trophy,
  Lightbulb, X, Award, RotateCcw, Star, Loader2, Timer,
} from "lucide-react";
import { CONCLUSION, MODES, type Challenge, type Mode, type NodeStatus } from "@/lib/quest-data";
import { CommunityBoard, ShareResult, formatDuration } from "./Community";
import imgIndividual from "@/assets/mode-explorador.png";
import imgFamilia from "@/assets/mode-familia.png";
import placeTeatro from "@/assets/place-teatro.jpg";
import placeDiana from "@/assets/place-diana.jpg";
import placeForo from "@/assets/place-foro.jpg";
import placePuente from "@/assets/place-puente.jpg";
import placeMitreo from "@/assets/place-mitreo.jpg";
import placeAnfi from "@/assets/place-anfiteatro.jpg";
import placeMuseo from "@/assets/place-museo.jpg";
import placeParque from "@/assets/place-parque.jpg";
import placeLoba from "@/assets/place-loba.jpg";
import placePlaza from "@/assets/place-plaza.jpg";
import mosaicImg from "@/assets/mosaic.jpg";
import { MemoryGame } from "./MemoryGame";
import { MosaicPuzzle } from "./MosaicPuzzle";

const modeIcon = { individual: Compass, familia: Users } as const;
const modeImg = { individual: imgIndividual, familia: imgFamilia } as const;
export const PLACE_IMG: Record<number, string> = { 1: placeTeatro, 2: placeAnfi, 3: placeMuseo, 4: placeForo, 5: placeDiana, 6: placeParque, 7: placeLoba, 8: placePuente, 9: placePlaza, 101: mosaicImg, 102: placeMitreo };

export function Onboarding({ onStart }: { onStart: (name: string, mode: Mode) => void }) {
  const [name, setName] = useState("");
  const [mode, setMode] = useState<Mode>("individual");
  const current = MODES.find((m) => m.id === mode)!;
  return (
    <div className="animate-fade-in flex min-h-screen flex-col pb-8">
      <div className="relative h-64 overflow-hidden rounded-b-[2.5rem] shadow-soft">
        <img src={placeTeatro} alt="Teatro Romano de Mérida" width={1024} height={640} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="-mt-14 relative px-5">
        <h1 className="text-[2.7rem] font-semibold leading-[1] text-foreground">
          Emerita <span className="italic text-primary">Augusta</span>
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Ayuda a <strong className="text-foreground">Julia</strong> a recuperar sus recuerdos recorriendo 9 lugares de Mérida.
        </p>

        <p className="mb-3 mt-7 text-sm font-bold text-foreground">¿Quién participa?</p>
        <div className="grid grid-cols-2 gap-3">
          {MODES.map((m) => {
            const active = mode === m.id;
            const Icon = modeIcon[m.id];
            return (
              <button key={m.id} onClick={() => setMode(m.id)}
                className={`press relative flex flex-col items-center overflow-hidden rounded-3xl border-2 px-2 pb-3 pt-2 ${
                  active ? "border-primary bg-card shadow-glow" : "glass border-transparent"}`}>
                {active && <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="h-3 w-3" strokeWidth={3} /></span>}
                <span className={`grid aspect-square w-full place-items-center rounded-2xl transition-colors ${active ? "bg-terra-soft" : "bg-secondary"}`}>
                  <img src={modeImg[m.id]} alt={m.label} width={816} height={816}
                    className={`h-full w-full object-contain p-1 transition-transform duration-300 ${active ? "scale-110" : ""}`} />
                </span>
                <span className="mt-2 flex items-center gap-1 text-center text-sm font-bold leading-tight text-foreground">
                  <Icon className="h-4 w-4 shrink-0 text-primary" /> {m.label}
                </span>
              </button>
            );
          })}
        </div>
        <p key={mode} className="animate-fade-in mt-3 rounded-2xl bg-gold-soft px-4 py-2.5 text-sm text-secondary-foreground">
          <strong>{current.label}:</strong> {current.desc}
        </p>

        <label className="mt-6 block">
          <span className="mb-2 block text-sm font-bold text-foreground">Nombre del explorador o equipo</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Los Legionarios"
            className="glass w-full rounded-2xl px-4 py-4 text-base text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring" />
        </label>

        <button onClick={() => onStart(name.trim() || "Viajero", mode)}
          className="press mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary py-4 text-lg font-bold text-primary-foreground shadow-glow">
          <Play className="h-5 w-5 fill-current" /> Empezar la yincana
        </button>

        <CommunityBoard />
      </div>
    </div>
  );
}

export function RouteMap({
  name, score, statuses, route, onOpen, onFinish,
}: {
  name: string; score: number; statuses: NodeStatus[]; route: Challenge[];
  onOpen: (i: number) => void; onFinish: () => void;
}) {
  const finished = statuses.every((s) => s === "done" || s === "skipped");
  const progress = statuses.filter((s) => s === "done" || s === "skipped").length;
  return (
    <div className="animate-fade-in min-h-screen px-5 pb-10 pt-6">
      <header className="glass sticky top-3 z-10 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-muted-foreground">Ruta de</p>
          <p className="truncate font-bold text-foreground">{name}</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-gold-soft px-3 py-1.5 font-bold text-gold">
          <Star className="h-4 w-4 fill-current" /> {score}
        </div>
        <div className="col-span-2 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-gradient-gold transition-all duration-700" style={{ width: `${(progress / route.length) * 100}%` }} />
        </div>
      </header>

      <h2 className="mt-6 text-2xl font-semibold text-foreground">Tu camino por Emerita</h2>
      <p className="text-sm text-muted-foreground">{progress} de {route.length} paradas completadas</p>

      <div className="relative mt-6">
        <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 100 ${route.length * 100}`} preserveAspectRatio="none" aria-hidden>
          <path d={route.map((_, i) => `${i === 0 ? "M" : "L"}${i % 2 === 0 ? 28 : 72} ${i * 100 + 50}`).join(" ")}
            fill="none" stroke="var(--border)" strokeWidth="1.4" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 4 }} />
        </svg>
        <ol className="relative grid gap-0">
          {route.map((c, i) => (
            <MapNode key={c.id} c={c} i={i} status={statuses[i] ?? "locked"} onOpen={() => onOpen(i)} />
          ))}
        </ol>
      </div>

      {finished && (
        <button onClick={onFinish} className="press animate-scale-in mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-gold py-4 text-lg font-bold text-primary-foreground shadow-glow">
          <Trophy className="h-5 w-5" /> Ver mis recompensas
        </button>
      )}
    </div>
  );
}

function MapNode({ c, i, status, onOpen }: { c: Challenge; i: number; status: NodeStatus; onOpen: () => void }) {
  const left = i % 2 === 0;
  const styles: Record<NodeStatus, string> = {
    locked: "bg-muted text-muted-foreground",
    available: "bg-gradient-primary text-primary-foreground animate-node-pulse",
    done: "bg-success text-primary-foreground",
    skipped: "bg-sea-soft text-sea",
  };
  const label: Record<NodeStatus, string> = {
    locked: "Bloqueado", available: "Disponible", done: "Completado", skipped: "Saltado",
  };
  const icon = status === "locked" ? <Lock className="h-6 w-6" /> : status === "done" ? <Check className="h-7 w-7" strokeWidth={3} />
    : status === "skipped" ? <SkipForward className="h-6 w-6" /> : <span className="font-display text-2xl font-bold">{c.step ?? "★"}</span>;
  return (
    <li className={`flex h-[100px] items-center gap-3 ${left ? "flex-row pl-[10%]" : "flex-row-reverse pr-[10%]"}`}>
      <button
        disabled={status === "locked"}
        onClick={onOpen}
        aria-label={c.name}
        className={`press grid h-16 w-16 shrink-0 place-items-center rounded-full border-4 border-card shadow-soft disabled:cursor-not-allowed ${styles[status]}`}
      >
        {icon}
      </button>
      <button disabled={status === "locked"} onClick={onOpen}
        className={`glass press min-w-0 max-w-[60%] rounded-xl px-3 py-2 ${left ? "text-left" : "text-right"} ${status === "locked" ? "opacity-60" : ""}`}>
        <img src={PLACE_IMG[c.id]} alt="" loading="lazy" width={1024} height={640} className={`mb-1.5 h-14 w-full rounded-lg object-cover ${status === "locked" ? "grayscale" : ""}`} />
        <span className="block text-sm font-bold leading-tight text-foreground">{c.name}</span>
        <span className={`text-xs font-semibold ${status === "available" ? "text-primary" : status === "done" ? "text-success" : status === "skipped" ? "text-sea" : "text-muted-foreground"}`}>
          {label[status]}
        </span>
      </button>
    </li>
  );
}

export function ChallengeModal({
  c, mode, onClose, onResolve,
}: {
  c: Challenge; mode: Mode; onClose: () => void;
  onResolve: (result: "done" | "skipped") => void;
}) {
  const [sel, setSel] = useState<number | null>(null);
  const [state, setState] = useState<"idle" | "checking" | "right" | "wrong">("idle");
  const [hint, setHint] = useState(mode === "familia");

  const check = () => {
    if (sel === null) return;
    setState("checking");
    setTimeout(() => setState(sel === c.answer ? "right" : "wrong"), 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/30 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className="animate-sheet-up max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-card px-5 pb-6 shadow-soft">
        <div className="relative -mx-5 mb-4 h-48 overflow-hidden">
          <img src={PLACE_IMG[c.id]} alt={c.name} width={1024} height={640} className="h-full w-full object-cover animate-scale-in" />
          <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-foreground/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
          <div className="absolute left-1/2 top-2.5 h-1.5 w-12 -translate-x-1/2 rounded-full bg-card/80" />
        </div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="rounded-full bg-gold-soft px-2.5 py-1 text-xs font-bold text-gold">{c.step ? `Paso ${c.step}` : "Minijuego"} · {c.kind}</span>
            <h3 className="mt-2 text-2xl font-semibold leading-tight text-foreground">{c.name}</h3>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="press grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {c.passage ? (
          <p className="mt-3 whitespace-pre-line rounded-2xl bg-terra-soft p-4 text-[15px] leading-relaxed text-secondary-foreground">{c.passage}</p>
        ) : (
          <>
            {c.directions && (
              <p className="mt-3 rounded-2xl bg-sea-soft p-4 text-sm leading-relaxed text-accent-foreground"><strong>Cómo llegar:</strong> {c.directions}</p>
            )}
            <p className="mt-3 rounded-2xl bg-terra-soft p-4 text-[15px] leading-relaxed text-secondary-foreground">{c.story}</p>
            <p className="mt-5 font-bold text-foreground">{c.question}</p>
          </>
        )}
        {c.kind === "Puzle" ? (
          <MosaicPuzzle size={3} onSolved={() => setState("right")} />
        ) : c.kind === "Memoria" ? (
          <MemoryGame onSolved={() => setState("right")} />
        ) : (
        <div className="mt-3 grid gap-2.5">
          {c.options.map((o, i) => {
            const isSel = sel === i;
            const reveal = state === "right" || state === "wrong";
            const cls = reveal && i === c.answer && state === "right" ? "border-success bg-success-soft"
              : reveal && isSel && state === "wrong" ? "border-destructive bg-terra-soft"
              : isSel ? "border-primary bg-terra-soft" : "border-border bg-card";
            return (
              <button key={o} disabled={state === "right"} onClick={() => { setSel(i); if (state === "wrong") setState("idle"); }}
                className={`press flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left font-semibold text-foreground ${cls}`}>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary text-sm">{String.fromCharCode(65 + i)}</span>
                {o}
              </button>
            );
          })}
        </div>
        )}

        {hint ? (
          <p className="mt-3 flex gap-2 rounded-xl bg-sea-soft p-3 text-sm text-accent-foreground"><Lightbulb className="h-4 w-4 shrink-0" /> {c.hint}</p>
        ) : (
          <button onClick={() => setHint(true)} className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-sea"><Lightbulb className="h-4 w-4" /> Ver pista</button>
        )}

        {state === "wrong" && <p className="animate-fade-in mt-3 text-sm font-semibold text-destructive">¡Casi! Prueba otra opción o salta la prueba.</p>}

        <div className="mt-5 grid gap-2.5">
          {state === "right" ? (
            <button onClick={() => onResolve("done")} className="press animate-scale-in flex items-center justify-center gap-2 rounded-2xl bg-success py-4 font-bold text-primary-foreground shadow-soft">
              <Check className="h-5 w-5" /> {c.kind === "Puzle" ? "¡Mosaico completo! Continuar" : c.kind === "Memoria" ? "¡Todas las parejas! Continuar" : "¡Correcto! Continuar"}
            </button>
          ) : (
            c.kind === "Puzle" || c.kind === "Memoria" ? null : <button onClick={check} disabled={sel === null || state === "checking"}
              className="press flex items-center justify-center gap-2 rounded-2xl bg-gradient-primary py-4 font-bold text-primary-foreground shadow-glow disabled:opacity-50">
              {state === "checking" ? <><Loader2 className="h-5 w-5 animate-spin" /> Comprobando…</> : "Comprobar respuesta"}
            </button>
          )}
          {state !== "right" && (
            <button onClick={() => onResolve("skipped")}
              className="press flex items-center justify-center gap-2 rounded-2xl border-2 border-sea bg-sea-soft py-3.5 font-bold text-sea">
              <SkipForward className="h-5 w-5" /> Saltar prueba / Pasar de fase
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function Summary({
  name, mode, score, statuses, duration, onRestart,
}: { name: string; mode: Mode; score: number; statuses: NodeStatus[]; duration: number | null; onRestart: () => void }) {
  const ok = statuses.filter((s) => s === "done").length;
  const skipped = statuses.filter((s) => s === "skipped").length;
  const date = new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
  return (
    <div className="animate-fade-in min-h-screen px-5 pb-10 pt-10">
      <div className="text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-gold text-primary-foreground shadow-glow animate-scale-in">
          <Trophy className="h-10 w-10" />
        </div>
        <h1 className="mt-4 text-3xl font-semibold text-foreground">¡Ave, {name}!</h1>
        <p className="text-muted-foreground">Has recorrido Augusta Emerita</p>
        {duration != null && (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-sea-soft px-3 py-1.5 text-sm font-bold text-sea">
            <Timer className="h-4 w-4" /> Tiempo total: {formatDuration(duration)}
          </p>
        )}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { v: ok, l: "Acertadas", c: "text-success" },
          { v: skipped, l: "Saltadas", c: "text-sea" },
          { v: score, l: "Puntos", c: "text-gold" },
        ].map((s) => (
          <div key={s.l} className="glass rounded-2xl p-3 text-center">
            <p className={`font-display text-3xl font-bold ${s.c}`}>{s.v}</p>
            <p className="text-xs font-semibold text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="relative mt-6 overflow-hidden rounded-3xl border-2 border-gold bg-card p-6 text-center shadow-soft">
        <Award className="mx-auto h-8 w-8 text-gold" />
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">Certificado de participación</p>
        <p className="mt-3 text-sm text-muted-foreground">Se otorga a</p>
        <p className="font-display text-3xl font-semibold italic text-primary">{name}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          por completar la yincana <strong className="text-foreground">Emerita Augusta</strong> en modo {MODES.find((m) => m.id === mode)?.label}.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">Mérida, {date}</p>
      </div>


      <div className="mt-5 rounded-3xl bg-terra-soft p-5">
        <p className="font-display text-xl font-semibold text-foreground">Conclusión final</p>
        <p className="mt-2 text-[15px] leading-relaxed text-secondary-foreground">{CONCLUSION}</p>
      </div>

      <ShareResult name={name} mode={mode} score={score} correct={ok} skipped={skipped} duration={duration} />

      <button onClick={onRestart} className="press mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card py-3.5 font-bold text-foreground">
        <RotateCcw className="h-5 w-5" /> Jugar de nuevo
      </button>
    </div>
  );
}
