// src/pages/signin.ts
import type { APIRoute } from "astro";
import { getSession } from "../sessions";

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = getSession(cookies); // Prepare the session

  const body = await request.json();
  session.set('userId', body.id); // Set the session data

  const userId = session.get("userId"); // Get the session data

  return new Response(JSON.stringify({ userId }), {
    headers: { "content-type": "application/json" },
  });
}
