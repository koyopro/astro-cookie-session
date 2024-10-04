import { APIContext } from "astro";
import { createCookieSessionStorage, Session } from "../src";

export type SessionData = {
  count: number;
  id?: string;
};

test("createCookieSessionStorage", () => {
  const { getSession } = createCookieSessionStorage<SessionData>({ count: 0 });
  const session = getSession({} as APIContext);

  expectTypeOf(session).toEqualTypeOf<Session<SessionData> & SessionData>();

  session.count = 1;
  expectTypeOf(session.count).toEqualTypeOf<number>();
  session.set("count", 2);
  expectTypeOf(session.get("count")).toEqualTypeOf<number>();
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
