import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/database.server";
import type { MetaResult } from "~/remix";

export function meta(): MetaResult {
  return [
    {
      title: "Home",
    },
  ];
}

export default function Home() {
  const users = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Discjockey</h1>
      <p>There are {users} users.</p>
      <p>TODO: set up CRUD application</p>
    </>
  );
}

export async function loader() {
  const users = await prisma.user.count();

  return json(users);
}
