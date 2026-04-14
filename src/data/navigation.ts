import { MegamenuItem, NavItemType } from "@/shared/Navigation/NavigationItem";
import ncNanoId from "@/utils/ncNanoId";
import { Route } from "@/routers/types";
import { categories } from "./categories"; // Import categories

// Dynamically generate the mega menu from categories.ts
const businessCategoriesMegaMenu: MegamenuItem[] = categories.slice(0, 5).map((category) => ({
  id: ncNanoId(),
  image: category.image, // Use the image from categories.ts
  title: category.name,
  items: category.subcategories.slice(0, 5).map(subcategory => ({
    id: ncNanoId(),
    href: `/listing-stay?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(subcategory)}`,
    name: subcategory,
  })),
}));

export const NAVIGATION_DEMO: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/",
    name: "Home",
  },
  {
    id: ncNanoId(),
    href: "/listing-stay",
    name: "Search",
  },
  {
    id: ncNanoId(),
    href: "/listings",
    name: "Listings",
  },
  // {
  //   id: ncNanoId(),
  //   href: "/property-listings",
  //   name: "Rentals",
  // },
  {
    id: ncNanoId(),
    href: "/promotions",
    name: "Promotions",
  },
  {
    id: ncNanoId(),
    href: "/advertise",
    name: "Advertise",
  },
  {
    id: ncNanoId(),
    href: "/government-directory",
    name: "Gov Directory",
  },
];

export const NAVIGATION_DEMO_2: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/",
    name: "Home",
  },
  {
    id: ncNanoId(),
    href: "/categories",
    name: "Categories",
  },
  {
    id: ncNanoId(),
    href: "/listing-stay",
    name: "Search",
  },
  {
    id: ncNanoId(),
    href: "/listings",
    name: "Listings",
  },
  // {
  //   id: ncNanoId(),
  //   href: "/property-listings",
  //   name: "Rentals",
  // },
  {
    id: ncNanoId(),
    href: "/government-directory",
    name: "Gov Directory",
  },
];