// @ts-ignore
import pkg from "jsonwebtoken";
const { sign, verify, JsonWebTokenError } = pkg;

import type { AstroCookies, AstroCookieSetOptions } from "astro";
import CryptoJS from "crypto-js";
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
      let payload = verify(jwt, this.secret, { algorithms: ["HS256"] });
      if (!payload) return;
      if (typeof payload === "string") {
        const encryptedData = CryptoJS.AES.decrypt(payload, this.secret);
        const jsonData = encryptedData.toString(CryptoJS.enc.Utf8);
        payload = JSON.parse(jsonData);
      }
      Object.assign(this.data as any, payload);
    } catch (e: unknown) {
      if (e instanceof JsonWebTokenError || e instanceof SyntaxError) {
        // Ignore invalid JWT or JSON parse errors
        return;
      }
      throw e;
    }
  }

  save() {
    // Create a JWT with a payload encrypted using AES-CBC
    // - PASETO or JWE (AES-GCM) libraries with synchronous APIs were not found
    // - AES-CBC alone does not provide tamper resistance, but it is protected by the JWT signature
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(this.data),
      this.secret
    ).toString();
    const jwt = sign(encryptedData, this.secret, { algorithm: "HS256" });
    this.cookies.set(this.key, jwt, this.setOptions);
  }
}
