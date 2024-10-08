// src/pages/signout.ts
import type { APIRoute } from "astro";
import { getSession } from "../sessions";

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const session = getSession(cookies); // Prepare the session

  session.delete("userId"); // Remove the user ID from the session

  session.flash.set("success", "You have successfully logged out."); // Set the flash message
  // session.flash["success"] = "You have successfully logged out."; // You can also use this code

  return redirect("/");
};
