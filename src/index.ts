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

export const createCookieSessionStorage = <T extends Record<string, any>>(init: T, options?: Options) => {
  return {
    getSession: (context: Context): Session<T> & T =>  {
      return Session.from(context, init, options) as any;
    }
  }
}


