export const getSecret = () => {
  const secretKeyBase = process.env.SECRET_KEY_BASE;
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
