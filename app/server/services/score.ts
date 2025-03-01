"only server"

import { db } from "../db"
import { scoresTable } from "../db/schema"

type createScoreType = typeof scoresTable.$inferInsert;

export async function recordScore(score: createScoreType) {
    await db
    .insert(scoresTable)
    .values(score)
  
}
