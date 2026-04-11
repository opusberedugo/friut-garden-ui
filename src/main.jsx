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
import CartPage from './pages/CartPage.jsx'
import WishlistPage from './pages/Wishlist.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import OrdersPage from './pages/OrdersPage.jsx'
import PreferencesPage from './pages/PreferencesPage.jsx'
import SalesDashboard from './pages/SalesDashboard.jsx'
import SalesProducts from './pages/SalesProducts.jsx'
import SalesOrders from './pages/SalesOrders.jsx'
import SalesReviews from './pages/SalesReviews.jsx'

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
  {
    path: "/profile",
    element: <CartPage />
  },
  {
    path: "/profile/wishlist",
    element: <WishlistPage />
  },
  {
    path: "/profile/orders",
    element: <OrdersPage />
  },
  {
    path: "/profile/preferences",
    element: <PreferencesPage />
  },
  {
    path: "/profile/sales/dashboard",
    element: <SalesDashboard />
  },
  {
    path: "/profile/sales/products",
    element: <SalesProducts />
  },
  {
    path: "/profile/sales/orders",
    element: <SalesOrders />
  },
  {
    path: "/profile/sales/reviews",
    element: <SalesReviews />
  },
  {
    path: "/checkout",
    element: <CheckoutPage />
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
