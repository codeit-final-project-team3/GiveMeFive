import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken');
  const { pathname } = request.nextUrl;
  const privateRoutes = ['/mypage'];
  const guestOnlyRoutes = ['/login', '/signup'];

  // 일반적인 접근이 아니라 url로 강제 접근이나 뒤로 가기 등으로
  // 일반 로직상 들어 올 수 없는 페이지에 진입한 경우을 위한 분기 처리
  if (privateRoutes.includes(pathname) && !accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (guestOnlyRoutes.includes(pathname) && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // 이 Middleware가 동작할 경로들
  matcher: ['/login', '/signup', '/mypage'],
};
