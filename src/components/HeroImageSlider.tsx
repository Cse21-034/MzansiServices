"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const IMAGES = [
    "/images/hero/1.png",
    "/images/hero/2.png",
    "/images/hero/4.png",
    "/images/hero/5.jpeg",
    "/images/hero/6.jpg",
    "/images/hero/7.jpg",
    "/images/hero/8.jpg",
    "/images/hero/10.jpg",
    "/images/hero/11.jpg",
];

const HeroImageSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
        }, 4000); // Change every 4 seconds for a smooth loop

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-full bg-white dark:bg-neutral-900">
            {IMAGES.map((src, index) => (
                <div
                    key={src}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    <Image
                        src={src}
                        alt={`Hero image ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                    />
                </div>
            ))}
        </div>
    );
};

export default HeroImageSlider;
