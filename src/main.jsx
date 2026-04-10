import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import NewUserAuth from './pages/NewUserAuth.jsx'
import SignUpPage from './pages/SignUp.jsx'
import LogInPage from './pages/LogIn.jsx'
import EmailAuth from './pages/EmailAuth.jsx'
import HomePage from './pages/HomePage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import SearchPage from './pages/SearchPage.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/login",
    element: <LogInPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/new-user-authentication/:id",
    element: <NewUserAuth />
  },
  {
    path: "/email-authentication/:id",
    element: <EmailAuth />
  },
  {
    path: "/product/:productId",
    element: <ProductPage />
  },
  {
    path: "/search",
    element: <SearchPage />
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
