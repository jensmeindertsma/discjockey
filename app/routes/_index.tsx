import { json } from "@remix-run/node";
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
      <h1>Home</h1>
      <p>TODO: set up CRUD application</p>
    </>
  );
}

export async function loader({ request }: LoaderArguments) {
  await getSession(request, { redirectUser: "/app" });
  return json(null);
}
