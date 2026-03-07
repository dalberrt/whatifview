import whatifLogo from '@/assets/whatif.png'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'

interface NavbarProps {
  onLogoClick: () => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export default function Navbar({ onLogoClick, theme, onToggleTheme }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer"
          aria-label="Back to home"
        >
          <img src={whatifLogo} alt="WhatIF" className="h-6 w-auto" />
          <span className="font-semibold text-sm tracking-tight">WhatIF</span>
        </button>

        <Button variant="ghost" size="icon" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'dark'
            ? <Sun className="size-[18px]" />
            : <Moon className="size-[18px]" />}
        </Button>
      </div>
    </nav>
  )
}
