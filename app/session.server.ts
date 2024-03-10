import { enforce } from "./enforce";
import { createCookie, createCookieSessionStorage } from "@remix-run/node";

const cookie = createCookie("discjockey.yourname.com", {
  httpOnly: true,
  secrets: [
    enforce(
      process.env["SESSION_SECRET"],
      "Missing required environment variable `SESSION_SECRET`",
    ),
  ],
  secure: process.env.NODE_ENV === "production",
});

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({ cookie });
