"only server"

import { SUPPORTED_LANGUAGES_TYPE } from "lib/common/types";
import { db } from "../db"
import { scoresTable } from "../db/schema"

type createScoreType = typeof scoresTable.$inferInsert & {
    assigmentText: string
    typedText: string
    mistakesCounts: string
    mistakesPercentage: string
    language: SUPPORTED_LANGUAGES_TYPE
};


export async function recordScore(score: createScoreType) {
    await db
        .insert(scoresTable)
        .values(score)

}
