import { useEffect, useState, type ReactNode, type CSSProperties } from 'react'
import whatifLogo from '@/assets/whatif.png'
import { Button } from '@/components/ui/button'
import { Moon, Sun, TrendingUp, RefreshCcw, BarChart2 } from 'lucide-react'
import { AvatarGroupExample } from '@/components/ui/avatargroup'

interface LandingPageProps {
  onGetStarted: () => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export default function LandingPage({ onGetStarted, theme, onToggleTheme }: LandingPageProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 40)
    return () => clearTimeout(t)
  }, [])

  const fadeStyle = (delayMs: number): CSSProperties => ({
    animation: visible ? `fade-up 0.6s ease ${delayMs}ms both` : 'none',
    opacity: visible ? undefined : 0,
  })

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col overflow-hidden">

      {/* ── Animated background orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {/* Orb 1 – top-left, indigo */}
        <div
          className="absolute rounded-full opacity-[0.22] dark:opacity-[0.38]"
          style={{
            width: 640, height: 640,
            background: 'radial-gradient(circle at center, #6366f1 0%, transparent 70%)',
            filter: 'blur(90px)',
            top: -180, left: -160,
            animation: 'orb-float-1 16s ease-in-out infinite',
          }}
        />
        {/* Orb 2 – bottom-right, violet */}
        <div
          className="absolute rounded-full opacity-[0.18] dark:opacity-[0.32]"
          style={{
            width: 560, height: 560,
            background: 'radial-gradient(circle at center, #8b5cf6 0%, transparent 70%)',
            filter: 'blur(100px)',
            bottom: -120, right: -120,
            animation: 'orb-float-2 20s ease-in-out infinite',
          }}
        />
        {/* Orb 3 – mid-right, cyan */}
        <div
          className="absolute rounded-full opacity-[0.14] dark:opacity-[0.26]"
          style={{
            width: 420, height: 420,
            background: 'radial-gradient(circle at center, #06b6d4 0%, transparent 70%)',
            filter: 'blur(80px)',
            top: '38%', left: '58%',
            animation: 'orb-float-3 24s ease-in-out infinite',
          }}
        />
      </div>

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2.5">
          <img src={whatifLogo} alt="WhatIF" className="h-7 w-auto" />
          <span className="font-semibold tracking-tight text-sm">WhatIF</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'dark'
            ? <Sun className="size-[18px]" />
            : <Moon className="size-[18px]" />}
        </Button>
      </header>

      {/* ── Hero ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">

        <div style={fadeStyle(0)}>
          <img
            src={whatifLogo}
            alt="WhatIF logo"
            className="h-[72px] w-auto mx-auto mb-8 drop-shadow-lg"
          />
        </div>

        <h1
          className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1] mb-5"
          style={fadeStyle(80)}
        >
          What if you invested<br className="hidden sm:block" /> differently?
        </h1>

        <p
          className="text-base sm:text-lg text-muted-foreground max-w-[440px] mb-10 leading-relaxed"
          style={fadeStyle(160)}
        >
          Simulate a recurring investment in any stock over any timeframe.
          Compare tickers side by side and see exactly what your portfolio would be worth today.
        </p>

        <div style={fadeStyle(240)}>
          <Button
            size="lg"
            onClick={onGetStarted}
            className="px-10 h-12 text-[15px] font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            Get Started
          </Button>
        </div>

        <div
          className="mt-9 flex items-center gap-3 text-sm text-muted-foreground"
          style={fadeStyle(320)}
        >
          <AvatarGroupExample />
          <span>Built by investors, for investors</span>
        </div>
      </main>

      {/* ── Feature cards ── */}
      <section
        className="relative z-10 max-w-3xl mx-auto w-full px-6 pb-16 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4"
        style={fadeStyle(400)}
      >
        <FeatureCard
          icon={<TrendingUp className="size-5" />}
          title="Real historical data"
          desc="Daily prices from Yahoo Finance for any publicly traded ticker."
        />
        <FeatureCard
          icon={<RefreshCcw className="size-5" />}
          title="DCA simulation"
          desc="Layer periodic re-investments on top of your initial entry at any interval."
        />
        <FeatureCard
          icon={<BarChart2 className="size-5" />}
          title="Multi-ticker comparison"
          desc="Add as many tickers as you want and see them all on the same chart."
        />
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 p-5 rounded-xl border bg-card/60 backdrop-blur-sm text-card-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <span className="p-2 rounded-lg bg-muted text-muted-foreground">{icon}</span>
      <h3 className="font-semibold text-sm">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  )
}
