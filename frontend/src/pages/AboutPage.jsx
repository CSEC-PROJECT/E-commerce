import React from 'react';
import { Link } from 'react-router-dom';

const STATS_DATA = [
  { value: '10K+', label: 'Customers' },
  { value: '500+', label: 'Products' },
  { value: '4.8 ★', label: 'Rating' },
  { value: 'Worldwide', label: 'Shipping' },
];

const FEATURES_DATA = [
  {
    icon: "/Icons/diamond.svg",
    title: 'Premium Quality',
    desc: 'Every material is sourced responsibly, and tested for durability that lasts generations.'
  },
  {
    icon: "/Icons/filter_list.svg",
    title: 'Curated Selection',
    desc: 'We filter out the noise, presenting only the most exceptional designs for your home and lifestyle.'
  },
  {
    icon: "/Icons/local_shipping.svg",
    title: 'Fast & Reliable',
    desc: 'Expedited shipping logistics ensuring your premium selections arrive safely and scheduled.'
  },
  {
    icon: "/Icons/verified.svg",
    title: 'Secure Checkout',
    desc: 'Bank-grade encryption protecting your data and transactions at every single step.'
  },
];

const HeroSection = () => (
  <section className="relative overflow-hidden bg-[#3b2dd3] dark:bg-[#2a1fa8] min-h-[600px] flex items-center">
    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
    <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12">
      <div className="lg:col-span-7">
        <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
          Crafting<br />Timeless<br />Digital<br />Commerce
        </h1>
        <p className="text-indigo-100 text-base lg:text-lg leading-relaxed mb-8 max-w-md">
          At Mesob Market, we believe shopping is an art form. We curate exceptional products with a focus on quality, sustainability, and unparalleled design.
        </p>
        <Link
          to="/products"
          className="inline-block bg-white text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] px-10 py-4 rounded-md shadow-xl hover:bg-zinc-100 transition-all active:scale-95"
        >
          Explore Products
        </Link>
      </div>
      <div className="lg:col-span-5 flex justify-center lg:justify-end">
        <div className="w-full max-w-[400px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-[8px] border-[#5549dc]">
          <img
            src="https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Premium Interior Design"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </section>
);

const OurStorySection = () => (
  <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
    <div className="order-2 lg:order-1 aspect-video lg:aspect-square rounded-2xl overflow-hidden shadow-lg bg-muted">
      <img
        src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"
        alt="Artisan Craftsmanship"
        className="w-full h-full object-cover"
      />
    </div>
    <div className="order-1 lg:order-2">
      <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary block mb-4">
        The Digital Atelier
      </span>
      <h2 className="text-4xl font-black tracking-tight text-foreground mb-6 leading-tight">
        Our Story
      </h2>
      <div className="space-y-4 text-muted-foreground text-[16px] leading-relaxed">
        <p>
          Founded in 2024, Mesob Market was born from a desire to bridge the gap between artisanal craftsmanship and the convenience of modern technology.
          We spent years scouting for partners who share our obsession with detail.
        </p>
        <p>
          Every piece in our collection is vetted for its longevity and aesthetic integrity. We don't just sell items; we provide the building blocks for
          a life well-lived, delivered with the precision of a high-end atelier.
        </p>
      </div>
    </div>
  </section>
);

const StatsSection = () => (
  <section className="bg-primary/10 border-y border-border">
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
      {STATS_DATA.map((stat) => (
        <div key={stat.label} className="text-center group">
          <p className="text-3xl lg:text-4xl font-black tracking-tighter text-primary transition-transform group-hover:scale-110">
            {stat.value}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-2">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  </section>
);

const WhySection = () => (
  <section>
    <div className="bg-muted/50 p-8 lg:pb-20 pb-10">
      <div className="flex flex-col items-center text-center mb-16">
        <h2 className="text-3xl font-black tracking-tight text-foreground">
          Why Mesob Market?
        </h2>
        <div className="mt-3 h-1 w-10 rounded-full bg-primary" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES_DATA.map((feature) => (
          <div
            key={feature.title}
            className="p-8 rounded-2xl border border-border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <div
                className="w-6 h-6 bg-primary"
                style={{
                  maskImage: `url(${feature.icon})`,
                  WebkitMaskImage: `url(${feature.icon})`,
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskPosition: 'center',
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain'
                }}
              />
            </div>
            <h3 className="font-black text-foreground text-sm mb-3 uppercase tracking-wide">
              {feature.title}
            </h3>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-xs">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="px-6 lg:px-12 pb-20">
    <div className="bg-[#3b2dd3] dark:bg-[#2a1fa8] py-20 px-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-center mt-16">
      <div className="max-w-2xl mx-auto relative z-10">
        <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-6">
          Join the Mesob Market Experience
        </h2>
        <p className="text-indigo-100 text-sm lg:text-base leading-relaxed mb-10">
          Elevate your daily rituals with our curated collections.
          Sign up for early access to limited edition drops and editorial insights.
        </p>
        <Link
          to="/products"
          className="inline-block bg-white text-indigo-700 font-bold text-xs uppercase tracking-widest px-12 py-4 rounded-lg shadow-lg hover:scale-105 transition-transform"
        >
          Start Shopping
        </Link>
      </div>
    </div>
  </section>
);

const AboutPage = () => {
  return (
    <main className="min-h-screen text-foreground font-sans bg-background selection:bg-primary/20">
      <HeroSection />
      <OurStorySection />
      <StatsSection />
      <WhySection />
      <CTASection />
    </main>
  );
};

export default AboutPage;