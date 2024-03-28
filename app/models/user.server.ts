import type { User } from "@prisma/client";
import crypto from "~/crypto.server";
import { database } from "~/database.server";

export async function findUser(id: string): Promise<User | null> {
  return await database.user.findUnique({
    where: { id },
  });
}

export async function getUser(id: string): Promise<User> {
  const user = await findUser(id);

  if (!user) {
    throw new Error(`Failed to get user: no user found with user ID ${id}`);
  }

  return user;
}

export async function createUser({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  console.log(process.env);
  const hashedPassword = await crypto.hash(password, 10);
  const { id } = await database.user.create({
    data: {
      name,
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
    select: {
      id: true,
    },
  });

  return id;
}
