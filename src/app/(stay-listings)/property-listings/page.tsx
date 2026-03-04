import React, { FC } from "react";
import SectionGridPropertyListings from "../SectionGridPropertyListings";

export interface PropertyListingsPageProps {}

const PropertyListingsPage: FC<PropertyListingsPageProps> = () => {
  return (
    <>
      {/* Property Listings search and display page */}
      <SectionGridPropertyListings className="container pb-24 lg:pb-28" />
    </>
  );
};

export default PropertyListingsPage;
