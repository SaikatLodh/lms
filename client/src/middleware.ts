import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { middlewareShape } from "./types";
import { ur } from "zod/v4/locales";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const url = request.nextUrl;

  let payloadObject: middlewareShape | null = null;

  if (token) {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid token format");
      }
      const decodedPayload = atob(parts[1]);
      payloadObject = JSON.parse(decodedPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (
    !token &&
    (url.pathname.startsWith("/user/progress") ||
      url.pathname.startsWith("/user/profile") ||
      url.pathname.startsWith("/user/cart") ||
      url.pathname.startsWith("/user/wishlist") ||
      url.pathname.startsWith("/user/order") ||
      url.pathname.startsWith("/user/contact") ||
      url.pathname.startsWith("/instructor"))
  ) {
    return NextResponse.redirect(new URL("/user/home", request.url));
  }

  if (
    token &&
    (payloadObject?.role === "user" ||
      payloadObject?.role === "instructor" ||
      payloadObject?.role === "admin") &&
    (url.pathname === "/" ||
      url.pathname === "/log-in" ||
      url.pathname === "/register" ||
      url.pathname === "/send-email" ||
      url.pathname === "/otp" ||
      url.pathname === "/forgot-password-send-mail" ||
      url.pathname.startsWith("/forgot-reset-password"))
  ) {
    return NextResponse.redirect(new URL("/user/home", request.url));
  }

  if (
    token &&
    payloadObject?.role === "user" &&
    url.pathname.startsWith("/instructor")
  ) {
    return NextResponse.redirect(new URL("/user/home", request.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/log-in",
    "/send-mail",
    "/otp",
    "/register",
    "/forgot-password-send-mail",
    "/forgot-reset-password/:token",
    "/user/:path*",
    "/instructor/:path*",
  ],
};
