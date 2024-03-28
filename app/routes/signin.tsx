import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import crypto from "~/crypto.server";
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

  const feedback = useActionData<typeof action>();

  return (
    <>
      <h1>Sign in</h1>
      <Form method="POST">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          required
          autoComplete="email"
          defaultValue={feedback?.values.email}
        />
        {feedback?.issues.email ? (
          <p>
            <strong style={{ color: "red" }}>{feedback.issues.email}</strong>
          </p>
        ) : null}

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          required
          autoComplete="current-password"
          defaultValue={feedback?.values.password}
        />
        {feedback?.issues.password ? (
          <p>
            <strong style={{ color: "red" }}>{feedback.issues.password}</strong>
          </p>
        ) : null}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Working..." : "Sign in"}
        </button>
      </Form>
      <p>
        Or <Link to="/signup">sign up</Link>
      </p>
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
  const password = formData.get("password");

  if (!email || typeof email !== "string") {
    throw new Error("Field `name` is required");
  }

  if (!password || typeof password !== "string") {
    throw new Error("Field `name` is required");
  }

  const values = { email, password };
  const issues: { email?: string; password?: string } = {};

  // TODO: check if email account exists
  // IF so, validate password
  const existingUser = await database.user.findUnique({
    where: { email },
    include: { password: true },
  });

  if (!existingUser) {
    issues.email = "No user for this email!";
    return badRequest({ values, issues });
  } else {
    if (!existingUser.password) {
      throw new Error("User doesn't have password!");
    }
    const passwordIsValid = await crypto.compare(
      password,
      existingUser.password.hash,
    );

    if (!passwordIsValid) {
      issues.password = "Wrong password!";
      return badRequest({ values, issues });
    } else {
      const userId = existingUser.id;

      await session.authenticate({ userId });
    }
  }
}
