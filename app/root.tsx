import { getUser } from "./models/user.server";
import type { LoaderArguments, MetaArguments, MetaResult } from "./remix";
import { getSession } from "./session.server";
import { json } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import type { ReactNode } from "react";

import "./root.css";

export function meta({ error }: MetaArguments): MetaResult {
  return [
    {
      title: error ? "Error!" : "Discjockey",
    },
  ];
}

export function links() {
  return [{ rel: "icon", type: "image/png", href: "/discjockey.png" }];
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <header>
        <p>
          <Link to="/">Discjockey</Link>
        </p>
        <p>
          {data.user
            ? `Logged in as "${data.user.name}`
            : "Not logged in (Guest)"}
        </p>
        <nav>
          {data.user ? (
            <ul>
              <li>
                <Form method="POST" action="/signout">
                  <button type="submit">Sign out</button>
                </Form>
              </li>
            </ul>
          ) : (
            <ul>
              <li>
                <Link to="/signup">Sign up</Link>
              </li>
              <li>
                <Link to="/signin">Sign in</Link>
              </li>
            </ul>
          )}
        </nav>
      </header>
      <Outlet />
    </>
  );
}

export async function loader({ request }: LoaderArguments) {
  const session = await getSession(request);

  return json({
    user: session.isAuthenticated
      ? { name: (await getUser(session.userId))?.name }
      : null,
  });
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </>
    );
  }

  return (
    <>
      <h1>Error!</h1>
      <p>{error instanceof Error ? error.message : "Unknown error"}</p>
    </>
  );
}
