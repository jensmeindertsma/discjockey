import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { database } from "~/database.server";
import { badRequest } from "~/http";
import { createUser } from "~/models/user.server";
import type { ActionArguments, LoaderArguments, MetaResult } from "~/remix";
import { getSession } from "~/session.server";

export function meta(): MetaResult {
  return [{ title: "Sign up" }];
}

export default function SignUp() {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";

  const feedback = useActionData<typeof action>();

  return (
    <>
      <h1>Sign up</h1>
      <Form method="POST">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          required
          autoComplete="name"
          defaultValue={feedback?.values.name}
        />
        {feedback?.issues.name ? (
          <p>
            <strong style={{ color: "red" }}>{feedback.issues.name}</strong>
          </p>
        ) : null}

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
          autoComplete="new-password"
          defaultValue={feedback?.values.password}
        />
        {feedback?.issues.password ? (
          <p>
            <strong style={{ color: "red" }}>{feedback.issues.password}</strong>
          </p>
        ) : null}

        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          type="password"
          name="confirm-password"
          id="confirm-password"
          required
          autoComplete="new-password"
          defaultValue={feedback?.values.password}
        />
        {feedback?.issues.confirmPassword ? (
          <p>
            <strong style={{ color: "red" }}>
              {feedback.issues.confirmPassword}
            </strong>
          </p>
        ) : null}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Working..." : "Sign up"}
        </button>
      </Form>
      <p>
        Or <Link to="/signin">sign in</Link>
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
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirm-password");

  if (!name || typeof name !== "string") {
    throw new Error("Field `name` is required");
  }

  if (!email || typeof email !== "string") {
    throw new Error("Field `email` is required");
  }

  if (!password || typeof password !== "string") {
    throw new Error("Field `password` is required");
  }

  if (!confirmPassword || typeof confirmPassword !== "string") {
    throw new Error("Field `confirmPassword` is required");
  }

  let issues: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  } = {};

  if (name.length > 35) {
    issues.name = "Too long!";
  }

  if (email.length > 35) {
    issues.email = "Too long!";
  } else if ((await database.user.findUnique({ where: { email } })) !== null) {
    issues.email = "Already in use!";
  }

  if (password.length > 35) {
    issues.password = "Too long!";
  } else if (password !== confirmPassword) {
    issues.confirmPassword = "This password doesn't match the password above!";
  }

  if (Object.entries(issues).length) {
    return badRequest({
      values: { name, email, password, confirmPassword },
      issues,
    });
  }

  const userId = await createUser({ name, email, password });
  await session.authenticate({ userId });
}
