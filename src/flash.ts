import { Session } from "./session";

export type DefaultFlash = {
  success: string;
  notice: string;
  alert: string;
  error: string;
};

export class Flash<T> {
  protected cache: Partial<T> = {};

  constructor(private session: Session<any, any>) {}

  static from<T>(session: Session<any, any>) {
    return new Proxy(new Flash<T>(session), {
      get(target, key, receiver) {
        if (
          ["cache", "session", "keyFor", "set", "get", "delete"].includes(
            key as string
          )
        ) {
          return Reflect.get(target, key, receiver);
        }
        return target.get(key as keyof T & string);
      },
      set(target, p, newValue, receiver) {
        target.set(p as keyof T & string, newValue);
        return true;
      },
    });
  }

  set<K extends keyof T & string>(key: K, value: T[K]) {
    delete this.cache[key];
    this.session.set(this.keyFor(key), value);
  }

  get<K extends keyof T & string>(key: K): T[K] | undefined {
    if (key in this.cache) return this.cache[key];
    this.cache[key] = this.session.get(this.keyFor(key));
    this.session.delete(this.keyFor(key));
    return this.cache[key];
  }

  delete<K extends keyof T & string>(key: K) {
    delete this.cache[key];
    this.session.delete(this.keyFor(key));
  }

  protected keyFor(key: string) {
    return `flash.${key}`;
  }
}
