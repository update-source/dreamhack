'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginContent() {
  const searchParams = useSearchParams()
  const msg = searchParams.get('msg') || ''

  const [email, setEmail] = useState('')
  const [totp, setTotp] = useState('')
  const [error, setError] = useState(msg)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, totp }),
    })

    if (!res.ok) {
      setError('Invalid TOTP')
      return
    }

    window.location.href = '/dashboard'
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <nav className="w-full row-start-1 flex justify-between items-center max-w-lg">
        <Link
          href="/"
          className="text-sm hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          Home
        </Link>
        <Link
          href="/auth/register"
          className="text-sm hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          Register →
        </Link>
      </nav>

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Login</h1>

        <div className="flex flex-col gap-4 w-full max-w-lg">
          <div className="p-4 bg-white/[.05] rounded-lg">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              {error && <p className="text-red-500">{error}</p>}
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border rounded bg-black/[.05] dark:bg-white/[.06]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="text"
                placeholder="TOTP Code"
                className="w-full p-2 border rounded bg-black/[.05] dark:bg-white/[.06]"
                value={totp}
                onChange={(e) => setTotp(e.target.value)}
              />
              <button
                type="submit"
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
