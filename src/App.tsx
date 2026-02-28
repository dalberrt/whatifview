import { useState } from 'react'
import whatifView from './assets/whatif.png'
import Portfolio from './pages/portfolio';
import { AvatarGroupExample } from './components/ui/avatargroup';

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8">
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={whatifView} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={whatifView} className="logo react" alt="React logo" />
        </a>
      </div>

      <Portfolio />

      <AvatarGroupExample />
    </main>

  )
}

export default App
