import { db } from "../db";
import { usersTable, UserType } from "../db/schema";



export const createUser = async (userInfo: Omit<UserType, 'id'>) => {
  const user = await db.
    insert(usersTable).
    values({...userInfo}).
    returning({ insertedId: usersTable.id });;

  console.log(`Created user with ID ${user[0].insertedId}`);

  return user;
}
