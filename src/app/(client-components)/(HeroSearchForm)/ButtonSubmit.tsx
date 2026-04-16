import { PathName } from "@/routers/types";
import Link from "next/link";
import React, { FC } from "react";

interface Props {
  href?: PathName;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}

const ButtonSubmit: FC<Props> = ({ 
  href = "#", 
  className = "", 
  type = "button",
  onClick = () => {} 
}) => {
  if (type === "submit") {
    return (
      <button
        type="submit"
        className={`h-14 md:h-16 w-full md:w-40 rounded-2xl bg-[#612C30] hover:bg-[#4a2124] flex items-center justify-center text-neutral-50 focus:outline-none ${className}`}
        onClick={onClick}
      >
        <span className="text-center">Search</span>
      </button>
    );
  }

  return (
    <Link
      href={href}
      className={`h-14 md:h-16 w-full md:w-40 rounded-2xl bg-[#612C30] hover:bg-[#4a2124] flex items-center justify-center text-neutral-50 focus:outline-none ${className}`}
    >
      <span className="text-center">Search</span>
    </Link>
  );
};

export default ButtonSubmit;
