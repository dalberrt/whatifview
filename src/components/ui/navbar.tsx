import { motion, AnimatePresence } from 'framer-motion'
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
    <motion.nav
      className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md"
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 32, delay: 0.05 }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

        <motion.button
          onClick={onLogoClick}
          className="flex items-center gap-2 cursor-pointer text-foreground hover:opacity-70"
          aria-label="Back to home"
          whileHover={{ opacity: 0.7 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.15 }}
        >
          <img src={whatifLogo} alt="WhatIF" className="h-6 w-auto" />
          <span className="font-semibold text-sm tracking-tight">WhatIF</span>
        </motion.button>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleTheme} 
          aria-label="Toggle theme"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ rotate: -40, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 40, opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="flex items-center justify-center text-foreground"
            >
              {theme === 'dark'
                ? <Sun className="size-[18px]" />
                : <Moon className="size-[18px]" />}
            </motion.span>
          </AnimatePresence>
        </Button>

      </div>
    </motion.nav>
  )
}