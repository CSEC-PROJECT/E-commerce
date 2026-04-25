import React from 'react';
import logo from "@/assets/logo.png";

const Logo = ({ size = "md" }) => {
  const sizes = {
    sm: "h-8 sm:h-9 md:h-10 lg:h-11",
    md: "h-20 sm:h-22 md:h-24 lg:h-26 xl:h-28",
    lg: "h-24 sm:h-28 md:h-32 lg:h-36 xl:h-40"
  };

  return (
    <img
      src={logo}
      alt="Mesob Market Logo"
      className={`object-contain transition-transform duration-200 hover:scale-105 ${sizes[size]}`}
    />
  );
};

export default Logo;