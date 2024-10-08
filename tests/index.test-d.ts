import { AstroCookies } from "astro";
import { createCookieSessionStorage } from "../src";
import { Session } from "../src/session";

export type SessionData = {
  count: number;
  id: string | undefined;
};

test("createCookieSessionStorage", () => {
  const { getSession } = createCookieSessionStorage<SessionData>();
  const session = getSession({} as AstroCookies);

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
  const session = getSession({} as AstroCookies);

  expectTypeOf(session).toEqualTypeOf<
    Session<{ [key: string]: any }> & { [key: string]: any }
  >();

  session["foo"] = 1;
  expectTypeOf(session["foo"]).toEqualTypeOf<any>();
  session.set("foo", 2);
  expectTypeOf(session.get("foo")).toEqualTypeOf<any>();
});

test("flash", () => {
  const { getSession } = createCookieSessionStorage();
  const session = getSession({} as AstroCookies);
  expectTypeOf(session.flash.get("success")).toEqualTypeOf<string | undefined>();
  expectTypeOf(session.flash.get("notice")).toEqualTypeOf<string | undefined>();
  expectTypeOf(session.flash.get("alert")).toEqualTypeOf<string | undefined>();
  expectTypeOf(session.flash.get("error")).toEqualTypeOf<string | undefined>();
  // @ts-expect-error
  session.flash.set("notice", 1);
  // @ts-expect-error
  session.flash.get("foo")

  expectTypeOf(session.flash["success"]).toEqualTypeOf<string | undefined>();
  // @ts-expect-error
  session.flash["notice"] = 1;
  // @ts-expect-error
  session.flash["foo"]
});

test("flash with type", () => {
  type FlashData = {
    stringKey: string;
  };
  const { getSession } = createCookieSessionStorage<{}, FlashData>();
  const session = getSession({} as AstroCookies);
  expectTypeOf(session.flash.get("stringKey")).toEqualTypeOf<string | undefined>();
  // @ts-expect-error
  session.flash.set("stringKey", 1);
  // @ts-expect-error
  session.flash.get("foo")
})
