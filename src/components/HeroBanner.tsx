import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { BiArrowBack } from "react-icons/bi";
import Image from "next/image";

const HeroBanner = () => {
  return (
    <div
      className="relative text-white text-[20px]
    w-full max-w-[1360px] mx-auto"
    >
      <Carousel
        autoPlay={true}
        infiniteLoop={true}
        showThumbs={false}
        showStatus={false}
        renderArrowPrev={(clickHandler) => (
          <div
            onClick={clickHandler}
            className="absolute right-[31px] md:right-[51px]
                    bottom-0 w-[30px] md:w-[50px] h-[30px] md:h-[50px]
                    bg-black z-10 flex items-center justify-center
                    cursor-pointer hover:opacity-90"
          >
            <BiArrowBack className="text-sm md:text-lg" />
          </div>
        )}
        renderArrowNext={(clickHandler) => (
          <div
            onClick={clickHandler}
            className="absolute right-0 bottom-0 w-[30px] md:w-[50px]
                    h-[30px] md:h-[50px] bg-black z-10
                    flex items-center justify-center
                    cursor-pointer hover:opacity-90"
          >
            <BiArrowBack className="rotate-180 text-sm md:text-lg" />
          </div>
        )}
      >
        <div>
          <Image
            src="https://mdcomputers-in.b-cdn.net/image/catalog/2025/jan/25-01-25/Thermaltake.webp"
            alt="Thermaltake"
            layout="responsive"
            width={1360}
            height={768}
            className='relative text-white text-[20px]
                w-full max-w-[1360px] mx-auto"'
          />
        </div>
        <div>
        <Image
            src="https://mdcomputers-in.b-cdn.net/image/catalog/2025/jan/28-01-25/cooler-master-ncore-cabinet.webp"
            alt="Cooler Master Ncore Cabinet"
            layout="responsive"
            width={1360}
            height={768}
            className='relative text-white text-[20px]'/>
        </div>
        <div>
          <Image
            src="https://mdcomputers-in.b-cdn.net/image/catalog/2025/jan/30-01-25/rtx-50-series-live-now.webp"
            alt="RTX 50 Series Live Now"
            layout="responsive"
            width={1360}
            height={768}
            className='relative text-white text-[20px]
                w-full max-w-[1360px] mx-auto"'
          />
        </div>
      </Carousel>
    </div>
  );
};
export default HeroBanner;
