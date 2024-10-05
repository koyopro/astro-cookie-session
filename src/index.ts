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
export type Nullable<T> = {
  [P in keyof T]: T[P] | undefined;
};

export function createCookieSessionStorage<T extends Record<string, any> = Dict>(
  options?: Options
) {
  return {
    getSession: (context: Context): Session<T> & Nullable<T> => Session.from(context, options) as any,
  };
}
