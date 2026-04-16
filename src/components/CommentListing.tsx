import { StarIcon } from "@heroicons/react/24/solid";
import React, { FC } from "react";
import Avatar from "@/shared/Avatar";

interface CommentListingDataType {
  name: string;
  avatar?: string;
  date: string;
  comment: string;
  starPoint: number;
  business?: string;
}

export interface CommentListingProps {
  className?: string;
  data?: CommentListingDataType;
  hasListingTitle?: boolean;
}

const DEMO_DATA: CommentListingDataType[] = [
  {
    name: "Tshepo M.",
    date: "December 15, 2023",
    comment: "Mma Tlotlo's Kitchen serves the best seswaa in Windhoek! The portions are generous and the taste takes me back to my grandmother's cooking. Highly recommended for authentic Namibia cuisine.",
    starPoint: 5,
    business: "Mma Tlotlo's Kitchen"
  },
  {
    name: "Lorato G.",
    date: "January 8, 2024",
    comment: "Excellent service at Choppies Riverwalk. The staff is always helpful and the fresh produce section is well-stocked. Their morogo is always fresh and the beef cuts are perfect for seswaa.",
    starPoint: 4,
    business: "Choppies Supermarket"
  },
  {
    name: "Kagiso M.",
    date: "November 22, 2023",
    comment: "Namibia Couriers delivered my package from Swakopmund to Windhoek in record time. The tracking was accurate and the driver was professional. Highly professional service!",
    starPoint: 5,
    business: "Namibia Couriers"
  },
  {
    name: "Amantle B.",
    date: "February 3, 2024",
    comment: "The Bull & Bush Pub has a great atmosphere for watching rugby games. Their chakalaka chicken wings are amazing and the St Louis beer is always cold. Perfect spot for weekend relaxation.",
    starPoint: 4,
    business: "The Bull & Bush Pub"
  },
  {
    name: "Odirile K.",
    date: "January 18, 2024",
    comment: "Auto Tune Windhoek fixed my Toyota Hilux quickly and at a fair price. They used genuine parts and explained everything clearly. My bakkie is running smoothly now - definitely my go-to mechanic.",
    starPoint: 5,
    business: "Auto Tune Windhoek"
  },
  {
    name: "Bontle R.",
    date: "December 30, 2023",
    comment: "Mowana Spa provides excellent massage services. The therapists are skilled and the environment is so peaceful. Perfect for relaxing after a long week. Their specials are worth every thebe.",
    starPoint: 5,
    business: "Mowana Spa & Wellness"
  }
];

const CommentListing: FC<CommentListingProps> = ({
  className = "",
  data = DEMO_DATA[0], // Default to first review
  hasListingTitle = true,
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon 
        key={index} 
        className={`w-4 h-4 ${index < rating ? 'text-yellow-500' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div
      className={`nc-CommentListing flex space-x-4 ${className}`}
      data-nc-id="CommentListing"
    >
      <div className="pt-0.5">
        <Avatar
          sizeClass="h-10 w-10 text-lg"
          radius="rounded-full"
          userName={data.name}
          imgUrl={data.avatar}
        />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between space-x-3">
          <div className="flex flex-col">
            <div className="text-sm font-semibold">
              <span>{data.name}</span>
              {hasListingTitle && data.business && (
                <>
                  <span className="text-neutral-500 dark:text-neutral-400 font-normal">
                    {` reviewed `}
                  </span>
                  <a href="/" className="text-burgundy-600 hover:underline">
                    {data.business}
                  </a>
                </>
              )}
            </div>
            <span className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              {data.date}
            </span>
          </div>
          <div className="flex">
            {renderStars(data.starPoint)}
          </div>
        </div>
        <span className="block mt-3 text-neutral-6000 dark:text-neutral-300 leading-relaxed">
          {data.comment}
        </span>
        
        {/* Namibia-specific touches */}
        <div className="mt-2 flex items-center space-x-2">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            ✓ Verified Purchase
          </span>
          <span className="text-xs text-burgundy-600 bg-burgundy-50 px-2 py-1 rounded-full">
            Local Business
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommentListing;
