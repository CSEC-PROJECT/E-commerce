import { Button } from "../ui/button";
import { Truck, RotateCcw } from "lucide-react";
import hero1 from "../../assets/ImagesForHome/hero1.png"

export default function Hero() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-6">
      <section className="relative w-full bg-[#0B101A] text-white rounded-[2.5rem] min-h-[640px] flex items-center overflow-hidden shadow-xl">
        {/* Background patterns / gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B101A] via-[rgba(11,16,26,0.8)] to-transparent z-10 w-full lg:w-1/2"></div>

        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0 flex justify-end">
          <img src={hero1} alt="Hero Background" className="w-full h-full lg:w-3/4 object-cover object-center" />
        </div>

        {/* Content */}
        <div className="relative z-20 px-8 py-20 lg:px-20 w-full">
          <div className="max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center bg-[#5c53e5] text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-8 uppercase">
              New Season Collection
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-[5rem] font-extrabold leading-[1.05] mb-6 tracking-tight">
              Shop <br />
              Premium <br />
              Fashion & <br />
              Accessories
            </h1>

            {/* Description */}
            <p className="text-gray-300 text-lg md:text-xl max-w-md mb-10 leading-relaxed font-medium">
              Discover heritage craftsmanship redefined for the modern digital era. Curated essentials designed for longevity and style.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <Button className="bg-[#5c53e5] hover:bg-[#4840b8] text-white px-10 py-7 rounded-xl text-lg font-bold transition-transform duration-300 shadow-lg shadow-[#5c53e5]/25 hover:-translate-y-1">
                Shop Collection
              </Button>
              <Button variant="outline" className="border-gray-500 text-white bg-black/20 hover:bg-white hover:text-black px-10 py-7 rounded-xl text-lg font-bold transition-all duration-300 backdrop-blur-sm">
                View Lookbook
              </Button>
            </div>

            {/* Features */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 text-sm text-gray-300 font-semibold tracking-wide">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#5c53e5]" /> Free US shipping
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-[#5c53e5]" /> 30-day returns
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}