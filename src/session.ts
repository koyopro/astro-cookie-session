// @ts-ignore
import pkg from "jsonwebtoken";
const { sign, verify, JsonWebTokenError } = pkg;

import type { AstroCookies, AstroCookieSetOptions } from "astro";
import type { Options } from "./index.js";
import { getSecret } from "./secret.js";

export type Cookies = Omit<AstroCookies, 'merge'>;

export type DefaultFlash = {
  success: string;
  notice: string;
  alert: string;
  error: string;
}

export class Flash<T> {
  constructor(private session: Session<any>) {}

  set<K extends keyof T & string>(key: K, value: T[K]) {
    this.session.set(this.keyFor(key), value);
  }

  get<K extends keyof T & string>(key: K): T[K] | undefined {
    const value = this.session.get(this.keyFor(key));
    this.session.delete(this.keyFor(key));
    return value;
  }

  delete<K extends keyof T & string>(key: K) {
    this.session.delete(this.keyFor(key));
  }

  protected keyFor(key: string) {
    return `flash.${key}`;
  }
}

/**
 * The `Session` class manages session data using cookies and JSON Web Tokens (JWT).
 * It provides methods to get, set, and delete session data, as well as to restore
 * and save the session state.
 */
export class Session<T> {
  key = "astro.session";
  setOptions: AstroCookieSetOptions = {
    httpOnly: true,
    // @ts-ignore
    secure: import.meta.env.PROD,
  };
  protected data: Partial<T>;
  protected secret: string;
  flash = new Flash<DefaultFlash>(this);

  constructor(
    private cookies: Cookies,
    options: Options = {}
  ) {
    this.key = options.cookieName || this.key;
    Object.assign(this.setOptions, options.cookieSetOptions);
    this.secret = getSecret();
    this.data = {};
    const jwt = this.cookies.get(this.key)?.value;
    this.restore(jwt);
  }

  /**
   * Create a session object from AstroCookies.
   */
  static from<T>(cookies: Cookies, options: Options = {}) {
    return new Proxy(new Session<T>(cookies, options), {
      get(target, key, receiver) {
        if (["flash"].includes(key as string)) return Reflect.get(target, key, receiver);
        if (["has", "get", "set", "delete"].includes(key as string)) {
          return Reflect.get(target, key, receiver).bind(target);
        }
        return target.get(key as keyof T);
      },
      set(target, key, value) {
        target.set(key as keyof T, value);
        return true;
      },
    });
  }

  /**
   * Check if a key exists in the session data.
   */
  has<K extends keyof T>(key: K): boolean {
    return this.get(key) != undefined;
  }

  /**
   * Get a value from the session data.
   */
  get<K extends keyof T>(key: K): T[K] | undefined {
    return this.data[key];
  }

  /**
   * Set a value in the session data.
   */
  set<K extends keyof T>(key: K, value: T[K]) {
    this.data[key] = value;
    this.save();
  }

  /**
   * Delete a key from the session data. If no key is provided, all keys are deleted.
   */
  delete(key?: keyof T) {
    if (key) {
      delete this.data[key];
    } else {
      this.data = {};
    }
    this.save();
  }

  protected restore(jwt: string | undefined) {
    if (!jwt) return;
    try {
      const v = verify(jwt, this.secret, { algorithms: ["HS256"] });
      if (!v || typeof v !== "object") return;
      Object.assign(this.data as any, v);
    } catch (e: unknown) {
      if (e instanceof JsonWebTokenError) {
        // ignore
      } else {
        throw e;
      }
    }
  }

  protected save() {
    const jwt = sign(this.data, this.secret, { algorithm: "HS256" });
    this.cookies.set(this.key, jwt, this.setOptions);
  }
}
