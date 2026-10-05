import { createServerFn } from "@tanstack/react-start";
import { resultSchema } from "./results-schema";

export const getRanking = createServerFn({ method: "GET" }).handler(async () => {
  const { listRanking } = await import("./results.server");
  return listRanking();
});

export const getComments = createServerFn({ method: "GET" }).handler(async () => {
  const { listComments } = await import("./results.server");
  return listComments();
});

export const saveResult = createServerFn({ method: "POST" })
  .validator((data: unknown) => resultSchema.parse(data))
  .handler(async ({ data }) => {
    const { insertResult } = await import("./results.server");
    return insertResult(data);
  });
