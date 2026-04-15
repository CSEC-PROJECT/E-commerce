import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import NavBar from './components/Common/NavBar'
import Footer from './components/Common/Footer'

// Pages
import Home from './pages/home'
import AboutPage from './pages/AboutPage'
import ProductsPage from './pages/ProductsPage'
import CartPage from './pages/CartPage'
import AddProduct from './pages/AddProduct'
import ProductPreview from './pages/ProductPreview'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage' import DetailsPage from './pages/detailsPage'
import SettingPage from './pages/SettingPage'
import DetailsPage from './pages/detailsPage'
import AdminProducts from './pages/AdminProducts'

const App = () => {
  return (

    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        
        {/* Auth Routes with shared persistent layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        
        <Route path="/product/:id" element={<DetailsPage />} /> 
      </Routes />
      <Footer />
    </BrowserRouter />
  )
}


export default App