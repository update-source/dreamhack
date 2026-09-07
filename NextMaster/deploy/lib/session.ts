import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { SessionPayload } from '@/lib/types'

const secretKey = process.env.JWT_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(encodedKey)
}

export async function decrypt(token: string) {
  try {
    const { payload } = await jwtVerify<SessionPayload>(token, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch {
    return null
  }
}
