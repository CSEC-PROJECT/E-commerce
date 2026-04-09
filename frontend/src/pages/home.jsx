import React from "react";
import { Link } from "react-router-dom";
import Hero from "../components/home/Hero";
import CuratedCategories from "../components/home/CuratedCategories";
import Newsletter from "../components/home/Newsletter";
import Card2 from "../components/Common/Card2";
import homeProducts from "../data/homeProducts.json";

export default function Home() {
  return (
    <div className="font-sans antialiased bg-background text-foreground">
      <Hero />
      <CuratedCategories />

      {/* Product Selection Section using Card2 mapped from JSON */}
      <section className="bg-muted/30 py-28 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-14">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">The Selection</h2>
              <p className="text-muted-foreground text-lg max-w-md font-medium leading-relaxed">
                A handpicked collection of pieces designed for the modern individual.
              </p>
            </div>
            <Link
              to="/products"
              className="text-primary hover:opacity-80 font-bold text-[11px] uppercase tracking-[0.2em] flex items-center gap-2 mt-4 md:mt-0 transition-opacity group"
            >
              View All <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {homeProducts.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id}>
                <Card2
                  image={product.image}
                  category={product.category}
                  title={product.title}
                  price={product.price}
                  rating={product.rating}
                  reviews={product.reviews}
                  inStock={product.inStock}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}
