import { json, redirect } from "@remix-run/node";
import type { LoaderArguments, MetaResult } from "~/remix";
import { getSession } from "~/session.server";

export function meta(): MetaResult {
  return [
    {
      title: "Home",
    },
  ];
}

export default function Home() {
  return (
    <>
      <h1>Discjockey</h1>
      <p>You should sign up or sign in!</p>
    </>
  );
}

export async function loader({ request }: LoaderArguments) {
  const session = await getSession(request);

  if (session.isAuthenticated) {
    return redirect("/app");
  }

  return json(null);
}
