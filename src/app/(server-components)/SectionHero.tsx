import React, { FC } from "react";
import image1 from "@/images/g2.jpg";
import image2 from "@/images/g1.jpg";
import HeroSearchForm from "../(client-components)/(HeroSearchForm)/HeroSearchForm";
import Image from "next/image";
import ButtonPrimary from "@/shared/ButtonPrimary";
import HeroImageSlider from "@/components/HeroImageSlider";

export interface SectionHeroProps {
  className?: string;
}

const SectionHero: FC<SectionHeroProps> = ({ className = "" }) => {
  return (
    <div
      className={`nc-SectionHero flex flex-col-reverse lg:flex-col relative ${className}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-start">
        <div className="flex-shrink-0 lg:w-1/2 flex flex-col items-start space-y-8 sm:space-y-10 pb-14 lg:pb-64 xl:pr-14 lg:mr-10 xl:mr-0">
          <h2 className="font-medium text-4xl md:text-5xl xl:text-7xl !leading-[114%] ">
            Connect with verified local businesses
          </h2>
          <span className="text-base md:text-lg text-neutral-500 dark:text-neutral-400">
            Discover the best businesses across Namibia - from restaurants and shops to professional services and tourism operators.
          </span>

        </div>

        {/* Image Grid Layout */}
        <div className="flex-grow pb-20 lg:pb-0 overflow-hidden">
          <div className="grid grid-cols-2 gap-4 h-[500px] lg:h-[450px]">
            {/* Left Column - Two stacked images */}
            <div className="flex flex-col gap-4">
              {/* Top Left Image */}
              <div className="relative h-1/2 rounded-2xl overflow-hidden">
                <Image
                  className="object-cover"
                  src={image1}
                  alt="Namibia business 1"
                  fill
                  priority
                />
              </div>
              {/* Bottom Left Image */}
              <div className="relative h-1/2 rounded-2xl overflow-hidden">
                <Image
                  className="object-cover"
                  src={image2}
                  alt="Namibia business 2"
                  fill
                  priority
                />
              </div>
            </div>

            {/* Right Column - Single tall image with slider - White background to blend */}
            <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-neutral-900">
              <HeroImageSlider />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block z-10 mb-12 lg:mb-0 lg:-mt-56 w-full">
        <HeroSearchForm />
      </div>
    </div>
  );
};

export default SectionHero;
