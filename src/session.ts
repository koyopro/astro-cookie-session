import { DefaultFlash, Flash } from "./flash.js";
import type { Options } from "./index.js";
import { Cookies, CookieStorage } from "./storage.js";

export type Nullable<T> = {
  [P in keyof T]: T[P] | undefined;
};

/**
 * The `Session` class manages session data using cookies and JSON Web Tokens (JWT).
 * It provides methods to get, set, and delete session data, as well as to restore
 * and save the session state.
 */
export class Session<T, F = DefaultFlash> {
  flash: ReturnType<typeof Flash.from<F>>;

  protected storage: CookieStorage;

  constructor(cookies: Cookies, options: Options = {}) {
    this.storage = new CookieStorage(cookies, options);
    this.flash = Flash.from<F>(this.storage);
  }

  /**
   * Create a session object from AstroCookies.
   */
  static from<T, F>(
    cookies: Cookies,
    options: Options = {}
  ): Session<T, F> & Nullable<T> {
    return new Proxy(new Session<T, F>(cookies, options), {
      get(target, key, receiver) {
        if (["flash"].includes(key as string))
          return Reflect.get(target, key, receiver);
        if (["has", "get", "set", "delete"].includes(key as string)) {
          return Reflect.get(target, key, receiver).bind(target);
        }
        return target.get(key as keyof T);
      },
      set(target, key, value) {
        target.set(key as keyof T, value);
        return true;
      },
    }) as any;
  }

  /**
   * Check if a key exists in the session data.
   */
  has<K extends keyof T>(key: K): boolean {
    return this.storage.has(key);
  }

  /**
   * Get a value from the session data.
   */
  get<K extends keyof T>(key: K): T[K] | undefined {
    return this.storage.get(key);
  }

  /**
   * Set a value in the session data.
   */
  set<K extends keyof T>(key: K, value: T[K]) {
    this.storage.set(key, value);
  }

  /**
   * Delete a key from the session data. If no key is provided, all keys are deleted.
   */
  delete(key?: keyof T) {
    this.storage.delete(key);
  }
}
