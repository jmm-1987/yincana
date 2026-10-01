import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CHALLENGES, MODES, type Mode, type NodeStatus } from "@/lib/quest-data";
import { ChallengeModal, Onboarding, RouteMap, Summary } from "@/components/quest/Screens";
import { Confetti } from "@/components/quest/Confetti";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Emerita Quest: La Yincana de Mérida" },
      { name: "description", content: "Yincana para turistas por los monumentos romanos de Mérida: retos, puntos y recompensas." },
      { property: "og:title", content: "Emerita Quest: La Yincana de Mérida" },
      { property: "og:description", content: "Descubre Augusta Emerita a tu ritmo con 5 retos y un premio final." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const initial = (): NodeStatus[] => CHALLENGES.map((_, i) => (i === 0 ? "available" : "locked"));

function Index() {
  const [screen, setScreen] = useState<"intro" | "map" | "summary">("intro");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<Mode>("explorador");
  const [statuses, setStatuses] = useState<NodeStatus[]>(initial);
  const [score, setScore] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [confetti, setConfetti] = useState(0);

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
        <Onboarding onStart={(n, m) => { setName(n); setMode(m); setStatuses(initial()); setScore(0); setScreen("map"); }} />
      )}
      {screen === "map" && (
        <RouteMap name={name} score={score} statuses={statuses} onOpen={setOpen}
          onFinish={() => { setScreen("summary"); burst(); }} />
      )}
      {screen === "summary" && (
        <Summary name={name} mode={mode} score={score} statuses={statuses} onRestart={() => setScreen("intro")} />
      )}
      {open !== null && (
        <ChallengeModal key={open} c={CHALLENGES[open]!} mode={mode} onClose={() => setOpen(null)} onResolve={(r) => resolve(open, r)} />
      )}
    </main>
  );
}
