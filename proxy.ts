import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { LOCALE_COOKIE, stripLocalePrefix } from "@/lib/i18n/config";

const COOKIE = "jd_session";

const PUBLIC_CABINET = ["/cabinet/login", "/cabinet/register", "/cabinet/reset"];

async function isAuthed(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token) return false;
  const secret = process.env.JWT_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const { locale: pathLocale, rest } = stripLocalePrefix(pathname);
  const effectiveLocale = pathLocale ?? "ru";

  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value;
  const needsCookieUpdate = cookieLocale !== effectiveLocale;

  const internalPath = rest;

  if (PUBLIC_CABINET.some((p) => internalPath === p || internalPath.startsWith(p + "/"))) {
    if (await isAuthed(req)) {
      const redirectTo = pathLocale === "ge" ? "/ge/cabinet/profile" : "/cabinet/profile";
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }
  }

  const isProtected =
    internalPath === "/cabinet" ||
    internalPath.startsWith("/cabinet/") ||
    internalPath === "/admin" ||
    internalPath.startsWith("/admin/");

  const isPublicCabinet = PUBLIC_CABINET.some((p) => internalPath === p || internalPath.startsWith(p + "/"));

  if (isProtected && !isPublicCabinet) {
    if (!(await isAuthed(req))) {
      const loginPath = pathLocale === "ge" ? "/ge/cabinet/login" : "/cabinet/login";
      const url = new URL(loginPath, req.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-locale", effectiveLocale);

  let response: NextResponse;
  if (pathLocale === "ge") {
    const newUrl = req.nextUrl.clone();
    newUrl.pathname = internalPath;
    response = NextResponse.rewrite(newUrl, { request: { headers: requestHeaders } });
  } else {
    response = NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (needsCookieUpdate) {
    response.cookies.set({
      name: LOCALE_COOKIE,
      value: effectiveLocale,
      path: "/",
      sameSite: "lax",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|logo.svg|.*\\..*).*)",
  ],
};
