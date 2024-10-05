# Astro Cookie Session

When building server applications, you may need a session system to identify users making requests. Sessions are a fundamental component of many sites that allow users to "log in."

Astro Cookie Session is middleware for managing sessions in the Astro framework. This middleware uses cookies to manage sessions. Session data is stored in cookies and not on the server. Since session data is encrypted and stored in cookies, it is securely protected.

Additionally, with TypeScript, you can utilize a type-safe session system.

## Installation

```bash
npm install astro-cookie-session
```

## Configuration

### Setup Environment Variables

Prepare an encryption key and set it as the `SECRET_KEY_BASE` environment variable. You can generate the key by running `openssl rand -hex 64` in a local terminal.

```sh
# .env
SECRET_KEY_BASE=your_secret_key
```

### Enable Server-side Rendering (SSR) in Astro's config

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  'output': 'server',  // Enable SSR
});
```

## Getting Started

### Settings up a session storage

```typescript
// src/sessions.ts
import { createCookieSessionStorage } from "astro-cookie-session";

type SessionData = {
  userId: string;
};

// Create a session storage
export const { getSession } = createCookieSessionStorage<SessionData>();

// If you want to set options for the cookie, you can do so as follows:
// The following options are the default values.
/*
export const { getSession } = createCookieSessionStorage<SessionData>({
  cookieName: "astro.session",
  cookieSetOptions: {
    httpOnly: true,
    secure: import.meta.env.PROD,
    path: undefined,
    expires: undefined,
    maxAge: undefined,
  }
});
*/
```

### Using the session in your Astro pages

Use the `getSession()` function to prepare the session and the `session.set()` method to set the session data. The encrypted session data will be stored in a cookie, and you can retrieve it across requests using the `session.get()` method.

```typescript
// src/pages/index.astro
---
import { getSession } from "../sessions";

const session = getSession(Astro.cookies); // Prepare the session

if (Astro.request.method === "POST") {
  const form = await Astro.request.formData();
  session.set('userId', form.get("id") as string); // Set the session data
}

const userId = session.get("userId"); // Get the session data
---
{userId ? (
  <p>Hello, {userId}!</p>
) : (
  <form method="post">
    <label>User ID: <input type="text" name="id" /></label>
    <input type="submit" value="Log in" />
  </form>
)}
```

### Using the session in your Astro API routes

```typescript
// src/pages/api/signout.ts
import type { APIRoute } from "astro";
import { getSession } from "../../sessions";

export const POST: APIRoute = async ({ cookies }) => {
  const session = getSession(cookies); // Prepare the session

  session.delete('userId'); // Remove the user ID from the session

  return new Response();
}
```

## License

Copyright (c) 2024 koyopro

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

