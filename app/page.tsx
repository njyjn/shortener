import { redirect } from "next/navigation";

export default function HomePage() {
  redirect(process.env.DEFAULT_URL || "https://nswuco.com");
  return null; // Return null since the page is redirecting
}
