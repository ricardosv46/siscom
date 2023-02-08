import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

  const jwt = request.cookies.get("tokenApi");

  //if (!jwt) return NextResponse.redirect(new URL("/auth", request.url));

  try {
    //const { payload } = await jwtVerify( jwt, new TextEncoder().encode("secret") );
    return NextResponse.next();
  } catch (error) {
    console.log("GET JWTVerify ERROR: ", error);
    return NextResponse.redirect(new URL("/auth", request.url));
  }
}

export const config = {
  matcher: ["/", '/listadopas'],
};