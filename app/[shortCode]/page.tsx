import { sql } from "@vercel/postgres";
import { redirect, notFound } from "next/navigation";

interface PageProps {
  params: { shortCode: string };
}

export default async function ShortUrlPage({ params }: PageProps) {
  try {
    const { rows } =
      await sql`SELECT long_url FROM urls WHERE short_code = ${params.shortCode};`;

    if (rows.length > 0) {
      redirect(rows[0].long_url);
    } else {
      notFound();
    }
  } finally {
  }

  return null; // Empty component since this will redirect
}
