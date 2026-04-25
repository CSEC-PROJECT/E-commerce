import React from "react";
import Logo from "./Logo";

const BrandLogo = () => {
  return (
    <div className="flex items-center gap-0 transition-all">




      <Logo size="md" />

      <span className="
        text-md sm:text-lg md:text-xl lg:text-2xl
        font-semibold tracking-tight
        text-primary
        leading-none
        group-hover:opacity-90 transition
        -ml-6
      ">



        Mesob <span className="text-foreground">Market</span>
      </span>
    </div>
  );
};

export default BrandLogo;
