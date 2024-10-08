import { CookieStorage } from "./storage.js";
import { addDictInterface, Nullable } from "./utils.js";

export type DefaultFlash = {
  success: string;
  notice: string;
  alert: string;
  error: string;
};

/**
 * The `Flash` class manages flash messages using cookies.
 * 
 * Flash messages are temporary messages that are displayed to the user
 * after an action has been performed. They are typically used to provide
 * feedback to the user, such as "Your changes have been saved" or "Invalid
 * email address".
 * 
 * Flash messages are stored in cookies and are deleted after they are read.
 */
export class Flash<T> {
  protected cache: Partial<T> = {};

  constructor(private storage: CookieStorage) {}

  /**
   * Create a `Flash` object from a `CookieStorage` object.
   */
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

  /**
   * Check if a key exists in the flash messages.
   */
  has<K extends keyof T & string>(key: K): boolean {
    return key in this.cache || this.storage.has(keyFor(key));
  }

  /** 
   * Set a flash message.
   */
  set<K extends keyof T & string>(key: K, value: T[K]) {
    delete this.cache[key];
    this.storage.set(keyFor(key), value);
  }

  /**
   * Get a flash message.
   * 
   * The flash message is deleted from the cookie after it is read.
   * The read value is temporarily cached. The cache is cleared when set or delete is called.
   */
  get<K extends keyof T & string>(key: K): T[K] | undefined {
    if (key in this.cache) return this.cache[key];
    this.cache[key] = this.storage.get(keyFor(key));
    this.storage.delete(keyFor(key));
    return this.cache[key];
  }

  /**
   * Delete a flash message.
   */
  delete<K extends keyof T & string>(key: K) {
    delete this.cache[key];
    this.storage.delete(keyFor(key));
  }
}

const keyFor = (key: string) => `flash.${key}`;
