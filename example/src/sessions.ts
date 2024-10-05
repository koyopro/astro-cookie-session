// src/sessions.ts
import { createCookieSessionStorage } from "astro-cookie-session";

type SessionData = {
  userId: string;
};

// Create a session storage
export const { getSession } = createCookieSessionStorage<SessionData>();

// If you want to set options for the cookie, you can do so as follows:
// The following options are the default values.
/*
export const { getSession } = createCookieSessionStorage<SessionData>({
  cookieName: "astro.session",
  cookieSetOptions: {
    httpOnly: true,
    secure: import.meta.env.PROD,
    path: undefined,
    expires: undefined,
    maxAge: undefined,
  }
});
*/
