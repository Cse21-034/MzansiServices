import React from "react";
import Image from "next/image";
import Link from "next/link";
import { StaticImageData } from "next/image";

export interface LogoProps {
  img?: string;
  imgLight?: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  img = "/images/mzansi-logo/squarelogo.PNG",
  imgLight = "/images/mzansi-logo/squarelogo.PNG",
  className = "h-12", // Use height instead of width for consistent sizing
}) => {
  return (
    <Link
      href="/"
      className={`ttnc-logo inline-block text-primary-6000 focus:outline-none focus:ring-0 ${className}`}
    >
      {img && (
        <img
          className={`h-full w-auto ${imgLight ? "dark:hidden" : ""}`} // Use h-full to fill container height
          src={img}
          alt="Logo"
        />
      )}
      {imgLight && (
        <img
          className="hidden h-full w-auto dark:block" // Use h-full to fill container height
          src={imgLight}
          alt="Logo-Light"
        />
      )}
    </Link>
  );
};

export default Logo;
