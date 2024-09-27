import { Session } from "../src";

test("Session", () => {
  const data: Record<string, any> = {};
  const expectChangeSession = (fn: () => void) => {
    const before = data["___session"];
    fn();
    expect(data["___session"]).not.toBe(before);
  };
  const mockAstroCookies = {
    get: (key: string) => data[key],
    set: (key: string, value: string | Record<string, any>) => {
      data[key] = value;
    },
  } as any;
  const session = Session.from({ cookies: mockAstroCookies });

  expect(data["___session"]).toBeUndefined();

  expectChangeSession(() => {
    session.set("keyForString", "myValue");
    session["keyForNumber"] = 33;
  });
  expect(session.get("keyForString")).toBe("myValue");
  expect(session["keyForNumber"]).toBe(33);

  expectChangeSession(() => session.delete("keyForString"));
  expect(session["keyForString"]).toBeUndefined();
  expect(session["keyForNumber"]).toBe(33);

  expectChangeSession(() => session.clear());
  expect(session["keyForNumber"]).toBeUndefined();
});
