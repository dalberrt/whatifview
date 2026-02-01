import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Button } from "@/components/ui/button"
import { ChartLineLinear } from "@/components/ui/chart-line-linear"
import { ChartLineMultiple } from "@/components/ui/chart-line-multiple"

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';
import Portfolio from './pages/portfolio';

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8">
        <Router>
          <nav>
            <Link to="/">Home</Link> |{' '}
            <Link to="/about">About</Link> |{' '}
            <Link to="/portfolio">Portfolio</Link> |{' '}
          </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
      </Router>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </main>

  )
}

export default App
