import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import NavBar from './components/Common/NavBar'
import Footer from './components/Common/Footer'
import BottomNav from './components/Common/BottomNav'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import ToastContainer from './components/Common/ToastContainer'
import useThemeStore from './store/themeStore'
import { useProductStore } from './store/productStore'
import useCartStore from './store/cartStore'

import Home from './pages/home'
import InstallPWAButton from './components/InstallPWAButton'
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
import MyProducts from './pages/MyProducts'
import ProductPreview from './pages/ProductPreviewPage'
import TransactionStatusPage from './pages/TransactionStatusPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import UserChangePassword from './components/UserChangePassword'
import { useModalStore } from './store/modalStore'
import AdminLayout from './components/Admin/AdminLayout'

function AppRoutes() {
  const location = useLocation()
  
  const hideMainChrome = ['/login', '/signup', '/forgot-password'].includes(location.pathname) || location.pathname.startsWith('/reset-password');

  return (
    <>
      <InstallPWAButton />
      {!hideMainChrome && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<DetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/cart" element={<CartPage />} />
        <Route path="/settings" element={<ProtectedRoute><SettingPage /></ProtectedRoute>} />
        <Route path="/my-products" element={<MyProducts />} />
        <Route path="/transaction/success" element={<TransactionStatusPage success={true} />} />
        <Route path="/transaction/fail" element={<TransactionStatusPage success={false} />} />

        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="earnings" element={<AdminEarnings />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="addproduct" element={<AddProduct />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="edit-product/:id" element={<AddProduct />} />
          <Route path="product-preview" element={<ProductPreview />} />
        </Route>
      </Routes>
      {!hideMainChrome && <Footer />}
      {!hideMainChrome && <BottomNav />}
    </>
  )
}

const App = () => {
  const { initializeAuth } = useAuthStore()
  const getCart = useCartStore((state) => state.getCart)
  const user = useAuthStore((state) => state.user)
  const initTheme = useThemeStore((state) => state.initTheme)

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  useEffect(() => {
    if (user) {
      getCart()
    }
  }, [user, getCart])

  useEffect(() => {
    initTheme()
  }, [initTheme])

  useEffect(() => {
    useProductStore.getState().fetchProducts().catch(console.error)
    useProductStore.getState().fetchCategories().catch(console.error)
  }, [])

  return (

    <>
      <ToastContainer />
      <UserChangePassword />
      <AppRoutes />
      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  )

}

export default App
