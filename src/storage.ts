// @ts-ignore
import pkg from "jsonwebtoken";
const { sign, verify, JsonWebTokenError } = pkg;

import type { AstroCookies, AstroCookieSetOptions } from "astro";
import type { Options } from "./index.js";
import { getSecret } from "./secret.js";

export type Cookies = Omit<AstroCookies, "merge">;

export class CookieStorage {
  key = "astro.session";
  setOptions: AstroCookieSetOptions = {
    httpOnly: true,
    // @ts-ignore
    secure: import.meta.env.PROD,
  };
  protected data: Record<PropertyKey, any> = {};
  protected secret: string;

  constructor(private cookies: Cookies, options: Options = {}) {
    this.key = options.cookieName || this.key;
    Object.assign(this.setOptions, options.cookieSetOptions);
    this.secret = getSecret();
    this.data = {};
    const jwt = this.cookies.get(this.key)?.value;
    this.restore(jwt);
  }

  has(key: PropertyKey) {
    return this.get(key) != undefined;
  }

  get(key: PropertyKey) {
    return this.data[key];
  }

  set(key: PropertyKey, value: any) {
    this.data[key] = value;
    this.save();
  }

  delete(key?: PropertyKey) {
    if (key) {
      delete this.data[key];
    } else {
      this.data = {};
    }
    this.save();
  }

  restore(jwt: string | undefined) {
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

  save() {
    const jwt = sign(this.data, this.secret, { algorithm: "HS256" });
    this.cookies.set(this.key, jwt, this.setOptions);
  }
}
