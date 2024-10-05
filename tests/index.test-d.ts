import { APIContext } from "astro";
import { createCookieSessionStorage, Nullable } from "../src";
import { Session } from "../src/session";

export type SessionData = {
  count: number;
  id: string | undefined;
};

test("createCookieSessionStorage", () => {
  const { getSession } = createCookieSessionStorage<SessionData>();
  const session = getSession({} as APIContext);

  expectTypeOf(session.count).toEqualTypeOf<number | undefined>();
  expectTypeOf(session.get("count")).toEqualTypeOf<number | undefined>();
  session.count = 1;
  session.count = undefined;
  session.set("count", 2);
  // @ts-expect-error
  session.count = "";
  // @ts-expect-error
  session.set("count", "");

  expectTypeOf(session.id).toEqualTypeOf<string | undefined>();
  expectTypeOf(session.get("id")).toEqualTypeOf<string | undefined>();
  session.id = "abc";
  session.id = undefined;
  session.set("id", "abc");
  session.set("id", undefined);
  // @ts-expect-error
  session.id = 1;
  // @ts-expect-error
  session.set("id", 1);

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
