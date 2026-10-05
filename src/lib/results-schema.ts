import { z } from "zod";

export const resultSchema = z
  .object({
    team_name: z.string().trim().min(1).max(40),
    mode: z.enum(["individual", "familia"]),
    score: z.number().int().min(0).max(1100),
    correct: z.number().int().min(0).max(11),
    skipped: z.number().int().min(0).max(11),
    duration_seconds: z.number().int().min(0).max(2147483647).nullable(),
    comment: z.string().trim().max(300).nullable(),
    rating: z.number().int().min(1).max(5).nullable(),
  })
  .refine((data) => data.correct + data.skipped <= (data.mode === "familia" ? 11 : 9), {
    message: "El total de pruebas supera la ruta seleccionada",
  });

export type NewResult = z.infer<typeof resultSchema>;
export type QuestResult = NewResult & { id: string; created_at: string };
