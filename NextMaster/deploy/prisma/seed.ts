import { PrismaClient } from '@prisma/client'
import { TOTP } from 'otpauth'
import { randomBytes } from 'crypto'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@dreamhack.io'
  const totp = new TOTP({
    issuer: 'next-master',
    label: adminEmail,
    algorithm: 'SHA1',
    digits: 10,
    period: 30,
  })

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      totpSecret: totp.secret.base32,
      role: 'admin',
    },
  })

  const api = await prisma.api.upsert({
    where: { host: '127.0.0.1:3000' },
    update: {},
    create: {
      host: '127.0.0.1:3000',
      key: randomBytes(16).toString('hex'),
    },
  })
  console.log({ admin, api })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
