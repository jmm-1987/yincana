import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import type { NewResult, QuestResult } from "./results-schema";

let database: DatabaseSync | undefined;

function getDatabase() {
  if (database) return database;
  const path = resolve(process.env["DATABASE_PATH"] || "data/yincana.sqlite");
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(`
    PRAGMA busy_timeout = 5000;
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS quest_results (
      id TEXT PRIMARY KEY,
      team_name TEXT NOT NULL CHECK(length(team_name) BETWEEN 1 AND 40),
      mode TEXT NOT NULL CHECK(mode IN ('individual', 'familia', 'explorador', 'arqueologo')),
      score INTEGER NOT NULL CHECK(score BETWEEN 0 AND 1100),
      correct INTEGER NOT NULL CHECK(correct BETWEEN 0 AND 11),
      skipped INTEGER NOT NULL CHECK(skipped BETWEEN 0 AND 11),
      duration_seconds INTEGER CHECK(duration_seconds IS NULL OR duration_seconds >= 0),
      comment TEXT CHECK(comment IS NULL OR length(comment) <= 300),
      rating INTEGER CHECK(rating IS NULL OR rating BETWEEN 1 AND 5),
      created_at TEXT NOT NULL,
      CHECK(correct + skipped <= 11)
    ) STRICT;
    CREATE INDEX IF NOT EXISTS quest_results_ranking_idx
      ON quest_results(score DESC, duration_seconds ASC, created_at ASC);
    CREATE INDEX IF NOT EXISTS quest_results_comments_idx
      ON quest_results(created_at DESC) WHERE comment IS NOT NULL;
  `);
  database = db;
  return db;
}

export function listRanking(): QuestResult[] {
  return getDatabase()
    .prepare(
      `SELECT * FROM quest_results
    ORDER BY score DESC, duration_seconds IS NULL ASC,
    duration_seconds ASC, created_at ASC, id ASC LIMIT 5`,
    )
    .all() as QuestResult[];
}

export function listComments(): QuestResult[] {
  return getDatabase()
    .prepare(
      `SELECT * FROM quest_results
    WHERE comment IS NOT NULL ORDER BY created_at DESC, rowid DESC LIMIT 6`,
    )
    .all() as QuestResult[];
}

export function insertResult(data: NewResult) {
  const id = randomUUID();
  getDatabase()
    .prepare(
      `INSERT INTO quest_results
    (id, team_name, mode, score, correct, skipped, duration_seconds, comment, rating, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      data.team_name,
      data.mode,
      data.score,
      data.correct,
      data.skipped,
      data.duration_seconds,
      data.comment || null,
      data.rating,
      new Date().toISOString(),
    );
  return { id };
}
