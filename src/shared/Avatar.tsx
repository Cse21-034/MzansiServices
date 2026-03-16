import { avatarColors } from "@/contains/contants";
import React, { FC } from "react";

export interface AvatarProps {
  containerClassName?: string;
  sizeClass?: string;
  radius?: string;
  imgUrl?: string;
  userName?: string;
  hasChecked?: boolean;
  hasCheckedClass?: string;
}

const Avatar: FC<AvatarProps> = ({
  containerClassName = "ring-1 ring-white dark:ring-neutral-900",
  sizeClass = "h-6 w-6 text-sm",
  radius = "rounded-full",
  imgUrl,
  userName,
  hasChecked,
  hasCheckedClass = "w-4 h-4 -top-0.5 -right-0.5",
}) => {
  // Use logo as fallback if no image
  const url = imgUrl || "/images/namibia-logo/squarelogo.PNG";
  const name = userName || "John Doe";
  
  const _setBgColor = (name: string) => {
    const backgroundIndex = Math.floor(
      name.charCodeAt(0) % avatarColors.length
    );
    return avatarColors[backgroundIndex];
  };

  // Safe image URL check
  const isValidImageUrl = url && (url.startsWith('http') || url.startsWith('/'));

  return (
    <div
      className={`wil-avatar relative flex-shrink-0 inline-flex items-center justify-center text-neutral-100 uppercase font-semibold shadow-inner ${radius} ${sizeClass} ${containerClassName}`}
      style={{ backgroundColor: isValidImageUrl ? undefined : _setBgColor(name) }}
    >
      {isValidImageUrl ? (
        <img
          className={`absolute inset-0 w-full h-full object-cover ${radius}`}
          src={url}
          alt={name}
        />
      ) : (
        // Show initials only if not using logo fallback
        url !== "/images/namibia-logo/squarelogo.PNG" && (
          <span className="wil-avatar__name z-10">
            {name[0]}
          </span>
        )
      )}

      {hasChecked && (
        <span
          className={`bg-teal-500 rounded-full text-white text-xs flex items-center justify-center absolute z-20 ${hasCheckedClass}`}
        >
          <i className="las la-check"></i>
        </span>
      )}
    </div>
  );
};

export default Avatar;