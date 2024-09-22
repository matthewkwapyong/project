import { NextResponse } from "next/server";
const url = "http://localhost:3001"


function redirectTo(url, request) {
  return NextResponse.redirect(new URL(url, request.url));
}

export async function middleware(request) {
  let accessToken = request.cookies.get('accessToken')
  if (accessToken) {
    try {
      let response = await fetch(`${url}/token/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: accessToken.value })
      })

      let result = await response.json();
      if (!result.authenticated) {
        if (result.expired) {
          let refreshToken = request.cookies.get('refreshToken')
          if (refreshToken) {
            let res = await fetch(`${url}/token/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh: refreshToken.value })
            })
            let refreshResult = await res.json()
            const response = NextResponse.next()
            response.cookies.set("accessToken", refreshResult.accessToken, {
              path: "/",
              sameSite: "lax",
            })
            return response
          }
        }
        if (request.nextUrl.pathname !== '/login') {
          return redirectTo('/login', request.url);
        }
      } else {
        if (request.nextUrl.pathname !== '/home') {
          return redirectTo('/home', request);
        }
        return NextResponse.next();
      }
    } catch (error) {
      console.log(error)
      return Response.json(
        { success: false, message: 'Internal Server Error' },
        { status: 500 }
      )
    }
  } else {
    if (request.nextUrl.pathname !== '/login') {
      return redirectTo('/login', request);
    }
  }
}
export const config = {
  matcher: ["/home/:path*", "/login"],
};
