import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || "").split(",");

export function middleware(req: NextRequest) {
  const origin = req.headers.get("origin");

  const response = NextResponse.next();

  if (req.method === "OPTIONS") {
    // Handle preflight requests for all origins, even if disallowed
    response.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type",
    );
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }
    return new NextResponse(null, { status: 204 });
  }

  // Check if the request origin is allowed
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type",
    );
  } else if (origin) {
    // Return forbidden if origin is not allowed
    return new NextResponse(null, { status: 403 });
  }

  return response;
}

// Tell Next.js to apply this middleware to the API routes only
export const config = {
  matcher: "/api/:path*", // Apply middleware only for API routes
};
