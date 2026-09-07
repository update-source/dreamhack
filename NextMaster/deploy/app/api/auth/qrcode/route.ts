import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code') || ''
  const blob = await QRCode.toBuffer(code, { type: 'png' })

  return new NextResponse(blob, { status: 200 })
}
