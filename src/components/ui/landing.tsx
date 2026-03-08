import { type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import whatifLogo from '@/assets/whatif.png'
import { Button } from '@/components/ui/button'
import { Moon, Sun, TrendingUp, RefreshCcw, BarChart2, ArrowRight } from 'lucide-react'
import { AvatarGroupUs } from '@/components/ui/avatargroup'

interface LandingPageProps {
  onGetStarted: () => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

// Stagger container / child variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.11, delayChildren: 0.18 },
  },
}
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 280, damping: 26 } },
}

const FEATURES = [
  {
    icon: <TrendingUp className="size-[18px]" />,
    grad: 'from-amber-700 to-amber-900',
    title: 'Real historical data',
    desc: 'Daily adjusted prices from Yahoo Finance for any publicly listed ticker.',
  },
  {
    icon: <RefreshCcw className="size-[18px]" />,
    grad: 'from-stone-500 to-stone-700',
    title: 'DCA simulation',
    desc: 'Layer recurring investments at any interval on top of your initial entry.',
  },
  {
    icon: <BarChart2 className="size-[18px]" />,
    grad: 'from-teal-700 to-teal-900',
    title: 'Multi-ticker compare',
    desc: 'Add unlimited tickers and plot them all on a single interactive chart.',
  },
]

export default function LandingPage({ onGetStarted, theme, onToggleTheme }: LandingPageProps) {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col overflow-hidden">

      {/* ── Dot grid ── */}
      <div className="absolute inset-0 bg-dot-grid pointer-events-none" aria-hidden />

      {/* ── Animated gradient orbs (Framer Motion) ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <motion.div
          className="absolute rounded-full opacity-[0.32] dark:opacity-[0.22]"
          style={{
            width: 720, height: 720,
            background: 'radial-gradient(circle at center, #C4A870 0%, transparent 68%)',
            filter: 'blur(100px)',
            top: -260, left: -210,
          }}
          animate={{ x: [0, 55, -30, 0], y: [0, -65, 30, 0], scale: [1, 1.08, 0.93, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full opacity-[0.24] dark:opacity-[0.18]"
          style={{
            width: 600, height: 600,
            background: 'radial-gradient(circle at center, #B8956A 0%, transparent 68%)',
            filter: 'blur(90px)',
            bottom: -170, right: -160,
          }}
          animate={{ x: [0, -65, 40, 0], y: [0, 45, -28, 0], scale: [1, 1.1, 0.91, 1] }}
          transition={{ duration: 23, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full opacity-[0.18] dark:opacity-[0.14]"
          style={{
            width: 460, height: 460,
            background: 'radial-gradient(circle at center, #D4C4A0 0%, transparent 68%)',
            filter: 'blur(80px)',
            top: '38%', left: '56%',
          }}
          animate={{ x: [0, -42, 22, 0], y: [0, -55, 32, 0], scale: [1, 1.12, 0.94, 1] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* ── Header ── */}
      <motion.header
        className="relative z-10 flex items-center justify-between px-8 py-5"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-2.5">
          <img src={whatifLogo} alt="WhatIF" className="h-7 w-auto" />
          <span className="font-semibold tracking-tight text-sm text-foreground">WhatIF</span>
        </div>

        <Button variant="ghost" size="icon" onClick={onToggleTheme} aria-label="Toggle theme">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ rotate: -40, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 40, opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="flex items-center justify-center"
            >
              {theme === 'dark'
                ? <Sun className="size-[18px]" />
                : <Moon className="size-[18px]" />}
            </motion.span>
          </AnimatePresence>
        </Button>
      </motion.header>

      {/* ── Hero ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          className="flex flex-col items-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Floating logo */}
          <motion.div
            variants={item}
            animate={{ y: [0, -10, 0] }}
            transition={{ y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' } }}
            className="mb-8"
          >
            <img
              src={whatifLogo}
              alt="WhatIF"
              className="h-[78px] w-auto drop-shadow-2xl"
            />
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={item}
            className="text-5xl sm:text-[64px] font-bold tracking-tight leading-[1.08] mb-5"
          >
            What if you invested
            <br />
            <span className="gradient-text">differently?</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={item}
            className="text-base sm:text-[17px] text-muted-foreground max-w-[450px] mb-10 leading-relaxed"
          >
            Simulate recurring investments in any stock over any timeframe.
            Compare tickers side by side — see exactly what would have happened.
          </motion.p>

          {/* CTA */}
          <motion.div variants={item}>
            <motion.button
              type="button"
              onClick={onGetStarted}
              className="group relative inline-flex items-center gap-2.5 px-8 h-[50px] rounded-xl font-semibold text-[15px] text-amber-50 overflow-hidden shadow-glow cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #5C3D20 0%, #7A5030 55%, #4A3520 100%)' }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 420, damping: 22 }}
            >
              <span className="relative z-10">Get Started</span>
              <motion.span
                className="relative z-10"
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <ArrowRight className="size-4" />
              </motion.span>
              {/* Shimmer sweep on hover */}
              <div
                className="absolute inset-0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
              />
            </motion.button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            variants={item}
            className="mt-9 flex items-center gap-3 text-sm text-muted-foreground"
          >
            <AvatarGroupUs />
            <span>Built by investors, for investors</span>
          </motion.div>
        </motion.div>
      </main>

      {/* ── Feature cards ── */}
      <section className="relative z-10 max-w-3xl mx-auto w-full px-6 pb-14 pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {FEATURES.map((card, i) => (
          <FeatureCard key={card.title} card={card} index={i} />
        ))}
      </section>
    </div>
  )
}

function FeatureCard({
  card,
  index,
}: {
  card: { icon: ReactNode; grad: string; title: string; desc: string }
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 240, damping: 26, delay: 0.55 + index * 0.1 }}
      whileHover={{
        y: -6,
        boxShadow: '0 22px 52px rgba(160,110,60,0.14), 0 0 0 1px rgba(140,100,55,0.20)',
      }}
      className="flex flex-col items-center text-center gap-3 p-6 rounded-xl border bg-card/55 backdrop-blur-md text-card-foreground shadow-sm cursor-default"
    >
      <span className={`p-2.5 rounded-xl bg-gradient-to-br ${card.grad} text-white shadow-sm`}>
        {card.icon}
      </span>
      <h3 className="font-semibold text-sm">{card.title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
    </motion.div>
  )
}
