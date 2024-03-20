import { json, redirect } from "@remix-run/node";
import { Form, useNavigation } from "@remix-run/react";
import { database } from "~/database.server";
import { badRequest } from "~/http";
import type { ActionArguments, LoaderArguments, MetaResult } from "~/remix";
import { getSession } from "~/session.server";

export function meta(): MetaResult {
  return [{ title: "Sign up" }];
}

export default function SignUp() {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";

  return (
    <>
      <h1>Sign up</h1>
      <Form method="POST">
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" required autoComplete="name" />

        <label htmlFor="name">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          required
          autoComplete="email"
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Working..." : "Sign up"}
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
  const name = formData.get("name");
  const email = formData.get("email");

  if (!name || typeof name !== "string") {
    throw new Error("Field `name` is required");
  }

  if (!email || typeof email !== "string") {
    throw new Error("Field `name` is required");
  }

  let errors: { name?: string; email?: string } = {};

  if (name.length > 35) {
    errors.name = "Too long!";
  }

  if (email.length > 35) {
    errors.email = "Too long!";
  } else if ((await database.user.findUnique({ where: { email } })) !== null) {
    errors.email = "Already in use!";
  }

  // TODO: password field

  if (Object.entries(errors).length) {
    return badRequest({ values: { name, email }, errors });
  }

  const { id: userId } = await database.user.create({ data: { name, email } });

  await session.authenticate({ userId });
}
