import { Button } from "../ui/button";
import heroImage from "../../assets/images/hero.png";

export default function Hero() {
  return (
    <section className="bg-background px-4 md:px-8 py-8">
      <div className="bg-card text-card-foreground rounded-2xl overflow-hidden">
        
        <div className="flex flex-col md:flex-row items-center">
          
          {/* LEFT CONTENT */}
          <div className="flex-1 p-6 md:p-12">
            
            {/* Badge */}
            <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs">
              New Season Collection
            </span>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold mt-4 leading-tight">
              Shop Premium <br />
              Fashion & Accessories
            </h1>

            {/* Description */}
            <p className="text-muted-foreground mt-4 max-w-md">
              Discover heritage craftsmanship redefined for the modern digital era.
              Curated essentials designed for longevity and style.
            </p>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <Button variant="default" size="lg">
                Shop Collection
              </Button>

              <Button variant="secondary" size="lg">
                View Lookbook
              </Button>
            </div>

            {/* Features */}
            <div className="flex gap-6 mt-6 text-sm text-muted-foreground">
              <span>Free shipping</span>
              <span>30-day returns</span>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex-1 relative">
            <img
              src={heroImage}
              alt="Fashion"
              className="w-full h-[300px] md:h-[450px] object-cover"
            />

            {/* Soft overlay */}
            <div className="absolute inset-0 bg-background/10"></div>
          </div>

        </div>
      </div>
    </section>
  );
}