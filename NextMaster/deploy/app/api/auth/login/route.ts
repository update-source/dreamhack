import { NextResponse } from 'next/server'
import { TOTP, Secret } from 'otpauth'
import { prisma } from '@/lib/prisma'
import { encrypt } from '@/lib/session'
import validator from 'validator'

export async function POST(req: Request) {
  try {
    const { email, totp } = await req.json()

    if (!validator.isEmail(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 },
      )
    }

    const user = await prisma.user.findFirst({ where: { email } })
    if (!user)
      return NextResponse.json({ message: 'User not exists' }, { status: 404 })

    const totpVerifier = new TOTP({
      secret: Secret.fromBase32(user.totpSecret),
      algorithm: 'SHA1',
      digits: 10,
      period: 30,
    })

    const delta = totpVerifier.validate({ token: totp, window: 1 })
    if (delta !== 0)
      return NextResponse.json({ message: 'Invalid TOTP' }, { status: 401 })

    const token = await encrypt({ id: user.id, role: user.role })

    const response = NextResponse.json({ success: true }, { status: 200 })
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
    })

    return response
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    )
  }
}
