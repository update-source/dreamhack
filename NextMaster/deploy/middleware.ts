import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from './lib/session'
import { cookies } from 'next/headers'

export const config = {
  matcher: ['/dashboard'],
}

export async function middleware(req: NextRequest) {
  const token = (await cookies()).get('token')
  if (!token) {
    return NextResponse.redirect(
      new URL('/auth/login?msg=Please login first', req.url),
    )
  }

  const payload = await decrypt(token.value)
  if (!payload) {
    ;(await cookies()).delete('token')
    return NextResponse.redirect(
      new URL('/auth/login?msg=Invalid token', req.url),
    )
  }

  if (payload.role === 'admin') {
    return NextResponse.next()
  } else {
    return NextResponse.redirect(new URL('/auth/login?msg=Only admin', req.url))
  }
}
