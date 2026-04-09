import { ShoppingCart, Star } from "lucide-react";
import { Button } from "../ui/button";
import Product1 from "../../assets/ImagesForHome/Product1.png";
import Product2 from "../../assets/ImagesForHome/Product2.png";
import Product3 from "../../assets/ImagesForHome/Product3.png";
import Product4 from "../../assets/ImagesForHome/Product4.png";

export default function ProductSelection() {
  const products = [
    { id: 1, category: "Outerwear", name: "Arctic Winter Coat", price: "$420.00", rating: 4.8, reviews: 142, inStock: true, image: Product1 },
    { id: 2, category: "Audio", name: "Studio Headphones", price: "$289.00", rating: 4.9, reviews: 84, inStock: true, image: Product2 },
    { id: 3, category: "Tailoring", name: "Midnight Blazer", price: "$550.00", rating: 4.7, reviews: 56, inStock: false, image: Product3 },
    { id: 4, category: "Footwear", name: "Classic High-Top", price: "$120.00", rating: 4.5, reviews: 112, inStock: true, image: Product4 }
  ];

  return (
    <section className="bg-[#f2f4fc] py-28 px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">The Selection</h2>
          <p className="text-gray-500 text-lg max-w-md font-medium leading-relaxed">
            A handpicked collection of pieces designed for the modern individual.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col group border border-gray-100/50">
              <div className="w-full h-72 rounded-[1.5rem] mb-5 relative overflow-hidden flex items-center justify-center">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="flex flex-col flex-grow px-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-[#5c53e5] font-extrabold uppercase tracking-widest bg-[#5c53e5]/10 px-2.5 py-1 rounded-md">{product.category}</span>
                  <span className="text-lg text-[#5c53e5] font-extrabold">{product.price}</span>
                </div>
                <h3 className="font-extrabold text-gray-900 text-xl mb-3 tracking-tight">{product.name}</h3>
                
                <div className="flex justify-between items-center mb-6 mt-auto">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-extrabold text-gray-700">{product.rating}</span>
                    <span className="text-sm text-gray-400 font-medium">({product.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className={`text-[11px] uppercase tracking-wider font-extrabold ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                      {product.inStock ? 'In Stock' : 'Low Stock'}
                    </span>
                  </div>
                </div>

                <Button className="w-full bg-[#5c53e5] hover:bg-[#4840b8] text-white flex items-center justify-center gap-2 py-6 rounded-xl transition-transform duration-200 active:scale-95 text-base font-extrabold shadow-md shadow-[#5c53e5]/20">
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
