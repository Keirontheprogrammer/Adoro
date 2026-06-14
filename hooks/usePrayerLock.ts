'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { PRAYERS, getRosaryForToday, type Prayer } from '@/lib/prayers'

interface LockState {
  locked: boolean
  prayer: Prayer | null
  scheduleName: string
}

export function usePrayerLock() {
  const [lock, setLock] = useState<LockState>({
    locked: false,
    prayer: null,
    scheduleName: '',
  })

  const unlock = useCallback(() => {
    setLock({ locked: false, prayer: null, scheduleName: '' })
  }, [])

  useEffect(() => {
    async function checkSchedules() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: schedules } = await supabase
        .from('prayer_schedules')
        .select('*')
        .eq('user_id', user.id)
        .eq('enabled', true)

      if (!schedules?.length) return

      const now = new Date()
      const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

      for (const schedule of schedules) {
        if (schedule.time === hhmm) {
          // Check if already prayed this hour
          const hourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString()
          const { data: recent } = await supabase
            .from('prayer_logs')
            .select('id')
            .eq('user_id', user.id)
            .eq('prayer_id', schedule.prayer_id)
            .gte('prayed_at', hourAgo)
            .limit(1)

          if (!recent?.length) {
            // Rosary gets today's mysteries, others use static content
            const prayer = schedule.prayer_id === 'rosary'
              ? getRosaryForToday()
              : PRAYERS.find(p => p.id === schedule.prayer_id)

            if (prayer) {
              setLock({ locked: true, prayer, scheduleName: schedule.name })
            }
          }
        }
      }
    }

    checkSchedules()
    const interval = setInterval(checkSchedules, 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return { lock, unlock }
}