import { findUser, getUser } from "./models/user.server";
import type { LoaderArguments, MetaArguments, MetaResult } from "./remix";
import { getSession } from "./session.server";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
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
        <p>Discjockey</p>
        {data.user ? <p>{data.user.name}</p>}
      </header>
      <Outlet />
    </>
  );
}

export async function loader({ request }: LoaderArguments) {
  const session = await getSession(request);

  if (session.isAuthenticated) {
    return json({ user: await findUser(session.userId, { include: {name: true} }) });
  }
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
