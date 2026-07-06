'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { NOVENAS, DEFAULT_SCHEDULES } from '@/lib/prayers'

type Step = 'name' | 'denomination' | 'novena' | 'schedule'

const DENOMINATIONS = [
  { id: 'catholic',   label: 'Catholic',   desc: 'Rosary, Novenas, Angelus, Liturgy of the Hours' },
  { id: 'protestant', label: 'Protestant', desc: 'Morning & evening prayers, Scripture readings' },
  { id: 'orthodox',   label: 'Orthodox',   desc: 'Morning & evening prayers, Jesus Prayer' },
]

export default function Onboarding() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('name')
  const [name, setName] = useState('')
  const [denomination, setDenomination] = useState('catholic')
  const [selectedNovena, setSelectedNovena] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const steps: Step[] = ['name', 'denomination', 'novena', 'schedule']
  const stepIndex = steps.indexOf(step)

  async function finish() {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Save profile
    await supabase.from('profiles').upsert({
      id: user.id,
      display_name: name,
      denomination,
    })

    // Save default schedules
    const scheduleRows = DEFAULT_SCHEDULES.map(s => ({
      ...s,
      id: crypto.randomUUID(),
      user_id: user.id,
      prayer_id: s.prayerId,
    }))
    await supabase.from('prayer_schedules').insert(scheduleRows)

    // Save novena if chosen
    if (selectedNovena) {
      await supabase.from('novena_progress').insert({
        user_id: user.id,
        novena_id: selectedNovena,
        current_day: 1,
        remind_time: '20:00',
      })
    }

    router.push('/dashboard')
  }

  return (
    <main
      className="min-h-screen flex flex-col px-6 pt-16 pb-10 font-sans"
      style={{ background: '#FAF3E8' }}
    >
      {/* Progress bar */}
      <div className="flex gap-2 mb-10">
        {steps.map((s, i) => (
          <div
            key={s}
            className="h-1.5 rounded-full flex-1 transition-all duration-300"
            style={{ background: stepIndex >= i ? '#C1440E' : '#EDE4D2' }}
          />
        ))}
      </div>

      {/* ── Step: Name ── */}
      {step === 'name' && (
        <div className="fade-up flex flex-col flex-1">
          <h1 className="font-serif text-3xl font-semibold mb-2" style={{ color: '#2C1F0E' }}>
            Welcome to Adoro
          </h1>
          <p className="text-sm mb-8" style={{ color: '#7A6A55' }}>
            Your daily prayer companion. Let's get you set up.
          </p>
          <label className="text-sm font-medium mb-2" style={{ color: '#2C1F0E' }}>
            What should we call you?
          </label>
          <input
            className="input mb-2"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && name.trim() && setStep('denomination')}
          />
          <div className="flex-1" />
          <button
            className="btn-primary"
            onClick={() => name.trim() && setStep('denomination')}
            disabled={!name.trim()}
          >
            Continue →
          </button>
        </div>
      )}

      {/* ── Step: Denomination ── */}
      {step === 'denomination' && (
        <div className="fade-up flex flex-col flex-1">
          <h1 className="font-serif text-2xl font-semibold mb-2" style={{ color: '#2C1F0E' }}>
            Your tradition
          </h1>
          <p className="text-sm mb-6" style={{ color: '#7A6A55' }}>
            This shapes which prayers are shown to you.
          </p>
          <div className="flex flex-col gap-3 mb-6">
            {DENOMINATIONS.map(d => (
              <button
                key={d.id}
                className="card text-left transition-all"
                onClick={() => setDenomination(d.id)}
                style={{
                  border: denomination === d.id
                    ? '2px solid #C1440E'
                    : '1px solid #EDE4D2',
                }}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm" style={{ color: '#2C1F0E' }}>{d.label}</p>
                  {denomination === d.id && (
                    <span style={{ color: '#C1440E' }}>✓</span>
                  )}
                </div>
                <p className="text-xs mt-1" style={{ color: '#7A6A55' }}>{d.desc}</p>
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <button
            className="btn-primary"
            onClick={() => setStep(denomination === 'catholic' ? 'novena' : 'schedule')}
          >
            Continue →
          </button>
          <button className="btn-ghost text-center mt-2 w-full" onClick={() => setStep('name')}>
            ← Back
          </button>
        </div>
      )}

      {/* ── Step: Novena (Catholic only) ── */}
      {step === 'novena' && (
        <div className="fade-up flex flex-col flex-1">
          <h1 className="font-serif text-2xl font-semibold mb-2" style={{ color: '#2C1F0E' }}>
            Start a Novena?
          </h1>
          <p className="text-sm mb-6" style={{ color: '#7A6A55' }}>
            A novena is 9 days of dedicated prayer. You can always start one later.
          </p>
          <div className="flex flex-col gap-3 mb-4">
            {NOVENAS.map(n => (
              <button
                key={n.id}
                className="card text-left transition-all"
                onClick={() => setSelectedNovena(n.id === selectedNovena ? null : n.id)}
                style={{
                  border: selectedNovena === n.id
                    ? '2px solid #C98A1A'
                    : '1px solid #EDE4D2',
                }}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm" style={{ color: '#2C1F0E' }}>{n.title}</p>
                  {selectedNovena === n.id && (
                    <span style={{ color: '#C98A1A' }}>✓</span>
                  )}
                </div>
                <p className="text-xs mt-1" style={{ color: '#7A6A55' }}>{n.purpose}</p>
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <button className="btn-primary" onClick={() => setStep('schedule')}>
            {selectedNovena ? 'Start novena →' : 'Skip novena →'}
          </button>
          <button className="btn-ghost text-center mt-2 w-full" onClick={() => setStep('denomination')}>
            ← Back
          </button>
        </div>
      )}

      {/* ── Step: Schedule preview ── */}
      {step === 'schedule' && (
        <div className="fade-up flex flex-col flex-1">
          <h1 className="font-serif text-2xl font-semibold mb-2" style={{ color: '#2C1F0E' }}>
            Your prayer schedule
          </h1>
          <p className="text-sm mb-6" style={{ color: '#7A6A55' }}>
            We've set up a default schedule. You can change times in Settings anytime.
          </p>
          <div className="flex flex-col gap-3 mb-6">
            {DEFAULT_SCHEDULES.map((s, i) => (
              <div key={i} className="card flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm" style={{ color: '#2C1F0E' }}>{s.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#7A6A55' }}>{s.time} daily</p>
                </div>
                <span
                  className="badge"
                  style={{ background: '#EDE4D2', color: '#7A6A55' }}
                >
                  Daily
                </span>
              </div>
            ))}
          </div>
          <div className="flex-1" />
          <button className="btn-primary" onClick={finish} disabled={saving}>
            {saving ? 'Setting up...' : 'Start praying →'}
          </button>
          <button
            className="btn-ghost text-center mt-2 w-full"
            onClick={() => setStep(denomination === 'catholic' ? 'novena' : 'denomination')}
          >
            ← Back
          </button>
        </div>
      )}
    </main>
  )
}