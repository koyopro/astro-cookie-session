import { APIContext } from "astro";
import { createCookieSessionStorage } from "../src";
import { Session } from "../src/session";

export type SessionData = {
  count: number;
  id?: string;
};

test("createCookieSessionStorage", () => {
  const { getSession } = createCookieSessionStorage<SessionData>();
  const session = getSession({} as APIContext);

  expectTypeOf(session).toEqualTypeOf<Session<SessionData> & SessionData>();

  session.count = 1;
  expectTypeOf(session.count).toEqualTypeOf<number>();
  session.set("count", 2);
  expectTypeOf(session.get("count")).toEqualTypeOf<number | undefined>();
  // @ts-expect-error
  session.count = "";
  // @ts-expect-error
  session.set("count", "");

  // @ts-expect-error
  session.get("foo");
  // @ts-expect-error
  session.set("foo", 2);
  // @ts-expect-error
  session.foo;
  // @ts-expect-error
  session.foo = 2;
});

test("any type", () => {
  const { getSession } = createCookieSessionStorage({});
  const session = getSession({} as APIContext);

  expectTypeOf(session).toEqualTypeOf<
    Session<{ [key: string]: any }> & { [key: string]: any }
  >();

  session["foo"] = 1;
  expectTypeOf(session["foo"]).toEqualTypeOf<any>();
  session.set("foo", 2);
  expectTypeOf(session.get("foo")).toEqualTypeOf<any>();
});
