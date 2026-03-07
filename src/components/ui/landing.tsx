import { useEffect, useState, type ReactNode } from 'react'
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
    const t = setTimeout(() => setVisible(true), 30)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2.5">
          <img src={whatifLogo} alt="WhatIF" className="h-7 w-auto" />
          <span className="font-semibold tracking-tight">WhatIF</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'dark'
            ? <Sun className="size-[18px]" />
            : <Moon className="size-[18px]" />}
        </Button>
      </header>

      {/* Hero */}
      <main
        className="flex-1 flex flex-col items-center justify-center px-6 text-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        <img
          src={whatifLogo}
          alt="WhatIF logo"
          className="h-20 w-auto mb-8 opacity-90"
        />

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight mb-5">
          What if you invested<br className="hidden sm:block" /> differently?
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-[420px] mb-10 leading-relaxed">
          Simulate how a recurring investment in any stock would have grown over any period.
          Compare tickers side by side and see the real numbers.
        </p>

        <Button
          size="lg"
          onClick={onGetStarted}
          className="px-10 h-12 text-base font-semibold shadow-md hover:shadow-lg transition-shadow"
        >
          Get Started
        </Button>

        {/* Social proof hint */}
        <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
          <AvatarGroupExample />
          <span className="ml-1">Built by investors, for investors</span>
        </div>
      </main>

      {/* Feature cards */}
      <section
        className="max-w-3xl mx-auto w-full px-6 pb-16 grid grid-cols-1 sm:grid-cols-3 gap-4"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s',
        }}
      >
        <FeatureCard
          icon={<TrendingUp className="size-5" />}
          title="Real historical data"
          desc="Daily prices pulled directly from Yahoo Finance for any ticker."
        />
        <FeatureCard
          icon={<RefreshCcw className="size-5" />}
          title="DCA simulation"
          desc="Add recurring investments at any interval on top of your initial entry."
        />
        <FeatureCard
          icon={<BarChart2 className="size-5" />}
          title="Side-by-side comparison"
          desc="Compare two tickers on the same chart to see which outperformed."
        />
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-2.5 p-5 rounded-xl border bg-card text-card-foreground shadow-sm">
      <span className="text-muted-foreground">{icon}</span>
      <h3 className="font-semibold text-sm">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  )
}
