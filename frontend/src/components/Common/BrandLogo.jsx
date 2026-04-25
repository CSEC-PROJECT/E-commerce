import React from "react";
import Logo from "./Logo";

const BrandLogo = () => {
  return (
    <div className="flex items-center gap-1.5 md:gap-2 transition-all">
      <Logo size="md" />

      <span className="
        text-base sm:text-lg md:text-xl lg:text-2xl
        font-semibold tracking-tight
        text-primary
        leading-none
        group-hover:opacity-90 transition
      ">
        Mesob <span className="text-foreground">Market</span>
      </span>
    </div>
  );
};

export default BrandLogo;
