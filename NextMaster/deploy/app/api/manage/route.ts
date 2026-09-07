import { cookies, headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/session'

async function validate() {
  const cookie = await cookies()
  const payload = await decrypt(cookie.get('token')?.value || '')
  const clientIp = (await headers()).get('X-Forwarded-For') // This
  const isAdmin = payload && payload.role === 'admin'
  const isLocalhost = ['127.0.0.1', '::1', '::ffff:127.0.0.1'].some(
    (c) => c === clientIp,
  )

  return isAdmin || isLocalhost
}

export async function GET(req: NextRequest) {
  if (!(await validate()))
    return NextResponse.json(
      { error: 'Only admin or localhost is allowed' },
      { status: 403 },
    )

  const query = JSON.parse(req.nextUrl.searchParams.get('query') || '{}')

  const api = await prisma.api.findMany({
    where: query,
    select: { id: true, host: true },
    orderBy: { id: 'asc' },
  })
  if (api.length != 0) return NextResponse.json({ api }, { status: 200 })
  else return NextResponse.json({ error: 'No API found' }, { status: 404 })
}

export async function POST(req: NextRequest) {
  if (!(await validate()))
    return NextResponse.json(
      { error: 'Only admin or localhost is allowed' },
      { status: 403 },
    )

  const { host, key } = await req.json()

  const api = await prisma.api.create({
    data: {
      host,
      key,
    },
  })

  return NextResponse.json({ api }, { status: 200 })
}

export async function DELETE(req: NextRequest) {
  if (!(await validate()))
    return NextResponse.json(
      { error: 'Only admin or localhost is allowed' },
      { status: 403 },
    )

  const { id } = await req.json()

  await prisma.api.delete({
    where: {
      id,
    },
  })

  return NextResponse.json({ message: 'Success' }, { status: 200 })
}
