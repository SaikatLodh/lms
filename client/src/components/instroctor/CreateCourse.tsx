"use client";
import React, { useMemo, useState } from "react";
import { InstructorCourse } from "@/types";
import { Lens } from "../ui/lens";
import { motion } from "motion/react";
import { isNewCourse } from "@/feature/feature";
import {
  BookOpen,
  IndianRupee,
  MonitorStop,
  SquarePen,
  Trash,
} from "lucide-react";
import {
  useDeleteCourse,
  useInstructorCourses,
} from "@/hooks/react-query/react-hooks/courses/coursesHook";
import { cn } from "@/lib/utils";
import CardSkeleton from "../CardSkeleton";
import { Button } from "../ui/button";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import { Input } from "../ui/input";

const CreateCourse = () => {
  const { data, isLoading } = useInstructorCourses();
  const [serch, setSerch] = useState("");
  const [value] = useDebounce(serch, 500);

  const filteredSerch = useMemo(() => {
    return data?.filter((item) => {
      return item.title.toLowerCase().includes(value.toLowerCase());
    });
  }, [data, value]);
  return (
    <>
      <div className="w-full h-screen  rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto instroctor-course">
        <div className="flex justify-between md:flex-nowrap flex-wrap items-center md:mt-0 mt-5">
          <div className="md:w-fit w-full mb-10">
            <h2 className=" md:text-5xl text-2xl font-bold mb-4">
              Course List
            </h2>

            <div>
              <h6 className="text-gray-600 font-bold md:text-2xl text-[20px]">
                {data?.length} Courses
              </h6>
            </div>
          </div>
          <div className="md:w-fit w-full md:mt-0 mt-3 md:mb-0 mb-3">
            <div className="md:flex md:justify-end justify-evenly w-full">
              <Link href="/instructor/create-course/course">
                <Button className=" border-1 bg-[#6D28D2] text-white hover:bg-[#EDE5F9] hover:text-[#6D28D2] hover:border-1 hover:border-[#6D28D2] cursor-pointer mb-3 md:w-fit w-full">
                  Create Course
                </Button>
              </Link>
            </div>

            <Input
              type="text"
              onChange={(e) => setSerch(e.target.value)}
              className="md:w-[300px] w-full border border-black rounded-md p-2"
              placeholder="Search my Courses"
            />
          </div>
        </div>
        {isLoading && <CardSkeleton />}

        {filteredSerch && filteredSerch.length === 0 && (
          <div className="w-full h-[75vh] flex items-center justify-center gap-2">
            <div className="flex flex-col items-center justify-center">
              <BookOpen width={60} height={60} />{" "}
              <h5 className="text-2xl font-bold">No Courses Found</h5>
            </div>
          </div>
        )}

        {filteredSerch && filteredSerch.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-8 gap-0 w-full">
            {filteredSerch.map((card) => (
              <Card key={card._id} card={card} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const Card = ({ card }: { card: InstructorCourse }) => {
  const [hovering, setHovering] = useState(false);
  const { mutate, isPending } = useDeleteCourse();
  return (
    <>
      <div className="w-full relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1D2235] to-[#121318] p-5 md:my-0 my-4 ">
        <Rays />
        <Beams />
        <div className="relative z-10">
          <div className="relative">
            <Lens hovering={hovering} setHovering={setHovering}>
              <img
                src={card.image.url}
                alt="image"
                className="rounded-2xl w-full h-[200px] object-cover"
              />
            </Lens>
            {isNewCourse(card.createdAt) && (
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-[99]">
                New
              </div>
            )}
          </div>
          <motion.div
            animate={{
              filter: hovering ? "blur(2px)" : "blur(0px)",
            }}
            className="py-4 relative z-20"
          >
            <div className="flex gap-2 items-start mb-4">
              <h2 className={`text-white ${"text-2xl"} text-left font-bol`}>
                {card.title.slice(0, 27) + "..."}
              </h2>
              <div className="flex items-center text-white bg-white/10 px-3 py-1 rounded-full">
                <IndianRupee className="h-4 w-4 mr-1" />
                <span>{card.pricing.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <p className="text-neutral-200 text-left mb-4">
              {card.description.slice(0, 100) + "..."}
            </p>
          </motion.div>

          <div className="flex items-center gap-2  md:flex-nowrap flex-wrap">
            <Link
              href={`/instructor/create-course/course/${card._id}`}
              className="w-full"
            >
              <button className="relative inline-flex h-10 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50 w-full">
                <span className="absolute  inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a2aeff_0%,#3749be_50%,#a2aeff_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="flex items-center gap-2  h-full w-full cursor-pointer  justify-center rounded-full dark:bg-[#070e41] bg-[#070E41] px-8 py-1 text-sm font-medium dark:text-gray-50 text-white backdrop-blur-3xl">
                  <SquarePen className="h-4 w-4" />
                  <span> Edit</span>
                </span>
              </button>
            </Link>

            <button
              disabled={isPending}
              onClick={() => mutate(card._id)}
              className="relative inline-flex h-10 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50  w-full"
            >
              <span className="absolute  inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a2aeff_0%,#3749be_50%,#a2aeff_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="flex items-center gap-2  h-full w-full cursor-pointer  justify-center rounded-full dark:bg-[#070e41] bg-[#070E41] px-8 py-1 text-sm font-medium dark:text-gray-50 text-white backdrop-blur-3xl">
                <Trash className="h-4 w-4" />
                <span>{isPending ? "Deleting..." : "Delete"}</span>
              </span>
            </button>
            <Link href={`/instructor/lecture/${card._id}`} className="w-full">
              <button className="relative inline-flex h-10 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50  w-full">
                <span className="absolute  inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a2aeff_0%,#3749be_50%,#a2aeff_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="flex items-center gap-2  h-full w-full cursor-pointer  justify-center rounded-full dark:bg-[#070e41] bg-[#070E41] px-8 py-1 text-sm font-medium dark:text-gray-50 text-white backdrop-blur-3xl">
                  <MonitorStop className="h-4 w-4" />
                  <span>Add Lecture</span>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

const Beams = () => {
  return (
    <svg
      width="380"
      height="315"
      viewBox="0 0 380 315"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute top-0 left-1/2 -translate-x-1/2 w-full pointer-events-none"
    >
      <g filter="url(#filter0_f_120_7473)">
        <circle cx="34" cy="52" r="114" fill="#6925E7" />
      </g>
      <g filter="url(#filter1_f_120_7473)">
        <circle cx="332" cy="24" r="102" fill="#8A4BFF" />
      </g>
      <g filter="url(#filter2_f_120_7473)">
        <circle cx="191" cy="53" r="102" fill="#802FE3" />
      </g>
      <defs>
        <filter
          id="filter0_f_120_7473"
          x="-192"
          y="-174"
          width="452"
          height="452"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="56"
            result="effect1_foregroundBlur_120_7473"
          />
        </filter>
        <filter
          id="filter1_f_120_7473"
          x="70"
          y="-238"
          width="524"
          height="524"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="80"
            result="effect1_foregroundBlur_120_7473"
          />
        </filter>
        <filter
          id="filter2_f_120_7473"
          x="-71"
          y="-209"
          width="524"
          height="524"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="80"
            result="effect1_foregroundBlur_120_7473"
          />
        </filter>
      </defs>
    </svg>
  );
};

const Rays = ({ className }: { className?: string }) => {
  return (
    <svg
      width="380"
      height="397"
      viewBox="0 0 380 397"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "absolute left-0 top-0  pointer-events-none z-[1]",
        className
      )}
    >
      <g filter="url(#filter0_f_120_7480)">
        <path
          d="M-37.4202 -76.0163L-18.6447 -90.7295L242.792 162.228L207.51 182.074L-37.4202 -76.0163Z"
          fill="url(#paint0_linear_120_7480)"
        />
      </g>
      <g
        style={{ mixBlendMode: "plus-lighter" }}
        opacity="0.3"
        filter="url(#filter1_f_120_7480)"
      >
        <path
          d="M-109.54 -36.9027L-84.2903 -58.0902L178.786 193.228L132.846 223.731L-109.54 -36.9027Z"
          fill="url(#paint1_linear_120_7480)"
        />
      </g>
      <g
        style={{ mixBlendMode: "plus-lighter" }}
        opacity="0.86"
        filter="url(#filter2_f_120_7480)"
      >
        <path
          d="M-100.647 -65.795L-69.7261 -92.654L194.786 157.229L139.51 197.068L-100.647 -65.795Z"
          fill="url(#paint2_linear_120_7480)"
        />
      </g>
      <g
        style={{ mixBlendMode: "plus-lighter" }}
        opacity="0.31"
        filter="url(#filter3_f_120_7480)"
      >
        <path
          d="M163.917 -89.0982C173.189 -72.1354 80.9618 2.11525 34.7334 30.1553C-11.495 58.1954 -106.505 97.514 -115.777 80.5512C-125.048 63.5885 -45.0708 -3.23233 1.15763 -31.2724C47.386 -59.3124 154.645 -106.061 163.917 -89.0982Z"
          fill="#8A50FF"
        />
      </g>
      <g
        style={{ mixBlendMode: "plus-lighter" }}
        filter="url(#filter4_f_120_7480)"
      >
        <path
          d="M34.2031 13.2222L291.721 269.534"
          stroke="url(#paint3_linear_120_7480)"
        />
      </g>
      <g
        style={{ mixBlendMode: "plus-lighter" }}
        filter="url(#filter5_f_120_7480)"
      >
        <path
          d="M41 -40.9331L298.518 215.378"
          stroke="url(#paint4_linear_120_7480)"
        />
      </g>
      <g
        style={{ mixBlendMode: "plus-lighter" }}
        filter="url(#filter6_f_120_7480)"
      >
        <path
          d="M61.3691 3.8999L317.266 261.83"
          stroke="url(#paint5_linear_120_7480)"
        />
      </g>
      <g
        style={{ mixBlendMode: "plus-lighter" }}
        filter="url(#filter7_f_120_7480)"
      >
        <path
          d="M-1.46191 9.06348L129.458 145.868"
          stroke="url(#paint6_linear_120_7480)"
          strokeWidth="2"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_120_7480"
          x="-49.4199"
          y="-102.729"
          width="304.212"
          height="296.803"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="6"
            result="effect1_foregroundBlur_120_7480"
          />
        </filter>
        <filter
          id="filter1_f_120_7480"
          x="-115.54"
          y="-64.0903"
          width="300.326"
          height="293.822"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="3"
            result="effect1_foregroundBlur_120_7480"
          />
        </filter>
        <filter
          id="filter2_f_120_7480"
          x="-111.647"
          y="-103.654"
          width="317.434"
          height="311.722"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="5.5"
            result="effect1_foregroundBlur_120_7480"
          />
        </filter>
        <filter
          id="filter3_f_120_7480"
          x="-212.518"
          y="-188.71"
          width="473.085"
          height="369.366"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="48"
            result="effect1_foregroundBlur_120_7480"
          />
        </filter>
        <filter
          id="filter4_f_120_7480"
          x="25.8447"
          y="4.84521"
          width="274.234"
          height="273.065"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="4"
            result="effect1_foregroundBlur_120_7480"
          />
        </filter>
        <filter
          id="filter5_f_120_7480"
          x="32.6416"
          y="-49.3101"
          width="274.234"
          height="273.065"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="4"
            result="effect1_foregroundBlur_120_7480"
          />
        </filter>
        <filter
          id="filter6_f_120_7480"
          x="54.0078"
          y="-3.47461"
          width="270.619"
          height="272.68"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="3.5"
            result="effect1_foregroundBlur_120_7480"
          />
        </filter>
        <filter
          id="filter7_f_120_7480"
          x="-9.2002"
          y="1.32812"
          width="146.396"
          height="152.275"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="3.5"
            result="effect1_foregroundBlur_120_7480"
          />
        </filter>
        <linearGradient
          id="paint0_linear_120_7480"
          x1="-57.5042"
          y1="-134.741"
          x2="403.147"
          y2="351.523"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.214779" stopColor="#AF53FF" />
          <stop offset="0.781583" stopColor="#B253FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_120_7480"
          x1="-122.154"
          y1="-103.098"
          x2="342.232"
          y2="379.765"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.214779" stopColor="#AF53FF" />
          <stop offset="0.781583" stopColor="#9E53FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_120_7480"
          x1="-106.717"
          y1="-138.534"
          x2="359.545"
          y2="342.58"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.214779" stopColor="#9D53FF" />
          <stop offset="0.781583" stopColor="#A953FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_120_7480"
          x1="72.701"
          y1="54.347"
          x2="217.209"
          y2="187.221"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#AF81FF" />
          <stop offset="1" stopColor="#C081FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_120_7480"
          x1="79.4978"
          y1="0.191681"
          x2="224.006"
          y2="133.065"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#AF81FF" />
          <stop offset="1" stopColor="#C081FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_120_7480"
          x1="79.6568"
          y1="21.8377"
          x2="234.515"
          y2="174.189"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#B981FF" />
          <stop offset="1" stopColor="#CF81FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_120_7480"
          x1="16.119"
          y1="27.6966"
          x2="165.979"
          y2="184.983"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#A981FF" />
          <stop offset="1" stopColor="#CB81FF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default CreateCourse;
