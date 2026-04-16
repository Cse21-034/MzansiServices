import React, { FC } from "react";
import HIW1img from "@/images/HIW1.png";
import HIW2img from "@/images/HIW2.png";
import HIW3img from "@/images/HIW3.png";
import VectorImg from "@/images/VectorHIW.svg";
import Image, { StaticImageData } from "next/image";
import Heading from "@/shared/Heading";

export interface SectionHowItWorkProps {
  className?: string;
  data?: {
    id: number;
    title: string;
    desc: string;
    img: StaticImageData;
    imgDark?: StaticImageData;
  }[];
}

const DEMO_DATA: SectionHowItWorkProps["data"] = [
  {
    id: 1,
    img: HIW1img,
    title: "Find Local Businesses",
    desc: "Discover trusted businesses in your area with verified reviews and ratings from real customers.",
  },
  {
    id: 2,
    img: HIW2img,
    title: "Compare & Connect",
    desc: "Compare services, read detailed profiles, and contact businesses directly through our platform.",
  },
  {
    id: 3,
    img: HIW3img,
    title: "Support Local Economy",
    desc: "Make informed decisions and support South Africa's growing business community with confidence",
  },
];

const SectionHowItWork: FC<SectionHowItWorkProps> = ({
  className = "",
  data = DEMO_DATA,
}) => {
  return (
    <div
      className={`nc-SectionHowItWork ${className}`}
      data-nc-id="SectionHowItWork"
    >
      <Heading 
        isCenter 
        desc="Connecting South Africa with trusted local businesses"
      >
        How The Directory Works
      </Heading>
      <div className="mt-20 relative grid md:grid-cols-3 gap-20">
        <Image
          className="hidden md:block absolute inset-x-0 top-10"
          src={VectorImg}
          alt=""
        />
        {data.map((item) => (
          <div
            key={item.id}
            className="relative flex flex-col items-center max-w-xs mx-auto"
          >
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-2xl bg-burgundy-50 flex items-center justify-center mx-auto">
                <div className="w-12 h-12 bg-burgundy-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {item.id}
                </div>
              </div>
            </div>
            <div className="text-center mt-auto">
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                {item.title}
              </h3>
              <span className="block mt-5 text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {item.desc}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Additional CTA Section */}
      
    </div>
  );
};

export default SectionHowItWork;
