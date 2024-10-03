import type { AstroCookies, AstroCookieSetOptions } from "astro";
// @ts-ignore
import pkg from "jsonwebtoken";
const { sign, verify, JsonWebTokenError } = pkg;

type Context = {
  cookies: AstroCookies;
};

type Options = {
  cookieName?: string;
  cookieSetOptions?: AstroCookieSetOptions;
};

export class Session {
  key = "___session";
  setOptions: AstroCookieSetOptions = {
    httpOnly: true,
    // @ts-ignore
    secure: import.meta.env.PROD
  };
  data: Record<string, any> = {};
  [key: string]: any;

  constructor(private context: Context, options: Options = {}) {
    this.key = options.cookieName || this.key;
    Object.assign(this.setOptions, options.cookieSetOptions);
    this.secret = this.getSecret();
    const jwt = this.context.cookies.get(this.key)?.value;
    this.restore(jwt);
  }

  static from(context: Context, options: Options = {}) {
    return new Proxy(new Session(context, options), {
      get(target, key, receiver) {
        if (["get", "set", "delete", "clear"].includes(key as string)) {
          return Reflect.get(target, key, receiver).bind(target);
        }
        return target.get(key as string);
      },
      set(target, key, value) {
        target.set(key as string, value);
        return true;
      },
    });
  }

  protected getSecret() {
    const secretKeyBase = process.env.SECRET_KEY_BASE;
    if (secretKeyBase) {
      return secretKeyBase;
    }
    const message = "Please set SECRET_KEY_BASE as an environment variable. [astro-cookie-session]";
    switch (process.env.NODE_ENV || "") {
      case "test":
        return "test-secret-key-base";
      case "development":
        console.warn(`Warning: ${message}`);
        return "development-secret-key-base";
      default:
        throw new Error(message);
    }
  }

  set(key: string, value: any) {
    this.data[key] = value;
    this.save();
  }

  get(key: string) {
    return this.data[key];
  }

  delete(key: string) {
    delete this.data[key];
    this.save();
  }

  clear() {
    this.data = {};
    this.save();
  }

  protected restore(jwt: string | undefined) {
    if (!jwt) return;
    try {
      const v = verify(jwt, this.secret, { algorithms: ["HS256"] });
      if (!v || typeof v !== "object") return;
      this.data = v;
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
