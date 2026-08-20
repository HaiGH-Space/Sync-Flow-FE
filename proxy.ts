import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { isValidSessionToken } from '@/lib/cookies';

const PROTECTED_ROUTES = ['/dashboard', '/profile', '/settings', '/rooms'];
const AUTH_ROUTES = ['/auth'];

const i18nMiddleware = createMiddleware(routing);

function applySecurityHeaders(response: NextResponse): NextResponse {
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    return response;
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const rawToken = request.cookies.get('session_token')?.value;
    const isAuthenticated = isValidSessionToken(rawToken);

    const localeMatch = pathname.match(new RegExp(`^/(${routing.locales.join('|')})`));
    const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
    
    let pathnameWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), '');
    if (pathnameWithoutLocale === '') pathnameWithoutLocale = '/';
    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathnameWithoutLocale.startsWith(route));

    if (!isAuthenticated && isProtectedRoute) {
        const loginUrl = new URL(`/${locale}/auth`, request.url);

        loginUrl.searchParams.set('redirectTo', pathnameWithoutLocale);
        
        return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }

    const isAuthRoute = AUTH_ROUTES.some(route => pathnameWithoutLocale.startsWith(route));

    if (isAuthenticated && isAuthRoute) {
        return applySecurityHeaders(NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url)));
    }
    const response = i18nMiddleware(request);
    return applySecurityHeaders(response as NextResponse);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|apple-icon.png|sitemap.xml|robots.txt).*)']
}