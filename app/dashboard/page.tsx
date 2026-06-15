'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { useStreak } from "@/hooks/useStreak"
import { usePrayerLock } from "@/hooks/usePrayerLock" 
import PrayerLockScreen from "@/components/prayer/PrayerLockScreen"
import { PRAYERS, getRosaryForToday, NOVENAS } from "@/lib/prayers"

export default function Dashboard() {
    const router = useRouter()
    const { streak, totalPrayers, todayDone, loading } = useStreak()
    const { lock, unlock } = usePrayerLock()
    const [profile, setProfile] = useState<{ display_name: string; denomination: string } | null>(null)
    const [novena, setNovena] = useState<{ novena_id: string; current_day:number } | null>(null)
    const [schedules, setSchedules] = useState<any[]>([])


    useEffect(()=>{
        async function loadDashboard(){
            const supabase = createClient()
            const { data: { user } } =await supabase.auth.getUser()
            if (!user) { router.push('/auth/login'); return }

            const [profileRes, novenaRes, schedulesRes] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', user.id).single(),
                supabase.from('novena_progress').select('*').eq('user_id', user.id).eq('completed', false).limit(1).single(),
                supabase.from('prayer_schedules').select('*').eq('user_id', user.id).eq('enabled', true).order('time'),
            ])

            setProfile(profileRes.data)
            setNovena(novenaRes.data)
            setSchedules(schedulesRes.data ?? [])
        }

        loadDashboard()
    }, [router])

    const greeting = () => {
        const h = new Date().getHours()
        if (h < 12) return 'Good Morning'
        if (h < 18) return 'Good Afternoon'
        return 'Good Evening'
    }

    const getPrayer = (prayerId: string) =>
        prayerId === 'rosary' ? getRosaryForToday() : PRAYERS.find(p => p.id === prayerId)

    //locking the screen kindaa

    if (lock.locked && lock.prayer) {
        return (
            <PrayerLockScreen
                prayer ={lock.prayer}
                scheduleName={lock.scheduleName}
                onComplete={unlock}
            
            />
        )
    }

    return (
        <main className="min-h-screen font-sans" style={{ background: '#FAF3E8' }}>
            {/* Hheader */}

            <div className="px-5 pt-12 pb-6" style={{ background: '#2C1F0E' }}>
                <p className="text-xs mb-1" style={{ color: '#C98A1A', letterSpacing: '0.08em' }}>
                    {greeting().toLocaleUpperCase()}
                </p>
                <h1 className="font-serif text-2x1 font-semibold" style={{ color: '#FAF3E8' }}>
                    {loading ? '...' : profile?.display_name ?? 'Friend'}
                </h1>

                {/* Stats */}

                <div className="flex gap-3 mt-4">
                    <div className="flex-1 rounded-2x1 p-3" style={{ background: 'rgba(201,138,26,0.15)' }}>
                        <p className="text-xs" style={{ color: '#C4A882' }}>streak</p>
                        <p className="text-2x1 font-serif font-semibold" style={{ color: '#FAC775' }}>
                            {streak} <span className="streak-fire text-lg">🔥</span>
                        </p>
                    </div>
                    <div className="flex-1 rounded-2x1 p-3" style={{ background:'rgba(59,109,17,0.15)' }}>
                        <p className="text-xs" style={{ color: '#C4A882' }}>Total</p>
                        <p className="text-2x1 font-serif font-semibold" style={{ color: '#97C459' }}>
                            {totalPrayers}
                        </p>
                    </div>
                    <div
                        className="flex-1 rounded-2x1 p-3"
                        style={{ background: todayDone ? 'rgba(59,109,17,0.25)' : 'rgba(193,68,14,0.15)' }}
                    >
                        <p className="text-xs" style={{ color: '#C4A882' }}>Today</p>
                        <p className="text-lg font-serif font-semibold" style={{ color: todayDone ? '#97C459' : '#E8835A' }}>
                            {todayDone ? '✓ Done' : 'Pending'}
                        </p>

                    </div>
                </div>

            </div>

            <div className="px-5 py-6 flex flex-col gap-6">
                {/* Active novena  */}
                {novena && (()=>{
                    const novenaData = NOVENAS.find(n => n.id === novena.novena_id)
                    if (!novenaData) return null
                    return (
                        <div className="card" style={{ background: '#2C1F0E', border: 'none' }}>
                            <span className="badge" style={{ background: '#3B6D11', color: '#C0DD97' }}>
                                Day {novena.current_day} of {novenaData.days}
                            </span>
                            <h2 className="font-serif text-lg mt-2" style={{ color: '#FAF3E8' }}>
                                {novenaData.title}
                            </h2>
                            <p className="text-sm mt-1 mb-4" style={{ color: '#C4A882' }}>
                                {novenaData.purpose}
                            </p>
                            
                            <button
                                className="btn-primary"
                                onClick={()=> router.push(`/pray?novena=${novena.novena_id}`)}
                                style={{ background: '#C98A1A' }}
                            >
                                Pray d ay {novena.current_day} →
                            </button>
                        </div>
                    )
                })()}

                {/* Today schedule */}

                <div>
                   <h2 className="font-serif text-base font-semibold mb-3" style={{ color: '#2C1F0E' }}>
                        Today's schedule
                    </h2> 
                    <div className="flex flex-col gap-2">
                        {schedules.length ===0 &&(
                            <p className="text-sm" style={{ color: '#7A6A55' }}>No Schedules set up yet</p>
                        )}
                        {schedules.map(s => {
                            const prayer = getPrayer(s.prayer_id)
                            return(
                                <button
                                    key={s.id}
                                    className="card flex items-center justify-between text-left transition-all active:scale-98"
                                    onClick={()=> router.push(`/pray?id=${s.prayer_id}`)}
                                >
                                    <div>
                                        <p className="font-sans font-medium test-sm" style={{ color: '#2C1F0E' }}>{s.name}</p>
                                        <p className="text-xs mt-0.5" style={{ color: '#7A6A55' }}>
                                            {s.time} • {prayer?.duration ?? 5} min
                                        </p>
                                    </div>
                                    <span style={{ color: '#C1440E', fontSize: 20 }}>→</span>

                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* All Prayers */}

                <div>
                    <h2 className="font-serif text-base font-semibold mb-3" style={{ color: '#2C1F0E' }}>
                        Pray now
                    </h2>
                    <div className="flex flex-col gap-2">
                        {PRAYERS.map(p =>(
                            <button
                            key={p.id}
                            className="card flex items-center justify-between text-left"
                            onClick={() => router.push(`/pray?id=${p.id}`)}
                            >
                                <div>
                                    <p className="font-sans font-medium text-sm" style={{ color: '#2C1F0E' }}>{p.title}</p>
                                    <p className="text-xs mt-0.5" style={{ color: '#7A6A55' }}>
                                        {p.subtitle} · {p.duration} min
                                    </p>
                                </div>
                                <span style={{ color: '#C1440E', fontSize: 20 }}>→</span>
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* nav from behind(pausee💀💀) */}
            <nav
                className="fixed bottom-0 left-0 right-0 flex items-center justify-around px-4 py-3"
                style={{ background: '#FAF3E8', borderTop: '1px solid #EDE4D2' }}
            >

                {[
                    { label: 'Home', icon: '', href: '/dashboard' },
                    { label: 'History',  icon: '📖', href: '/history'   },
                    { label: 'Rewards',  icon: '🏆', href: '/rewards'   },
                    { label: 'Settings', icon: '⚙️', href: '/settings'  },
                ].map(item => (
                    <a key={item.href} href={item.href} className="flex flex-col items-center gap-1">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-xs" style={{ color: '#7A6A55' }}>{item.label}</span>
                    </a>
                ))}

            </nav>

            <div className="pb-24" />
        </main>
    )

}