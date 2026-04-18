import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import NavBar from './components/Common/NavBar'
import Footer from './components/Common/Footer'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import ToastContainer from './components/Common/ToastContainer'
import useThemeStore from './store/themeStore'

// Pages
import Home from './pages/home'
import AboutPage from './pages/AboutPage'
import ProductsPage from './pages/ProductsPage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DetailsPage from './pages/detailsPage'
import SettingPage from './pages/SettingPage'
import AdminProducts from './pages/AdminProducts'
import AdminUsers from './pages/AdminUsers'
import AdminDashboard from './pages/AdminDashboard'
import AdminSettings from './pages/AdminSettings'
import AdminEarnings from './pages/AdminEarnings'
import AddProduct from './pages/AddProduct'
import ProductPreview from './pages/ProductPreviewPage'

function AppRoutes() {
  const location = useLocation()
  const hideMainChrome = location.pathname.startsWith('/admin')

  return (
    <>
      {!hideMainChrome && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<DetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingPage /></ProtectedRoute>} />

        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
        <Route path="/admin/earnings" element={<AdminRoute><AdminEarnings /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/addproduct" element={<AdminRoute><AddProduct /></AdminRoute>} />
        <Route path="/admin/add-product" element={<AdminRoute><AddProduct /></AdminRoute>} />
        <Route path="/admin/product-preview" element={<AdminRoute><ProductPreview /></AdminRoute>} />
      </Routes>
      {!hideMainChrome && <Footer />}
    </>
  )
}

const App = () => {
  const { initializeAuth } = useAuthStore()
  const initTheme = useThemeStore((state) => state.initTheme)

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  useEffect(() => {
    initTheme()
  }, [initTheme])

  return (
    <BrowserRouter>
      <ToastContainer />
      <AppRoutes />
      <Toaster position="bottom-right" reverseOrder={false} />
    </BrowserRouter>
  )
}

export default App
