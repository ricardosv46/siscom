import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { GetAuthService } from 'services/auth/ServiceAuth';
  
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
 
}

export const config = {
  matcher: ["/", '/listadopas', '/nuevoacceso', '/listadoacceso'],
};