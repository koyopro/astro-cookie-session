export const getSecret = () => {
  const envVar = 'SECRET_KEY_BASE';
  const secretKeyBase = process.env?.[envVar] ?? (import.meta as any).env?.[envVar] ?? null;
  if (secretKeyBase) {
    return secretKeyBase;
  }
  const message = "Please set SECRET_KEY_BASE as an environment variable. [astro-cookie-session]";
  switch (process.env.NODE_ENV || "") {
    case "test":
      return "test-secret-key-base";
    case "development":
      console.warn(`Warning: ${message}`);
      return "development-secret-key-base";
    default:
      throw new Error(message);
  }
}
