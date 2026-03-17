import { ListingGalleryImage } from "@/components/listing-image-gallery/utils/types";

export const PHOTOS: string[] = [
  "/images/placeholder-business.jpg",
  "/images/placeholder-category.jpg",
];

export const Amenities_demos = [
  { name: "Same-Day Delivery", icon: "la-shipping-fast" },
  { name: "Nationwide Shipping", icon: "la-truck" },
  { name: "International Courier", icon: "la-globe" },
  { name: "Package Tracking", icon: "la-map-marker" },
  { name: "Corporate Accounts", icon: "la-building" },
  { name: "Express Delivery", icon: "la-bolt" },
  { name: "Warehouse Storage", icon: "la-warehouse" },
  { name: "Customs Clearance", icon: "la-passport" },
  { name: "Document Delivery", icon: "la-file" },
  { name: "Parcel Insurance", icon: "la-shield-alt" },
  { name: "24/7 Customer Support", icon: "la-headset" },
  { name: "Real-Time Updates", icon: "la-bell" },
  { name: "Secure Handling", icon: "la-lock" },
  { name: "Temperature Control", icon: "la-snowflake" },
  { name: "Fragile Item Care", icon: "la-heart" },
  { name: "Bulk Shipments", icon: "la-pallet" },
  { name: "Last-Mile Delivery", icon: "la-home" },
  { name: "Return Services", icon: "la-undo" },
  { name: "Online Booking", icon: "la-laptop" },
  { name: "Mobile App", icon: "la-mobile" },
  { name: "COD Available", icon: "la-money-bill" },
  { name: "Free Pickup", icon: "la-truck-loading" },
  { name: "Packaging Services", icon: "la-box" },
  { name: "Proof of Delivery", icon: "la-clipboard-check" },
  { name: "Scheduled Delivery", icon: "la-calendar" },
  { name: "Urgent Courier", icon: "la-running" },
  { name: "Corporate Discounts", icon: "la-percent" },
];

export const imageGallery: ListingGalleryImage[] = [...PHOTOS].map(
  (item, index): ListingGalleryImage => {
    return {
      id: index,
      url: item,
    };
  }
);