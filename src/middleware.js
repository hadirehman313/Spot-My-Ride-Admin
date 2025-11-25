import { NextResponse } from "next/server";

export function middleware(req) {
  const uid = req.cookies.get("uid")?.value;
  const email = req.cookies.get("email")?.value;
 
  const { pathname } = req.nextUrl;

  const publicPaths = ["/login"];
  const isPublicPath = publicPaths.includes(pathname);

  if (!uid && !isPublicPath) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (uid && email && pathname === "/login") {
    const dashboardUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|assets).*)"],
};