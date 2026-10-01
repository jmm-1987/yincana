CREATE TABLE public.quest_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name text NOT NULL CHECK (char_length(team_name) BETWEEN 1 AND 40),
  mode text NOT NULL CHECK (mode IN ('explorador','arqueologo','familia')),
  score integer NOT NULL CHECK (score BETWEEN 0 AND 750),
  correct integer NOT NULL CHECK (correct BETWEEN 0 AND 5),
  skipped integer NOT NULL CHECK (skipped BETWEEN 0 AND 5),
  comment text CHECK (comment IS NULL OR char_length(comment) <= 300),
  rating integer CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.quest_results TO anon, authenticated;
GRANT ALL ON public.quest_results TO service_role;
ALTER TABLE public.quest_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read results" ON public.quest_results FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can submit a result" ON public.quest_results FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE INDEX quest_results_score_idx ON public.quest_results (score DESC);