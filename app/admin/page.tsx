"only sever"
import { auth } from '@clerk/nextjs/server'
import { scoresTable } from '../server/db/schema'
import { db } from '../server/db'
import { eq } from 'drizzle-orm'
import { getInternalUserId } from '../server/services/user'


const seedUser = async (clerkId: string) => {
  "use server"


  const seedData = [
    { wpm: 45, accuracy: 96, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)},
    { wpm: 48, accuracy: 97, timestamp: new Date (Date.now() - 1000 * 60 * 60 * 24 * 6 )}, 
    { wpm: 52, accuracy: 95, timestamp: new Date (Date.now() - 1000 * 60 * 60 * 24 * 5 )}, 
    { wpm: 49, accuracy: 98, timestamp: new Date (Date.now() - 1000 * 60 * 60 * 24 * 4 )}, 
    { wpm: 55, accuracy: 96, timestamp: new Date (Date.now() - 1000 * 60 * 60 * 24 * 3 )}, 
    { wpm: 53, accuracy: 97, timestamp: new Date (Date.now() - 1000 * 60 * 60 * 24 * 2 )}, 
    { wpm: 58, accuracy: 98, timestamp: new Date (Date.now() - 1000 * 60 * 60 * 24 * 1 )}, 
  ]

  const userId = await getInternalUserId(clerkId) 

  await db
    .insert(scoresTable)
    .values(seedData.map((seed) =>
      ({ ...seed, userId })
  ))
}

const clearScores = async (clerkId: string) => {
  "use server"
  const userId = await getInternalUserId(clerkId)

  await db
    .delete(scoresTable)
    .where(eq(scoresTable.userId, userId))
}


export default async function Admin() {
  const { userId, redirectToSignIn } = await auth()

  if (!userId) return redirectToSignIn()

  const seedCurrentUser = seedUser.bind(null, userId)
  const clearScoresForUser = clearScores.bind(null, userId)

  return (
    <>
      <div className='flex justify-center'>
        <div className=''>
          <h1>Admin </h1>
          <p>Admin page </p>
          <form action={seedCurrentUser}>
            <button className='button' type='submit'> Seed User with score data </button>
          </form>
          <form action={clearScoresForUser}>
            <button className='button' type='submit'> Logout </button>
          </form>
        </div>
      </div>
    </>
  )

}
