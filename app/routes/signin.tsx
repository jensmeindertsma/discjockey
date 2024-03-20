import { json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import type { ActionArguments, LoaderArguments, MetaResult } from "~/remix";
import { getSession } from "~/session.server";

export function meta(): MetaResult {
  return [{ title: "Sign in" }];
}

export default function SignIn() {
  return (
    <>
      <h1>Sign in</h1>
      <Form method="POST">
        <button type="submit" disabled>
          Sign in
        </button>
      </Form>
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

export async function action({ request }: ActionArguments) {
  const session = await getSession(request);

  if (session.isAuthenticated) {
    return redirect("/app");
  }

  // TODO

  // Parse form data

  // Check if user exists and password is valid

  // Authenticate user session

  return redirect("/app");
}
