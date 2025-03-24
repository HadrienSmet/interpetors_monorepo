import { NextRequest, NextResponse } from "next/server";

import { languages, defaultLang } from "@/i18n/settings";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const hasLocale = languages.some((lang) => pathname.startsWith(`/${lang}`));

    if (!hasLocale) {
        const url = new URL(`/${defaultLang}${pathname}`, req.nextUrl.origin);
        return (NextResponse.redirect(url));
    }

    return (NextResponse.next());
}

export const config = {
    matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
