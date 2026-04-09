import React from "react";
import Hero from "../components/home/Hero";
import CuratedCategories from "../components/home/CuratedCategories";
import ProductSelection from "../components/home/ProductSelection";
import Newsletter from "../components/home/Newsletter";


export default function Home() {
  return (
    <div className="font-sans antialiased text-gray-900 bg-[#fdfdfd]">
      <Hero />
      <CuratedCategories />
      <ProductSelection />
      <Newsletter />
    </div>
  );
}
