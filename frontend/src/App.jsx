import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from 'react-hot-toast'
import NavBar from './components/Common/NavBar'
import Footer from './components/Common/Footer'
import RequireRole from './components/auth/RequireRole'

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

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/admin/products"
          element={
            <RequireRole roles={["admin"]}>
              <AdminProducts />
            </RequireRole>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RequireRole roles={["admin"]}>
              <AdminUsers />
            </RequireRole>
          }
        />
        <Route
          path="/admin/addproduct"
          element={
            <RequireRole roles={["admin"]}>
              <AddProduct />
            </RequireRole>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/product/:id" element={<DetailsPage />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/transaction/success" element={<TransactionStatusPage success={true} />} />
        <Route path="/transaction/fail" element={<TransactionStatusPage success={false} />} />

      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
