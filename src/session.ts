import type { AstroCookieSetOptions } from "astro";
import { Context, Options } from ".";
// @ts-ignore
import pkg from "jsonwebtoken";
import { getSecret } from "./secret";
const { sign, verify, JsonWebTokenError } = pkg;


export class Session<T> {
  key = "astro.session";
  setOptions: AstroCookieSetOptions = {
    httpOnly: true,
    // @ts-ignore
    secure: import.meta.env.PROD,
  };
  protected data: T;
  protected secret: string;

  constructor(
    private context: Context,
    protected init: T,
    options: Options = {}
  ) {
    this.key = options.cookieName || this.key;
    Object.assign(this.setOptions, options.cookieSetOptions);
    this.secret = getSecret();
    this.data = Object.assign({}, init);
    const jwt = this.context.cookies.get(this.key)?.value;
    this.restore(jwt);
  }

  static from<T>(context: Context, init: T, options: Options = {}) {
    return new Proxy(new Session<T>(context, init, options), {
      get(target, key, receiver) {
        if (["has", "get", "set", "reset"].includes(key as string)) {
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

  has<K extends keyof T>(key: K): boolean {
    return this.get(key) != undefined;
  }

  get<K extends keyof T>(key: K): T[K] {
    return this.data[key];
  }

  set<K extends keyof T>(key: K, value: T[K]) {
    this.data[key] = value;
    this.save();
  }

  reset(key?: keyof T) {
    if (key) {
      this.data[key] = this.init[key];
    } else {
      this.data = Object.assign({}, this.init);
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
    this.context.cookies.set(this.key, jwt, this.setOptions);
  }
}
