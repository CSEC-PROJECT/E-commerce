import { ArrowRight } from "lucide-react";
import Catagory1 from "../../assets/ImagesForHome/Catagories1.png"
import Catagory2 from "../../assets/ImagesForHome/Catagories2.png"
import Catagory3 from "../../assets/ImagesForHome/Catagories3.png"

export default function CuratedCategories() {
  const categories = [
    { id: 1, title: "Footwear", action: "Step into your best day", image: Catagory1 },
    { id: 2, title: "Accessories", action: "Elevate every outfit", image: Catagory2 },
    { id: 3, title: "Apparel", action: "Life is your runway", image: Catagory3 },
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-transparent">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-3 text-gray-900 tracking-tight">Curated Categories</h2>
            <p className="text-gray-500 text-base md:text-lg font-medium">Explore the range, tailored for you.</p>
          </div>
          <a href="#" className="text-[#5c53e5] hover:text-[#7c74ff] font-bold text-lg flex items-center gap-2 mt-4 md:mt-0 transition-colors">
            View All <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="group relative h-[450px] rounded-[2rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
              <img src={category.image} alt={category.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full transform transition-transform duration-300 translate-y-4 group-hover:translate-y-0">
                <h3 className="text-3xl font-extrabold text-white mb-2">{category.title}</h3>
                <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">{category.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
