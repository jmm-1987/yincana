import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { getRoute, MODES, type Mode, type NodeStatus } from "@/lib/quest-data";
import { ChallengeModal, Onboarding, RouteMap, Summary } from "@/components/quest/Screens";
import { Confetti } from "@/components/quest/Confetti";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Emerita Augusta: La Yincana de Mérida" },
      { name: "description", content: "Yincana para turistas por los monumentos romanos de Mérida: retos, puntos y recompensas." },
      { property: "og:title", content: "Emerita Augusta: La Yincana de Mérida" },
      { property: "og:description", content: "Descubre Augusta Emerita a tu ritmo ayudando a Julia a recuperar sus recuerdos en 9 paradas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const initial = (m: Mode = "individual"): NodeStatus[] => getRoute(m).map((_, i) => (i === 0 ? "available" : "locked"));

function Index() {
  const [screen, setScreen] = useState<"intro" | "map" | "summary">("intro");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<Mode>("individual");
  const [statuses, setStatuses] = useState<NodeStatus[]>(initial);
  const [score, setScore] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [confetti, setConfetti] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  const route = getRoute(mode);
  const burst = () => setConfetti((n) => n + 1);

  const resolve = (i: number, r: "done" | "skipped") => {
    setStatuses((s) => s.map((v, j) => (j === i ? r : j === i + 1 && v === "locked" ? "available" : v)));
    if (r === "done") {
      setScore((s) => s + Math.round(100 * (MODES.find((m) => m.id === mode)?.mult ?? 1)));
      burst();
    }
    setOpen(null);
  };

  return (
    <main className="mx-auto min-h-screen max-w-md">
      {confetti > 0 && <Confetti key={confetti} />}
      {screen === "intro" && (
        <Onboarding onStart={(n, m) => { setName(n); setMode(m); setStatuses(initial(m)); setScore(0); setStartedAt(Date.now()); setDuration(null); setScreen("map"); }} />
      )}
      {screen === "map" && (
        <RouteMap route={route} name={name} score={score} statuses={statuses} onOpen={setOpen}
          onFinish={() => { setDuration(startedAt ? Math.max(1, Math.round((Date.now() - startedAt) / 1000)) : null); setScreen("summary"); burst(); }} />
      )}
      {screen === "summary" && (
        <Summary name={name} mode={mode} score={score} statuses={statuses} duration={duration} onRestart={() => setScreen("intro")} />
      )}
      {open !== null && (
        <ChallengeModal key={open} c={route[open]!} mode={mode} onClose={() => setOpen(null)} onResolve={(r) => resolve(open, r)} />
      )}
    </main>
  );
}
