import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Crown, MessageCircle, Send, Star, Trophy, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MODES, type Mode } from "@/lib/quest-data";

const modeLabel = (m: string) =>
  m === "explorador" || m === "arqueologo" ? "Individual"
  : MODES.find((x) => x.id === m)?.label ?? m;

function useRanking() {
  return useQuery({
    queryKey: ["quest-ranking"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quest_results")
        .select("id, team_name, mode, score, correct")
        .order("score", { ascending: false })
        .order("created_at", { ascending: true })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });
}

function useComments() {
  return useQuery({
    queryKey: ["quest-comments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quest_results")
        .select("id, team_name, mode, comment, rating, created_at")
        .not("comment", "is", null)
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });
}

export function CommunityBoard() {
  const ranking = useRanking();
  const comments = useComments();
  const medal = ["bg-gradient-gold text-primary-foreground", "bg-secondary text-foreground", "bg-terra-soft text-primary"];

  return (
    <section className="mt-10 grid gap-6">
      <div className="glass rounded-3xl p-5">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
          <Trophy className="h-5 w-5 text-gold" /> Ranking de legiones
        </h2>
        <ol className="mt-4 grid gap-2">
          {ranking.isLoading && <li className="text-sm text-muted-foreground">Cargando…</li>}
          {ranking.data?.length === 0 && <li className="text-sm text-muted-foreground">Aún no hay equipos. ¡Sé el primero!</li>}
          {ranking.data?.map((r, i) => (
            <li key={r.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-card px-3 py-2.5">
              <span className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${medal[i] ?? "bg-muted text-muted-foreground"}`}>
                {i === 0 ? <Crown className="h-4 w-4" /> : i + 1}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-bold text-foreground">{r.team_name}</span>
                <span className="block text-xs text-muted-foreground">{modeLabel(r.mode)} · {r.correct}/5 aciertos</span>
              </span>
              <span className="font-display text-lg font-bold text-gold">{r.score}</span>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
          <MessageCircle className="h-5 w-5 text-sea" /> Lo que dicen los viajeros
        </h2>
        <div className="mt-3 grid gap-3">
          {comments.data?.length === 0 && <p className="text-sm text-muted-foreground">Todavía no hay comentarios.</p>}
          {comments.data?.map((c) => (
            <figure key={c.id} className="glass animate-fade-in rounded-2xl p-4">
              {c.rating && (
                <div className="mb-1.5 flex gap-0.5 text-gold">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < (c.rating ?? 0) ? "fill-current" : "opacity-30"}`} />
                  ))}
                </div>
              )}
              <blockquote className="text-[15px] leading-relaxed text-foreground">“{c.comment}”</blockquote>
              <figcaption className="mt-2 text-xs font-semibold text-muted-foreground">
                — {c.team_name} · {modeLabel(c.mode)}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ShareResult(props: { name: string; mode: Mode; score: number; correct: number; skipped: number }) {
  const qc = useQueryClient();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const m = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("quest_results").insert({
        team_name: props.name.slice(0, 40),
        mode: props.mode,
        score: props.score,
        correct: props.correct,
        skipped: props.skipped,
        comment: comment.trim() ? comment.trim().slice(0, 300) : null,
        rating,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quest-ranking"] });
      qc.invalidateQueries({ queryKey: ["quest-comments"] });
    },
  });

  if (m.isSuccess)
    return (
      <div className="animate-scale-in mt-6 flex items-center gap-3 rounded-3xl bg-success-soft p-5 text-success">
        <CheckCircle2 className="h-7 w-7 shrink-0" />
        <p className="font-bold">¡Gracias! Tu resultado y tu comentario ya aparecen en la portada.</p>
      </div>
    );

  return (
    <div className="glass mt-6 rounded-3xl p-5">
      <h2 className="text-xl font-semibold text-foreground">¿Qué te ha parecido?</h2>
      <p className="text-sm text-muted-foreground">Deja tu opinión y entra en el ranking.</p>
      <div className="mt-3 flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <button key={i} onClick={() => setRating(i + 1)} aria-label={`${i + 1} estrellas`} className="press p-1 text-gold">
            <Star className={`h-7 w-7 ${i < rating ? "fill-current" : "opacity-30"}`} />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={300}
        rows={3}
        placeholder="Cuéntanos tu experiencia por Mérida…"
        className="mt-3 w-full resize-none rounded-2xl border border-border bg-card px-4 py-3 text-base text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
      />
      <p className="text-right text-xs text-muted-foreground">{comment.length}/300</p>
      {m.isError && <p className="mt-1 text-sm font-semibold text-destructive">No se pudo enviar. Inténtalo de nuevo.</p>}
      <button
        onClick={() => m.mutate()}
        disabled={m.isPending}
        className="press mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary py-4 font-bold text-primary-foreground shadow-glow disabled:opacity-60"
      >
        <Send className="h-5 w-5" /> {m.isPending ? "Enviando…" : "Publicar en el ranking"}
      </button>
    </div>
  );
}
