'use client'

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"

interface StreakData {
    streak: number
    totalPrayers: number
    todayDone: boolean
    loading: boolean
    
}

export function useStreak(): StreakData {
    const [data, setData] = useState<StreakData>({
        streak: 0,
        totalPrayers: 0,
        todayDone: false,
        loading: true,
    })

    useEffect(()=>{
        async function loadStreak() {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if(!user) return setData (d => ({ ...d, loading:false }))

            const today = new Date().toISOString().split('T')[0]

            const [streakRes, totalRes, todayRes] = await Promise.all([
                supabase.rpc('get_streak', { p_user_id: user.id }),
                supabase.from('prayer_logs').select('id', { count: 'exact' }).eq('user_id', user.id),
                supabase.from('prayer_logs')
                    .select('id')
                    .eq('user_id', user.id)
                    .gte('prayed_at', `${today}T00:00:00`)
                    .limit(1),
            ])

            setData({
                streak: streakRes.data ?? 0,
                totalPrayers: totalRes.count ?? 0,
                todayDone: (todayRes.data?.length ?? 0) > 0,
                loading: false,
            })
        }

        loadStreak()
        
    }, [])

    return data
}