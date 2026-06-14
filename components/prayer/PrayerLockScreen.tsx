'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import type { Prayer } from '@/lib/prayers'

interface PrayerLockScreenProps {
  prayer: Prayer
  scheduleName: string
  onComplete: () => void
}

export default function PrayerLockScreen({ prayer, scheduleName, onComplete }: PrayerLockScreenProps) {
  const [step, setStep] = useState(0)
  const [startTime] = useState(Date.now())
  const [completing, setCompleting] = useState(false)

  const totalSteps = prayer.content.length
  const progress = (step / totalSteps) * 100
  const isLast = step === totalSteps - 1

  // Intercept back button
  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      e.preventDefault()
      window.history.pushState(null, '', window.location.href)
    }
    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // Request fullscreen when lock appears
  useEffect(() => {
    const el = document.documentElement
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {})
    return () => {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    }
  }, [])

  async function markComplete() {
    setCompleting(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const duration = Math.floor((Date.now() - startTime) / 1000)
      await supabase.from('prayer_logs').insert({
        user_id: user.id,
        prayer_id: prayer.id,
        duration,
      })
    }

    setTimeout(onComplete, 800)
  }

  return (
    <div className="prayer-lock flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <div>
          <p className="text-xs font-sans" style={{ color: '#C98A1A', letterSpacing: '0.08em' }}>
            {scheduleName.toUpperCase()}
          </p>
          <h1 className="font-serif text-xl font-semibold" style={{ color: '#FAF3E8' }}>
            {prayer.title}
          </h1>
          <p className="text-xs mt-0.5" style={{ color: '#7A6A55' }}>{prayer.subtitle}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-sans" style={{ color: '#7A6A55' }}>{prayer.duration} min</p>
          <p className="text-xs font-sans mt-1" style={{ color: '#7A6A55' }}>{step + 1} / {totalSteps}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-5 mb-6">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Prayer content */}
      <div className="flex-1 flex flex-col justify-center px-6" key={step}>
        <p
          className="font-serif text-lg text-center fade-up"
          style={{ color: '#FAF3E8', lineHeight: 1.9 }}
        >
          {prayer.content[step]}
        </p>
      </div>

      {/* Navigation */}
      <div className="px-5 pb-10 pt-6 flex flex-col gap-3">
        {!isLast ? (
          <button className="btn-primary" onClick={() => setStep(s => s + 1)}>
            Continue →
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={markComplete}
            disabled={completing}
            style={{ background: completing ? '#3B6D11' : '#C1440E' }}
          >
            {completing ? '✓ Prayer complete' : 'Mark as prayed'}
          </button>
        )}

        {step > 0 && (
          <button
            className="btn-ghost text-center w-full"
            onClick={() => setStep(s => s - 1)}
          >
            ← Back
          </button>
        )}

        <p className="text-center text-xs font-sans" style={{ color: '#3B3020' }}>
          Complete your prayer to continue
        </p>
      </div>

    </div>
  )
}