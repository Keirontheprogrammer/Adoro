'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { PRAYERS, NOVENAS, getRosaryForToday } from '@/lib/prayers'
import PrayerLockScreen from '@/components/prayer/PrayerLockScreen'

export default function PrayPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const prayerId = searchParams.get('id')
  const novenaId = searchParams.get('novena')

  const [prayer, setPrayer] = useState<any>(null)
  const [novena, setNovena] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPrayer() {
      // Novena prayer
      if (novenaId) {
        const novenaData = NOVENAS.find(n => n.id === novenaId)
        if (novenaData) {
          const supabase = createClient()
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            const { data: progress } = await supabase
              .from('novena_progress')
              .select('*')
              .eq('user_id', user.id)
              .eq('novena_id', novenaId)
              .single()
            setNovena(progress)
          }
          setPrayer({
            id: `novena-${novenaId}`,
            title: novenaData.title,
            subtitle: `Day ${novena?.current_day ?? 1} of ${novenaData.days}`,
            duration: 5,
            denominations: ['catholic'],
            content: [
              `Day ${novena?.current_day ?? 1} of 9 — ${novenaData.title}`,
              novenaData.dailyPrayer,
              'Take a moment to present your intentions to God in silence.',
              `${novenaData.patron}, pray for us. Amen.`,
            ],
          })
        }
        setLoading(false)
        return
      }

      // Regular prayer
      if (prayerId) {
        const found = prayerId === 'rosary'
          ? getRosaryForToday()
          : PRAYERS.find(p => p.id === prayerId)
        setPrayer(found ?? null)
      }

      setLoading(false)
    }
    loadPrayer()
  }, [prayerId, novenaId])

  async function handleComplete() {
    // If novena, advance the day
    if (novenaId && novena) {
      const supabase = createClient()
      const nextDay = novena.current_day + 1
      const novenaData = NOVENAS.find(n => n.id === novenaId)

      if (novenaData && nextDay > novenaData.days) {
        // Novena complete!
        await supabase
          .from('novena_progress')
          .update({ completed: true })
          .eq('id', novena.id)
      } else {
        await supabase
          .from('novena_progress')
          .update({ current_day: nextDay })
          .eq('id', novena.id)
      }
    }

    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#2C1F0E' }}
      >
        <p className="font-serif text-lg" style={{ color: '#C4A882' }}>
          Preparing your prayer...
        </p>
      </div>
    )
  }

  if (!prayer) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: '#2C1F0E' }}
      >
        <p className="font-serif text-lg mb-4" style={{ color: '#FAF3E8' }}>
          Prayer not found.
        </p>
        <button className="btn-primary" onClick={() => router.push('/dashboard')}>
          ← Back to home
        </button>
      </div>
    )
  }

  return (
    <PrayerLockScreen
      prayer={prayer}
      scheduleName={novenaId ? 'Novena' : 'Prayer'}
      onComplete={handleComplete}
    />
  )
}