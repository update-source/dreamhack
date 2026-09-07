import { NextResponse } from 'next/server'
import { TOTP } from 'otpauth'
import { prisma } from '@/lib/prisma'
import validator from 'validator'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!validator.isEmail(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 },
      )
    }

    const existingUser = await prisma.user.findFirst({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 403 },
      )
    }

    const totp = new TOTP({
      issuer: 'next-master',
      label: email,
      algorithm: 'SHA1',
      digits: 10,
      period: 30,
    })

    const totpSecret = totp.secret.base32

    await prisma.user.create({
      data: {
        email,
        totpSecret,
        role: 'user',
      },
    })

    const otpAuthURL =
      'http://localhost:3000/api/auth/qrcode?code=' +
      encodeURIComponent(totp.toString())
    return NextResponse.json({ otpAuthURL, totpSecret }, { status: 201 })
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    )
  }
}
