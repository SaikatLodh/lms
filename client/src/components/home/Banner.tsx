"use client";
import { motion } from "motion/react";
import React from "react";
import { ImagesSlider } from "../ui/images-slider";
import Link from "next/link";

const Banner = () => {
  const images = [
    "https://img-c.udemycdn.com/notices/web_carousel_slide/image/6f0c11ba-83a3-46d9-a631-4389fd1ab53f.png",
    "https://img-c.udemycdn.com/notices/featured_carousel_slide/image/450dec77-8a3c-4286-98af-fe252fd26166.jpg",
    "https://img-c.udemycdn.com/notices/featured_carousel_slide/image/5bf6274c-4a57-42ce-93d6-9775b06730be.jpg",
  ];
  return (
    <>
      <ImagesSlider className="md:h-[45rem] h-[30rem]" images={images}>
        <motion.div
          initial={{
            opacity: 0,
            y: -80,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="z-50 flex flex-col justify-center items-center"
        >
          <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
            Unlock Your Potential <br /> Learn Anything, Anytime
          </motion.p>
          <div className="flex gap-3 items-center">
            <Link href="/user/courses">
              <button className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4 cursor-pointer">
                <span>GET COURSES →</span>
                <div className="absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
              </button>
            </Link>

            <Link href="/user/ai-search">
              <button className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4 cursor-pointer">
                <span>AI SEARCH →</span>
                <div className="absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
              </button>
            </Link>
          </div>
        </motion.div>
      </ImagesSlider>
    </>
  );
};

export default Banner;
