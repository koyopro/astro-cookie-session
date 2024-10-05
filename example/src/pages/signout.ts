// src/pages/signout.ts
import type { APIRoute } from "astro";
import { getSession } from "../sessions";

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const session = getSession(cookies); // Prepare the session

  session.delete('userId'); // Remove the user ID from the session

  return redirect('/');;
}
