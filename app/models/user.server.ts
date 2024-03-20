import type { User } from "@prisma/client";
import { database } from "~/database.server";

async function findUser(id: number): Promise<User | null> {
  return await database.user.findUnique({
    where: { id },
  });
}

export async function getUser(id: number): Promise<User> {
  const user = await findUser(id);

  if (!user) {
    throw new Error(`Failed to get user: no user found with user ID ${id}`);
  }

  return user;
}
