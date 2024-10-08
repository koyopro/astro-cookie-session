import { Nullable } from "./session";
import { CookieStorage } from "./storage";
import { addDictInterface } from "./utils";

export type DefaultFlash = {
  success: string;
  notice: string;
  alert: string;
  error: string;
};

export class Flash<T> {
  protected cache: Partial<T> = {};

  constructor(private storage: CookieStorage) {}

  static from<T>(storage: CookieStorage): Flash<T> & Nullable<T> {
    return addDictInterface(new this<T>(storage), [
      "cache",
      "storage",
      "has",
      "set",
      "get",
      "delete",
    ]);
  }

  has<K extends keyof T & string>(key: K): boolean {
    return key in this.cache || this.storage.has(keyFor(key));
  }

  set<K extends keyof T & string>(key: K, value: T[K]) {
    delete this.cache[key];
    this.storage.set(keyFor(key), value);
  }

  get<K extends keyof T & string>(key: K): T[K] | undefined {
    if (key in this.cache) return this.cache[key];
    this.cache[key] = this.storage.get(keyFor(key));
    this.storage.delete(keyFor(key));
    return this.cache[key];
  }

  delete<K extends keyof T & string>(key: K) {
    delete this.cache[key];
    this.storage.delete(keyFor(key));
  }
}

const keyFor = (key: string) => `flash.${key}`;
