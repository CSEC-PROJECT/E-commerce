import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import NavBar from './components/Common/NavBar'
import Footer from './components/Common/Footer'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'

// Pages
import Home from './pages/home'
import AboutPage from './pages/AboutPage'
import ProductsPage from './pages/ProductsPage'
import CartPage from './pages/CartPage'
import TransactionStatusPage from './pages/TransactionStatusPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DetailsPage from './pages/detailsPage'
import SettingPage from './pages/SettingPage'
import AdminProducts from './pages/AdminProducts'
import AdminUsers from './pages/AdminUsers'
import AddProduct from './pages/AddProduct'
import AdminDashboard from './pages/AdminDashboard'
import AdminSettings from './pages/AdminSettings'
import AdminEarnings from './pages/AdminEarnings'
import ProductPreview from './pages/ProductPreview'

const App = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<DetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected user routes */}
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingPage /></ProtectedRoute>} />
        <Route path="/transaction/success" element={<ProtectedRoute><TransactionStatusPage success={true} /></ProtectedRoute>} />
        <Route path="/transaction/fail" element={<ProtectedRoute><TransactionStatusPage success={false} /></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
        <Route path="/admin/earnings" element={<AdminRoute><AdminEarnings /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/addproduct" element={<AdminRoute><AddProduct /></AdminRoute>} />
        <Route path="/admin/add-product" element={<AdminRoute><AddProduct /></AdminRoute>} />
        <Route path="/admin/edit-product/:id" element={<AdminRoute><AddProduct /></AdminRoute>} />
        <Route path="/admin/product-preview" element={<AdminRoute><ProductPreview /></AdminRoute>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
