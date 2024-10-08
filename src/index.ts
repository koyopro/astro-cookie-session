import type { AstroCookieSetOptions } from "astro";
import { DefaultFlash, Flash } from "./flash.js";
import { Session } from "./session.js";
import { Cookies, CookieStorage } from "./storage.js";

export { CookieStorage, Flash, Session };

export type Options = {
  /**
   * The name of the cookie to be stored in the browser. Defalut is "astro.session".
   */
  cookieName?: string;
  /**
   * Cookie setting options.
   */
  cookieSetOptions?: AstroCookieSetOptions;
};

type Dict = { [key: string]: any };

/**
 * Creates a cookie session storage.
 *
 * @example Standard usage. Specify the type of the session.
 * ```ts
 * type SessionData = {
 *   userId: string;
 * };
 *
 * export const { getSession } = createCookieSessionStorage<SessionData>();
 *
 * const session = getSession(astroCookies);
 * ```
 *
 * @example If no type is specified, any key can be handled with values of any type.
 * ```ts
 * export const { getSession } = createCookieSessionStorage();
 * ```
 *
 * @example Specifying options. The following options are the default values.
 * ```ts
 * export const { getSession } = createCookieSessionStorage({
 *   cookieName: "astro.session",
 *   cookieSetOptions: {
 *     httpOnly: true,
 *     secure: import.meta.env.PROD,
 *     path: undefined,
 *     expires: undefined,
 *     maxAge: undefined,
 *   }
 * });
 * ```
 */
export function createCookieSessionStorage<
  T extends Record<string, any> = Dict,
  F extends Record<string, any> = DefaultFlash
>(options?: Options) {
  return {
    /**
     * Prepare a session object from AstroCookies.
     *
     * @example Using in Astro pages.
     * ```ts
     * const session = getSession(Astro.cookies);
     * ```
     *
     * @example Using in Astro API routes.
     * ```ts
     * export const POST: APIRoute = async ({ cookies }) => {
     *   const session = getSession(cookies);
     *   // ...
     * };
     * ```
     */
    getSession: (cookies: Cookies) =>
      Session.from<T, F>(new CookieStorage(cookies, options)),
  };
}
