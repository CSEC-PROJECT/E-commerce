import { Button } from "../ui/button";
import { ShieldCheck } from "lucide-react";
import Newssettler from "../../assets/ImagesForHome/Newssettler.png";

export default function Newsletter() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-16">
      <section className="bg-[#121626] text-white rounded-[2.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
          
          {/* Left Content */}
          <div className="flex-1 w-full max-w-xl">
            <span className="text-[#5c53e5] text-xs font-bold tracking-widest uppercase mb-6 block">
              Join Our Atelier
            </span>
            <h2 className="text-5xl md:text-6xl font-extrabold mb-8 leading-[1.1] tracking-tight">
              Join the Atelier. <br />
              Get 10% Off.
            </h2>
            <p className="text-gray-400 mb-12 text-lg md:text-xl font-medium leading-relaxed">
              Be the first to know about seasonal drops, limited collaborations, and get 10% off your first order.
            </p>

            <form className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="flex-1 bg-[#1a2035] border border-gray-700/50 rounded-xl px-6 py-5 text-white focus:outline-none focus:border-[#5c53e5] focus:ring-1 focus:ring-[#5c53e5] transition-all text-lg"
                required
              />
              <Button className="bg-[#5c53e5] hover:bg-[#4840b8] text-white px-10 py-5 h-auto rounded-xl text-lg font-bold transition-transform duration-200 active:scale-95 shadow-lg shadow-[#5c53e5]/20">
                Join Now
              </Button>
            </form>
          </div>

          {/* Right Content - Visual */}
          <div className="flex-1 relative w-full lg:h-[450px] h-[350px] rounded-[2rem] overflow-hidden mt-8 lg:mt-0 shadow-2xl">
            <img src={Newssettler} alt="Store Interior" className="absolute inset-0 w-full h-full object-cover" />
            
            <div className="absolute inset-0 bg-gradient-to-tr from-[#121626]/80 via-transparent to-transparent"></div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl">
              <div className="flex items-start gap-5">
                <div className="bg-[#5c53e5]/20 p-3.5 rounded-xl text-[#7c74ff]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-1.5">Premium Quality</h4>
                  <p className="text-xs text-gray-300 font-semibold mb-3 tracking-wide">Crafted with care</p>
                  <p className="text-xs text-gray-400 leading-relaxed font-medium">
                    Each piece is meticulously inspected in our studio. Excellence is not just a goal, it's a standard running through every seam.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
