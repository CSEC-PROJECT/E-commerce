import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Truck, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import hero1 from "../../assets/ImagesForHome/hero1.png";

const API_BASE = "https://e-commerce-he4h.onrender.com/api";

export default function Hero() {
  const navigate = useNavigate();

  // Each slide is { id: string|null, name: string, coverImage: string }
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false); // has the image finished loading
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef(null);

  /* ── Fetch products on mount ─────────────────────────── */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/products`, {
          params: { limit: 20 },
        });

        const fetched = (data.products || [])
          .filter((p) => p.coverImage) // only products that have an image
          .map((p) => ({ id: p._id, name: p.name, coverImage: p.coverImage }));

        // If backend returned at least one product use them, otherwise fallback
        if (fetched.length > 0) {
          setSlides(fetched);
        } else {
          setSlides([]); // will trigger fallback render
        }
      } catch {
        setSlides([]); // fetch failed → use fallback
      }
    };

    fetchProducts();
  }, []);

  /* ── Auto-advance every 2.5 s (only when there are real slides) ── */
  useEffect(() => {
    if (slides.length <= 1) return; // nothing to cycle

    timerRef.current = setInterval(() => {
      goTo((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timerRef.current);
  }, [slides]);

  /* ── Smooth cross-fade helper ─── */
  const goTo = (getNext) => {
    setTransitioning(true);
    setLoaded(false);
    setTimeout(() => {
      setIndex(getNext);
      setTransitioning(false);
    }, 300);
  };

  const goPrev = () => {
    clearInterval(timerRef.current);
    goTo((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    clearInterval(timerRef.current);
    goTo((prev) => (prev + 1) % slides.length);
  };

  /* ── Derived values ── */
  const isFallback = slides.length === 0;
  const current = isFallback ? null : slides[index];
  const displayImage = isFallback ? hero1 : current.coverImage;

  const handleShop = () => {
    if (isFallback) {
      navigate("/products");
    } else {
      navigate(`/product/${current.id}`);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-6">
      <section className="relative w-full bg-[#0B101A] text-white rounded-[2.5rem] min-h-[640px] flex items-center overflow-hidden shadow-xl">

        {/* Left-side gradient overlay so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B101A] via-[rgba(11,16,26,0.75)] to-transparent z-10 w-full lg:w-[55%] pointer-events-none" />

        {/* ── Background / Product Image ── */}
        <div className="absolute inset-0 w-full h-full z-0 flex justify-end">
          <img
            key={displayImage} // forces re-mount on slide change for the fade
            src={displayImage}
            alt={isFallback ? "Hero Background" : current.name}
            onLoad={() => setLoaded(true)}
            className={`w-full h-full lg:w-3/4 object-cover object-center transition-opacity duration-300 ${
              transitioning || !loaded ? "opacity-0" : "opacity-100"
            }`}
          />
        </div>

        {/* ── Dot / arrow navigation (only when real slides exist) ── */}
        {!isFallback && slides.length > 1 && (
          <>
            {/* Prev arrow */}
            <button
              onClick={goPrev}
              aria-label="Previous product"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            {/* Next arrow */}
            <button
              onClick={goNext}
              aria-label="Next product"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { clearInterval(timerRef.current); goTo(() => i); }}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index ? "w-6 bg-[#5c53e5]" : "w-2 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* ── Text Content ── */}
        <div className="relative z-20 px-8 py-20 lg:px-20 w-full">
          <div className="max-w-xl">

            {/* Badge */}
            <div className="inline-flex items-center bg-[#5c53e5] text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-8 uppercase">
              {isFallback ? "New Season Collection" : current.name}
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-[5rem] font-extrabold leading-[1.05] mb-6 tracking-tight">
              Shop <br />
              Premium <br />
              Fashions &amp; <br />
              Accessories
            </h1>

            {/* Description */}
            <p className="text-gray-300 text-lg md:text-xl max-w-md mb-10 leading-relaxed font-medium">
              Discover heritage craftsmanship redefined for the modern digital era.
              Curated essentials designed for longevity and style.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <Button
                onClick={handleShop}
                className="bg-[#5c53e5] hover:bg-[#4840b8] text-white px-10 py-7 rounded-xl text-lg font-bold transition-transform duration-300 shadow-lg shadow-[#5c53e5]/25 hover:-translate-y-1"
              >
                {isFallback ? "Shop Collection" : "View Product"}
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