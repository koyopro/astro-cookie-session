import { AstroCookieSetOptions } from "astro";
import { Session } from "../src";

let data: Record<string, any> = {};
let setOptions: AstroCookieSetOptions | undefined;
const mockAstroCookies = {
  get: (key: string) => ({ value: data[key] }),
  set: (key: string, value: string | Record<string, any>, options?: AstroCookieSetOptions) => {
    data[key] = value;
    setOptions = options;
  },
} as any;

beforeEach(() => (data = {}, setOptions = undefined));

test("Session", () => {
  expect(data["astro.session"]).toBeUndefined();

  const session = Session.from({ cookies: mockAstroCookies });

  expectSessionChange(() => {
    session.set("keyForString", "myValue");
    session["keyForNumber"] = 33;
  });
  expect(session.get("keyForString")).toBe("myValue");
  expect(session["keyForNumber"]).toBe(33);

  expectSessionChange(() => session.delete("keyForString"));
  expect(session["keyForString"]).toBeUndefined();
  expect(session["keyForNumber"]).toBe(33);

  expectSessionChange(() => session.clear());
  expect(session["keyForNumber"]).toBeUndefined();
});

test("restore Session", () => {
  expect(data["astro.session"]).toBeUndefined();

  const session1 = Session.from({ cookies: mockAstroCookies });
  session1.set("keyForString", "myValue");
  session1["keyForNumber"] = 33;

  const session2 = Session.from({ cookies: mockAstroCookies });
  expect(session2.get("keyForString")).toBe("myValue");
  expect(session2["keyForNumber"]).toBe(33);
});

const expectSessionChange = (fn: () => void) => {
  const before = data["astro.session"];
  fn();
  expect(data["astro.session"]).not.toBe(before);
};

test("secure", () => {
  const session = Session.from({ cookies: mockAstroCookies });
  session.set("keyForString", "myValue");

  expect(data["astro.session"]).not.toContain("keyForString");
  expect(data["astro.session"]).not.toContain("myValue");
})

test("cookieName option", () => {
  const session = Session.from({ cookies: mockAstroCookies }, { cookieName: "myCookieName" });
  session.set("keyForString", "myValue");
  expect(data["astro.session"]).toBeUndefined();
  expect(data["myCookieName"]).not.toBeUndefined();
  expect(session["keyForString"]).toBe("myValue");
});

test("cookieSetOptions option", () => {
  const session = Session.from({ cookies: mockAstroCookies }, { cookieSetOptions: { secure: true } });
  session.set("keyForString", "myValue");
  expect(setOptions).toEqual({ httpOnly: true, secure: true });
})
