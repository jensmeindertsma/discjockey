import { json, redirect } from "@remix-run/node";
import { Form, useNavigation } from "@remix-run/react";
import { database } from "~/database.server";
import { badRequest } from "~/http";
import type { ActionArguments, LoaderArguments, MetaResult } from "~/remix";
import { getSession } from "~/session.server";

export function meta(): MetaResult {
  return [{ title: "Sign in" }];
}

export default function SignIn() {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";

  return (
    <>
      <h1>Sign in</h1>
      <Form method="POST">
        <label htmlFor="name">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          required
          autoComplete="email"
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Working..." : "Sign in"}
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

  const formData = await request.formData();
  const email = formData.get("email");

  if (!email || typeof email !== "string") {
    throw new Error("Field `name` is required");
  }

  let errors: { email?: string } = {};

  // TODO: check if email account exists
  // IF so, validate password

  if (Object.entries(errors).length) {
    return badRequest({ values: { email }, errors });
  }

  //await session.authenticate({ userId });
}
