import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LandingPage from './pages/LandingPage'

function App() {
  const [count, setCount] = useState(0)
  const token = localStorage.getItem('fm_token')

  if (token) {
    return <Navigate to="/home" replace />
  }

  return (
    <>
      <LandingPage/>
    </>
  )
}

export default App
