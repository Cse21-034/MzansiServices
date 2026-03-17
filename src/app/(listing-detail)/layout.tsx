"use client";

import BackgroundSection from "@/components/BackgroundSection";
import ListingImageGallery from "@/components/listing-image-gallery/ListingImageGallery";
import SectionSliderNewCategories from "@/components/SectionSliderNewCategories";
import SectionSubscribe2 from "@/components/SectionSubscribe2";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { ReactNode, useState, useEffect } from "react";
import MobileFooterSticky from "./(components)/MobileFooterSticky";
import { Route } from "next";
import AdRotation from "@/components/ads/addemobanner";
import type { ListingGalleryImage } from "@/components/listing-image-gallery/utils/types";

const DetailtLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const thisPathname = usePathname();
  const searchParams = useSearchParams();
  const modal = searchParams?.get("modal");
  const [galleryImages, setGalleryImages] = useState<ListingGalleryImage[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);

  // Extract business slug from pathname
  const extractBusinessSlug = () => {
    if (thisPathname?.includes("/listing-stay-detail/")) {
      const parts = thisPathname.split("/listing-stay-detail/");
      if (parts[1]) {
        return parts[1].split("?")[0]; // Remove any query params
      }
    }
    return null;
  };

  // Fetch business photos when modal opens
  useEffect(() => {
    if (modal === "PHOTO_TOUR_SCROLLABLE") {
      const slug = extractBusinessSlug();
      if (slug) {
        setLoadingGallery(true);
        fetch(`/api/businesses/${slug}`)
          .then(res => {
            if (res.ok) return res.json();
            throw new Error('Failed to fetch');
          })
          .then(data => {
            if (data?.photos && Array.isArray(data.photos)) {
              const images = data.photos.map((photo: any, index: number) => ({
                id: index,
                url: photo.url || photo
              }));
              setGalleryImages(images);
            } else {
              setGalleryImages([]);
            }
          })
          .catch(err => {
            console.error('Error fetching business photos:', err);
            setGalleryImages([]);
          })
          .finally(() => setLoadingGallery(false));
      }
    }
  }, [modal, thisPathname]);

  const handleCloseModalImageGallery = () => {
    let params = new URLSearchParams(document.location.search);
    params.delete("modal");
    router.push(`${thisPathname}/?${params.toString()}` as Route);
  };

  return (
    <div className="ListingDetailPage">
      <ListingImageGallery
        isShowModal={modal === "PHOTO_TOUR_SCROLLABLE"}
        onClose={handleCloseModalImageGallery}
        images={galleryImages}
      />

      <div className="container ListingDetailPage__content">{children}</div>

      {/* OTHER SECTION */}
      <div className="container py-24 lg:py-32">
        <div className="relative py-16">
          <BackgroundSection />
          <AdRotation />
        </div>
       
      </div>

      {/* STICKY FOOTER MOBILE */}
      <MobileFooterSticky />
    </div>
  );
};

export default DetailtLayout;
