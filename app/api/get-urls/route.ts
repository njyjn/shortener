import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { verifyToken } from "@/utils/auth";

export const runtime = 'edge';

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  try {
    await verifyToken(authHeader);
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { rows: urls } =
      await sql`SELECT long_url, short_code, created_at FROM urls`;

    return NextResponse.json({
      urls: urls.map((url) => {
        return {
          longUrl: url.long_url,
          shortCode: url.short_code,
          createdAt: url.created_at,
        };
      }),
    });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching URLs" }, { status: 500 });
  } finally {
  }
}
