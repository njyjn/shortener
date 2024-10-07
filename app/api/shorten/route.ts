import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { verifyToken } from "@/utils/auth";

export const runtime = 'edge';

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  try {
    await verifyToken(authHeader);
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { longUrl, customCode } = (await req.json()) as {
    longUrl: string;
    customCode?: string;
  };
  try {
    let shortCode: string;
    let exists = true;

    // If customCode is provided, use it, otherwise generate a random one
    if (customCode) {
      const { rows } =
        await sql`SELECT 1 FROM urls WHERE short_code = ${customCode}`;
      exists = rows.length > 0;
      if (exists) {
        return NextResponse.json(
          {
            error:
              "Custom shortcode already exists. Please choose another one.",
          },
          { status: 400 },
        );
      }
      shortCode = customCode;
    } else {
      do {
        shortCode = generateShortCode(6);
        const { rows } =
          await sql`SELECT 1 FROM urls WHERE short_code = ${shortCode};`;
        exists = rows.length > 0;
      } while (exists);
    }

    // Insert new URL with unique shortCode
    await sql`INSERT INTO urls (long_url, short_code) VALUES (${longUrl}, ${shortCode});`;

    return NextResponse.json({
      shortUrl: `${process.env.BASE_URL}/${shortCode}`,
    });
  } finally {
  }
}

function generateShortCode(length: number = 6): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
