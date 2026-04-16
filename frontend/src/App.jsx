import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import NavBar from './components/Common/NavBar'
import Footer from './components/Common/Footer'
import { Outlet } from 'react-router-dom'

const MainLayout = () => (
  <>
    <NavBar />
    <Outlet />
    <Footer />
  </>
)

// Pages
import Home from './pages/home'
import AboutPage from './pages/AboutPage'
import ProductsPage from './pages/ProductsPage'
import CartPage from './pages/CartPage'
import AddProduct from './pages/AddProduct'
import ProductPreview from './pages/ProductPreview'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage' 
import DetailsPage from './pages/detailsPage'
import SettingPage from './pages/SettingPage'
import AdminProducts from './pages/AdminProducts'
import AdminUsers from './pages/AdminUsers'
import FinanceAnalytics from './pages/FinanceAnalytics'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/addproduct" element={<AddProduct />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/product/:id" element={<DetailsPage />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/product-preview" element={<ProductPreview />} />
        </Route>
        <Route path="/finance" element={<FinanceAnalytics />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
