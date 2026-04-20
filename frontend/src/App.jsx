import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import NavBar from "./components/Common/NavBar";
import Footer from "./components/Common/Footer";
import RequireRole from "./components/auth/RequireRole";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";

// Pages
import Home from "./pages/home";
import AboutPage from "./pages/AboutPage";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import TransactionStatusPage from "./pages/TransactionStatusPage";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DetailsPage from "./pages/detailsPage";
import SettingPage from "./pages/SettingPage";
import AdminProducts from "./pages/AdminProducts";
import AdminUsers from "./pages/AdminUsers";
import AddProduct from "./pages/AddProduct";
import MyProducts from "./pages/MyProducts";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSettings from "./pages/AdminSettings";
import AdminEarnings from "./pages/AdminEarnings";
import ProductPreview from "./pages/ProductPreview";

const AppContent = () => {
  const location = useLocation();
  const hideOn = ["/my-products"];
  const showNavAndFooter = !hideOn.includes(location.pathname);

  return (
    <>
      {showNavAndFooter && <NavBar />}
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
        <Route
          path="/transaction/success"
          element={
            <ProtectedRoute>
              <TransactionStatusPage success={true} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transaction/fail"
          element={
            <ProtectedRoute>
              <TransactionStatusPage success={false} />
            </ProtectedRoute>
          }
        />
        <Route path="/my-products" element={<MyProducts />} />
[4/21/2026 1:52 AM] Milke S: <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <AdminSettings />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/earnings"
          element={
            <AdminRoute>
              <AdminEarnings />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/addproduct"
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/edit-product/:id"
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/product-preview"
          element={
            <AdminRoute>
              <ProductPreview />
            </AdminRoute>
          }
        />
      </Routes>
      {showNavAndFooter && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;