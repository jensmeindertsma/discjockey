import { enforce } from "./enforce";
import {
  createCookie,
  createCookieSessionStorage,
  redirect,
} from "@remix-run/node";

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

const sessionStorage = createCookieSessionStorage({ cookie });

type GuestSession = {
  isAuthenticated: false;
  authenticate(data: { userId: number }): Promise<never>;
};

type UserSession = {
  isAuthenticated: true;
  userId: number;
  end(): Promise<never>;
};

export async function getSession(
  request: Request,
): Promise<GuestSession | UserSession> {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );

  const userId = session.get("userId") as number | null;

  if (userId) {
    return {
      isAuthenticated: true,
      userId,
      async end() {
        throw redirect("/", {
          headers: {
            "Set-Cookie": await sessionStorage.destroySession(session),
          },
        });
      },
    };
  } else {
    return {
      isAuthenticated: false,
      async authenticate({ userId }) {
        session.set("userId", userId);
        throw redirect("/app", {
          headers: {
            "Set-Cookie": await sessionStorage.commitSession(session),
          },
        });
      },
    };
  }
}
