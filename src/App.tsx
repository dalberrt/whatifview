import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Portfolio from './pages/portfolio'
import LandingPage from './components/ui/landing'
import Navbar from './components/ui/navbar'

type View = 'landing' | 'dashboard'
type Theme = 'light' | 'dark'

function App() {
  const [view, setView] = useState<View>('landing')
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <AnimatePresence mode="wait">
      {view === 'landing' ? (
        <motion.div
          key="landing"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -24, filter: 'blur(4px)' }}
          transition={{ duration: 0.28, ease: 'easeIn' }}
        >
          <LandingPage
            onGetStarted={() => setView('dashboard')}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
          className="relative min-h-screen bg-background text-foreground"
        >
          {/* Grid paper background */}
          <div className="fixed inset-0 bg-dot-grid pointer-events-none" aria-hidden />
          <Navbar
            onLogoClick={() => setView('landing')}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
          <main className="relative max-w-6xl mx-auto px-6 py-8">
            <Portfolio />
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default App
