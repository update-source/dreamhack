'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [otpAuthURL, setOtpAuthURL] = useState('')
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()
    if (res.ok) {
      setOtpAuthURL(data.otpAuthURL)
    } else {
      setError(data.message)
    }
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
          href="/auth/login"
          className="text-sm hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          Login →
        </Link>
      </nav>

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Sign Up</h1>

        <div className="flex flex-col gap-4 w-full max-w-lg">
          <div className="p-4 bg-white/[.05] rounded-lg">
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              {error && <p className="text-red-500">{error}</p>}
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border rounded bg-black/[.05] dark:bg-white/[.06]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              >
                Sign Up
              </button>
            </form>
          </div>

          {otpAuthURL && (
            <div className="p-4 bg-white/[.05] rounded-lg text-center">
              <h2 className="text-lg font-semibold mb-4">Scan QR Code</h2>
              <p className="text-sm mb-4 font-[family-name:var(--font-geist-mono)]">
                Scan this QR Code in your Authenticator app
              </p>
              <Image
                src={otpAuthURL}
                alt="QR Code"
                width={300}
                height={300}
                className="mx-auto"
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
