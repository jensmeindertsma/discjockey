import { redirect } from "@remix-run/node";
import type { ActionArguments } from "~/remix";
import { getSession } from "~/session.server";

export function loader() {
  return redirect("/");
}

export async function action({ request }: ActionArguments) {
  const session = await getSession(request);

  if (!session.isAuthenticated) {
    return redirect("/");
  } else {
    await session.end();
  }
}
