'use server'

import { exec } from 'child_process'
import { prisma } from '@/lib/prisma'
import { Readable } from 'stream'

async function readStream(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = ''
    stream.on('data', (chunk: Buffer | string) => {
      data += chunk.toString()
    })
    stream.on('end', () => resolve(data.trim()))
    stream.on('error', reject)
  })
}

export async function doHealth(id: number): Promise<string> {
  const api = await prisma.api.findFirst({ where: { id } })
  if (!api) return 'Invalid API'

  const { stdout } = await exec(`curl http://${api.host}/api/health`, {
    timeout: 1000,
  })

  if (stdout) return readStream(stdout)
  return 'Error'
}

export async function doRequest(
  key: string,
  id: number,
  path: string,
): Promise<string> {
  const api = await prisma.api.findFirst({ where: { id } })
  if (!api) return 'Invalid API'
  if (api?.key !== key) return 'Invalid API key'
  if (path.length > 10) return 'Path too long'
  if ([...'!@#$%^&*()-_=+[{]};:\'",<.>/?\\|'].some((c) => path.includes(c)))
    return 'Forbidden character'

  const { stdout } = await exec(`curl http://${api.host}/api/${path}`, {
    timeout: 1000,
  })

  if (stdout) return readStream(stdout)
  return 'Error'
}
