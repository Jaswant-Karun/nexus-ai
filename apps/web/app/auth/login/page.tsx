import { redirect } from "next/navigation";

/** /auth/login is the legacy path — send everyone to the real /login */
export default function AuthLoginRedirect() {
  redirect("/login");
}
