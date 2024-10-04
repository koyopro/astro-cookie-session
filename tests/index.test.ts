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

  const { getSession } = createCookieSessionStorage<SessionData>({});
  const session = getSession({ cookies: mockAstroCookies });

  expectSessionChange(() => {
    session.set("keyForString", "myValue");
    session["keyForNumber"] = 33;
  });
  expect(session.get("keyForString")).toBe("myValue");
  expect(session["keyForNumber"]).toBe(33);

  expectSessionChange(() => session.reset("keyForString"));
  expect(session["keyForString"]).toBeUndefined();
  expect(session["keyForNumber"]).toBe(33);

  expectSessionChange(() => session.reset());
  expect(session["keyForNumber"]).toBeUndefined();
});

test("Session with default", () => {
  const { getSession } = createCookieSessionStorage<SessionData>({ keyForNumber: 0, keyForString: "default" });
  const session = getSession({ cookies: mockAstroCookies });

  session.keyForNumber = 1;
  session.keyForString = "myValue";
  expect(session.keyForNumber).toBe(1);
  expect(session.keyForString).toBe("myValue");

  session.reset("keyForNumber");
  expect(session.keyForNumber).toBe(0);
  expect(session.keyForString).toBe("myValue");

  session.reset();
  expect(session.keyForNumber).toBe(0);
  expect(session.keyForString).toBe("default");
});

test("restore Session", () => {
  expect(data["astro.session"]).toBeUndefined();


  const { getSession } = createCookieSessionStorage<SessionData>({});
  const session1 = getSession({ cookies: mockAstroCookies });
  session1.set("keyForString", "myValue");
  session1["keyForNumber"] = 33;

  const session2 = getSession({ cookies: mockAstroCookies });
  expect(session2.get("keyForString")).toBe("myValue");
  expect(session2["keyForNumber"]).toBe(33);
});

const expectSessionChange = (fn: () => void) => {
  const before = data["astro.session"];
  fn();
  expect(data["astro.session"]).not.toBe(before);
};

test("secure", () => {
  const { getSession } = createCookieSessionStorage<SessionData>({});
  const session = getSession({ cookies: mockAstroCookies });
  session.set("keyForString", "myValue");

  expect(data["astro.session"]).not.toContain("keyForString");
  expect(data["astro.session"]).not.toContain("myValue");
})

test("cookieName option", () => {
  const { getSession } = createCookieSessionStorage<SessionData>({}, { cookieName: "myCookieName" });
  const session = getSession({ cookies: mockAstroCookies });
  session.set("keyForString", "myValue");
  expect(data["astro.session"]).toBeUndefined();
  expect(data["myCookieName"]).not.toBeUndefined();
  expect(session["keyForString"]).toBe("myValue");
});

test("cookieSetOptions option", () => {
  const { getSession } = createCookieSessionStorage<SessionData>({}, { cookieSetOptions: { secure: true } });
  const session = getSession({ cookies: mockAstroCookies });
  session.set("keyForString", "myValue");
  expect(setOptions).toEqual({ httpOnly: true, secure: true });
})
