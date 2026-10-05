import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { resultSchema } from "../src/lib/results-schema.ts";

test("validates results", () => {
  const base = {
    team_name: " Legion ",
    mode: "familia",
    score: 1100,
    correct: 11,
    skipped: 0,
    duration_seconds: 60,
    comment: null,
    rating: 5,
  };
  assert.equal(resultSchema.parse(base).team_name, "Legion");
  for (const change of [
    { team_name: " " },
    { mode: "unknown" },
    { score: 1101 },
    { correct: 12 },
    { skipped: 1 },
    { duration_seconds: -1 },
    { rating: 6 },
    { comment: "x".repeat(301) },
    { mode: "individual" },
  ])
    assert.equal(resultSchema.safeParse({ ...base, ...change }).success, false);
});

test("persists across processes, orders ranking and limits comments", () => {
  const directory = mkdtempSync(join(tmpdir(), "yincana-test-"));
  const env = { ...process.env, DATABASE_PATH: join(directory, "nested", "results.sqlite") };
  const url = new URL("../src/lib/results.server.ts", import.meta.url).href;
  const run = (code) => {
    const result = spawnSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        "import {insertResult,listRanking,listComments} from " + JSON.stringify(url) + ";" + code,
      ],
      { env, encoding: "utf8" },
    );
    assert.equal(result.status, 0, result.stderr);
    return JSON.parse(result.stdout);
  };
  try {
    run(
      "const base={mode:'individual',score:100,correct:1,skipped:0,duration_seconds:20,comment:null,rating:5}; for(let i=0;i<8;i++) insertResult({...base,team_name:'team'+i,comment:i===0?null:\"O'Brien\",duration_seconds:i===0?null:20-i}); insertResult({...base,team_name:'winner',score:900,correct:9}); console.log(JSON.stringify(true));",
    );
    const data = run(
      "console.log(JSON.stringify({ranking:listRanking(),comments:listComments()}));",
    );
    assert.equal(data.ranking.length, 5);
    assert.equal(data.ranking[0].team_name, "winner");
    assert.equal(data.ranking[1].team_name, "team7");
    assert.equal(data.comments.length, 6);
    assert.ok(data.comments.every((row) => row.comment === "O'Brien"));
    assert.equal(data.comments[0].team_name, "team7");
    assert.ok(data.ranking.every((row) => row.id && row.created_at));
    run(
      "try {insertResult({team_name:'bad',mode:'individual',score:-1,correct:0,skipped:0,duration_seconds:null,comment:null,rating:null});throw new Error('Expected constraint failure');}catch(e){if(!e.message.includes('CHECK constraint'))throw e;}console.log(JSON.stringify(true));",
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
