'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function sendMagicLink() {
    if (!email.trim()) return
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setSent(true)
    setLoading(false)
  }

  async function signInWithGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 font-sans"
      style={{ background: '#2C1F0E' }}
    >
      {/* Logo */}
      <div className="mb-8 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: '#C1440E' }}
        >
          <span className="text-3xl">✝</span>
        </div>
        <h1 className="font-serif text-3xl font-semibold" style={{ color: '#FAF3E8' }}>
          Adoro
        </h1>
        <p className="text-sm mt-1" style={{ color: '#7A6A55' }}>
          Pray daily. Build the habit.
        </p>
      </div>

      <div className="w-full max-w-sm">
        {!sent ? (
          <>
            {/* Google */}
            <button
              className="w-full flex items-center justify-center gap-3 py-3 rounded-full font-medium text-sm mb-4 transition-all active:scale-95"
              style={{ background: '#FAF3E8', color: '#2C1F0E' }}
              onClick={signInWithGoogle}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px" style={{ background: '#3B3020' }} />
              <span className="text-xs" style={{ color: '#7A6A55' }}>or</span>
              <div className="flex-1 h-px" style={{ background: '#3B3020' }} />
            </div>

            {/* Magic link */}
            <input
              className="input mb-3"
              style={{ background: '#3B3020', border: '1px solid #4A3B28', color: '#FAF3E8' }}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMagicLink()}
            />
            <button
              className="btn-primary"
              onClick={sendMagicLink}
              disabled={loading || !email.trim()}
            >
              {loading ? 'Sending...' : 'Send magic link →'}
            </button>
          </>
        ) : (
          <div className="text-center fade-up">
            <div className="text-4xl mb-4">📬</div>
            <h2 className="font-serif text-xl font-semibold mb-2" style={{ color: '#FAF3E8' }}>
              Check your email
            </h2>
            <p className="text-sm" style={{ color: '#7A6A55' }}>
              We sent a sign-in link to{' '}
              <strong style={{ color: '#FAC775' }}>{email}</strong>
            </p>
          </div>
        )}
      </div>
    </main>
  )
}