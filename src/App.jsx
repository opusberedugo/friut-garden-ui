import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LogInPage from './pages/LogIn'
import SingUpPage from './pages/SignUp'
import LandingPage from './pages/LandingPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    {/* <LandingPage/> */}
    <LogInPage/>
    {/* <SingUpPage/> */}
    </>
    // <h1>Hello</h1>
  )
}

export default App
