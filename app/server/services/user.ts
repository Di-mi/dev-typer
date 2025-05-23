import { eq } from "drizzle-orm";
import { db } from "../db";
import { usersTable, UserType } from "../db/schema";

export const getInternalUserId = async (clerkId: string): Promise<UserType['id']> => {
  const internallUserId = await db
    .select({ id: usersTable.id})   
    .from(usersTable)
    .where(eq(usersTable.clerkId, clerkId))
    .limit(1)

  const userId = internallUserId[0].id
  return userId

}
export const getInternalUser = async (clerkId: string): Promise<UserType> => {
  const internallUser = await db
    .select()   
    .from(usersTable)
    .where(eq(usersTable.clerkId, clerkId))
    .limit(1)

  return internallUser[0]

}

export const createUser = async (userInfo: Omit<UserType, 'id'|'admin'>) => {
  const user = await db.
    insert(usersTable).
    values({...userInfo}).
    returning({ insertedId: usersTable.id });;

  console.log(`Created user with ID ${user[0].insertedId}`);

  return user;
}
