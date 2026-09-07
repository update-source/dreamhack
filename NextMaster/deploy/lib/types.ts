import { JWTPayload } from 'jose'
import { User as PrismaUser, Api as PrismaApi } from '@prisma/client'

export type User = PrismaUser
export type Api = PrismaApi

export interface SessionPayload extends JWTPayload {
  id: number
  role: 'user' | 'admin'
}
