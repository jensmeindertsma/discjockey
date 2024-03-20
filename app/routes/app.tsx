import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUser } from "~/models/user.server";
import type { LoaderArguments, MetaResult } from "~/remix";
import { getSession } from "~/session.server";

export function meta(): MetaResult {
  return [{ title: "Application" }];
}

export default function App() {
  const { email } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Application!</h1>
      <p>Email: {email}</p>
    </>
  );
}

export async function loader({ request }: LoaderArguments) {
  const session = await getSession(request);

  if (!session.isAuthenticated) {
    return redirect("/signin");
  }

  const { email } = await getUser(session.userId);

  return json({ email });
}
