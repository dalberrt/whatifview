import { useState, useEffect } from 'react'
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

  if (view === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setView('dashboard')}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar
        onLogoClick={() => setView('landing')}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Portfolio />
      </main>
    </div>
  )
}

export default App
