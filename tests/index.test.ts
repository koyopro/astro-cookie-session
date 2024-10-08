import { AstroCookieSetOptions } from "astro";
import { createCookieSessionStorage } from "../src";

let data: Record<string, any> = {};
let setOptions: AstroCookieSetOptions | undefined;
const mockAstroCookies = {
  get: (key: string) => ({ value: data[key] }),
  set: (key: string, value: string | Record<string, any>, options?: AstroCookieSetOptions) => {
    data[key] = value;
    setOptions = options;
  },
} as any;

type SessionData = {
  keyForString?: string;
  keyForNumber?: number;
};

beforeEach(() => (data = {}, setOptions = undefined));

test("Session", () => {
  expect(data["astro.session"]).toBeUndefined();

  const { getSession } = createCookieSessionStorage<SessionData>();
  const session = getSession(mockAstroCookies);

  expect(session.has("keyForNumber")).toBe(false);
  expect(session.has("keyForString")).toBe(false);

  expectSessionChange(() => {
    session.set("keyForString", "myValue");
    session["keyForNumber"] = 33;
  });
  expect(session.get("keyForString")).toBe("myValue");
  expect(session["keyForNumber"]).toBe(33);

  expect(session.has("keyForNumber")).toBe(true);
  expect(session.has("keyForString")).toBe(true);

  expectSessionChange(() => session.delete("keyForString"));
  expect(session["keyForString"]).toBeUndefined();
  expect(session["keyForNumber"]).toBe(33);

  expectSessionChange(() => session.delete());
  expect(session["keyForNumber"]).toBeUndefined();
});

test("restore Session", () => {
  expect(data["astro.session"]).toBeUndefined();


  const { getSession } = createCookieSessionStorage<SessionData>();
  const session1 = getSession(mockAstroCookies);
  session1.set("keyForString", "myValue");
  session1["keyForNumber"] = 33;

  const session2 = getSession(mockAstroCookies);
  expect(session2.get("keyForString")).toBe("myValue");
  expect(session2["keyForNumber"]).toBe(33);
});

const expectSessionChange = (fn: () => void) => {
  const before = data["astro.session"];
  fn();
  expect(data["astro.session"]).not.toBe(before);
};

test("secure", () => {
  const { getSession } = createCookieSessionStorage<SessionData>();
  const session = getSession(mockAstroCookies);
  session.set("keyForString", "myValue");

  expect(data["astro.session"]).not.toContain("keyForString");
  expect(data["astro.session"]).not.toContain("myValue");
})

test("cookieName option", () => {
  const { getSession } = createCookieSessionStorage<SessionData>({ cookieName: "myCookieName" });
  const session = getSession(mockAstroCookies);
  session.set("keyForString", "myValue");
  expect(data["astro.session"]).toBeUndefined();
  expect(data["myCookieName"]).not.toBeUndefined();
  expect(session["keyForString"]).toBe("myValue");
});

test("cookieSetOptions option", () => {
  const { getSession } = createCookieSessionStorage<SessionData>({ cookieSetOptions: { secure: true } });
  const session = getSession(mockAstroCookies);
  session.set("keyForString", "myValue");
  expect(setOptions).toEqual({ httpOnly: true, secure: true });
})

test("flash", () => {
  const { getSession } = createCookieSessionStorage<SessionData>();
  const session = getSession(mockAstroCookies);

  session.flash.set("notice", "myValue");
  expect(session.flash.get("notice")).toBe("myValue");
  expect(session.flash.get("notice")).toBe("myValue"); // cached value

  session.flash.set("error", "myValue");
  session.flash.delete("error");
  expect(session.flash.get("error")).toBeUndefined();

  session.flash.set("alert", "myAlert");

  session.flash["success"] = "mySuccess";

  const session2 = getSession(mockAstroCookies);
  expect(session2.flash.get("notice")).toBeUndefined();
  expect(session2.flash.get("error")).toBeUndefined();
  expect(session2.flash.get("alert")).toEqual("myAlert");
  expect(session2.flash["success"]).toBe("mySuccess");
});
