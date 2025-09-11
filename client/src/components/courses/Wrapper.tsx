"use client";

import React, { useMemo, useState } from "react";
import LeftBar from "./LeftBar";
import Courses from "./Courses";
import { useUserCourses } from "@/hooks/react-query/react-hooks/courses/coursesHook";
import CardSkeleton from "../CardSkeleton";
import { PriceRange } from "@/types";
import { useDebounce } from "use-debounce";

const Wrapper = () => {
  const { data, isLoading } = useUserCourses();
  const [serch, setSerch] = useState("");
  const [searchResult] = useDebounce(serch, 500);
  const MIN_PRICE = data && Math.min(...data.map((course) => course.pricing));
  const MAX_PRICE = data && Math.max(...data.map((course) => course.pricing));
  const [value, setValue] = useState<PriceRange>({
    from: MIN_PRICE as number,
    to: MAX_PRICE as number,
  });
  const [rating, setRating] = useState<number | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const removeDublicatesCategories = data
    ? new Set([...data.map((course) => course.category)].flat())
    : [];
  const convertInArray = [...removeDublicatesCategories];

  const filteredProducts = useMemo(() => {
    if (!data) return [];

    return data.filter((product) => {
      const searchFilter =
        product.title.toLowerCase().includes(searchResult.toLowerCase()) ||
        product.category.toLowerCase().includes(searchResult.toLowerCase()) ||
        product.subtitle.toLowerCase().includes(searchResult.toLowerCase()) ||
        product.description
          .toLowerCase()
          .includes(searchResult.toLowerCase()) ||
        product.primaryLanguage
          .toLowerCase()
          .includes(searchResult.toLowerCase()) ||
        product.instructorName
          .toLowerCase()
          .includes(searchResult.toLowerCase()) ||
        product.level.toLowerCase().includes(searchResult.toLowerCase());

      const priceMatch =
        product.pricing >= value.from && product.pricing <= value.to;

      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);

      const ratingMatch =
        rating === null || product?.reviews[0]?.rating === rating;

      return searchFilter && priceMatch && categoryMatch && ratingMatch;
    });
  }, [value, data, selectedCategories, rating, searchResult]);

  return (
    <>
      <div className="flex gap-8 w-full my-[100px] px-5 md:flex-nowrap flex-wrap">
        <LeftBar
          value={value}
          setValue={setValue}
          MIN_PRICE={MIN_PRICE as number}
          MAX_PRICE={MAX_PRICE as number}
          categories={convertInArray}
          rating={rating}
          setRating={setRating}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          setSerch={setSerch}
        />

        {isLoading ? <CardSkeleton /> : <Courses data={filteredProducts} />}
      </div>
    </>
  );
};

export default Wrapper;
