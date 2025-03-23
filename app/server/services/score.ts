"only server"

import { db } from "../db"
import { scoresTable } from "../db/schema"

type createScoreType = typeof scoresTable.$inferInsert & {
    assigmentText: string
    typedText: string
    mistakesCounts: string
    mistakesPercentage: string
};


export async function recordScore(score: createScoreType) {
    await db
        .insert(scoresTable)
        .values(score)

}
