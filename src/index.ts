import type { AstroCookieSetOptions } from "astro";
import { Cookies, Session } from "./session.js";

export { Session } from "./session.js";

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

export type Nullable<T> = {
  [P in keyof T]: T[P] | undefined;
};

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
export function createCookieSessionStorage<T extends Record<string, any> = Dict>(
  options?: Options
) {
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
    getSession: (cookies: Cookies): Session<T> & Nullable<T> => Session.from(cookies, options) as any,
  };
}
