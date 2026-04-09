import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Common/Layout';
import Home from './pages/home';
import ProductsPage from './pages/ProductsPage';
import DetailsPage from './pages/detailsPage';
import AboutPage from './pages/AboutPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<DetailsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/collections" element={<ProductsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
