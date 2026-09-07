'use client'

import { useEffect, useState } from 'react'
import { doRequest, doHealth } from './actions'
import { Api } from '@/lib/types'
import { randomBytes } from 'crypto'

declare const BUILD_ID: string

export interface ApiQuery {
  id?: number
  host?: string
}

export interface ApiHealth extends Api {
  health: string
}

export default function Dashboard() {
  const [apis, setApis] = useState<ApiHealth[]>([])

  useEffect(() => {
    fetch('/api/manage?query={}')
      .then((res) => res.json())
      .then((data) => {
        setApis(data.api)
      })
  }, [])

  async function getApis(formData: FormData) {
    const query: ApiQuery = {}
    const host = formData.get('host')
    if (host) {
      query['host'] = host.toString()
    }
    const apis = await fetch(`/api/manage?query=${JSON.stringify(query)}`, {
      method: 'GET',
    })
    setApis((await apis.json()).api)
  }

  async function addApi(formData: FormData) {
    const host = formData.get('host')
    const key = randomBytes(16).toString('hex')
    const api = await fetch(`/api/manage`, {
      method: 'POST',
      body: JSON.stringify({ host, key }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    setApis([...apis, (await api.json()).api])
  }

  async function getHealth(id: number) {
    const doFunc = (id: number) =>
      !process.env.NODE_ENV.match(/development/)
        ? doRequest('key', id, 'health')
        : doHealth(id)

    setApis(
      await Promise.all(
        apis.map(async (api) => {
          if (api.id === id) {
            api.health = await doFunc(id)
          }
          return api
        }),
      ),
    )
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="flex flex-col gap-4 w-full max-w-lg">
          <div className="p-4 bg-white/[.15] rounded-lg">
            <h2 className="text-lg font-semibold mb-4">API Management</h2>
            <form
              action={getApis}
              className="flex flex-row gap-4 items-center flex-wrap"
            >
              <input
                type="text"
                name="host"
                placeholder="Search host"
                className="p-2 border rounded bg-black/[.15] dark:bg-white/[.15] flex-[2] min-w-[100px]"
              />
              <button
                type="submit"
                className="h-10 rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm px-4 flex-1 min-w-[100px]"
              >
                Search Host
              </button>
            </form>

            <form
              action={addApi}
              className="flex flex-row gap-4 items-center flex-wrap mt-2"
            >
              <input
                type="text"
                name="host"
                placeholder="Host"
                className="p-2 border rounded bg-black/[.15] dark:bg-white/[.15] flex-[2] min-w-[100px]"
              />
              <button
                type="submit"
                className="h-10 rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm px-4 flex-1 min-w-[100px]"
              >
                Add Api
              </button>
            </form>
            <div className="mt-4 p-4 bg-black/[.15] dark:bg-white/[.15] rounded overflow-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">Host</th>
                    <th className="text-left p-2">Health</th>
                  </tr>
                </thead>
                <tbody>
                  {apis &&
                    apis.map((api) => (
                      <tr key={api.id} className="border-b border-gray-700">
                        <td className="p-2">{api.id}</td>
                        <td className="p-2">{api.host}</td>
                        <td className="p-2">
                          {!api.health && (
                            <button onClick={() => getHealth(api.id)}>
                              check
                            </button>
                          )}
                          {api.health}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <p className="text-xs font-mono">Build ID: {BUILD_ID}</p>
      </main>
    </div>
  )
}
