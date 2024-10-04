import type { AstroCookies, AstroCookieSetOptions } from "astro";
import { Session } from "./session";

export { Session } from "./session";

export type Context = {
  cookies: AstroCookies;
};

export type Options = {
  cookieName?: string;
  cookieSetOptions?: AstroCookieSetOptions;
};

type Dict = { [key: string]: any };

export function createCookieSessionStorage<T extends Dict>(
  init: {},
  options?: Options
): {
  getSession: (context: Context) => Session<T> & T;
};
export function createCookieSessionStorage<T extends Record<string, any>>(
  init: T,
  options?: Options
): {
  getSession: (context: Context) => Session<T> & T;
};
export function createCookieSessionStorage(
  init: Record<string, any>,
  options?: Options
) {
  return {
    getSession: (context: Context) => Session.from(context, init, options),
  };
}
