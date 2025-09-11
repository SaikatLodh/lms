"use client";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { PriceRange } from "@/types";
import {
  ChevronDown,
  CircleDollarSign,
  LucideIcon,
  Search,
  Star,
  Tag,
} from "lucide-react";
import { ReactNode, useState } from "react";

const LeftBar = ({
  value,
  setValue,
  MAX_PRICE,
  MIN_PRICE,
  categories,
  rating,
  setRating,
  selectedCategories,
  setSelectedCategories,
  setSerch,
}: {
  value: PriceRange;
  setValue: (value: PriceRange) => void;
  MAX_PRICE: number;
  MIN_PRICE: number;
  categories: string[];
  rating: number | null;
  setRating: (rating: number | null) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  setSerch: (value: string) => void;
}) => {
  return (
    <>
      <div className="w-full max-w-xs divide-y-2">
        <SearchFilter setSerch={setSerch} />
        <PriceRangeFilter
          value={value}
          setValue={setValue}
          MAX_PRICE={MAX_PRICE}
          MIN_PRICE={MIN_PRICE}
        />
        <CategoryFilter
          categories={categories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
        <RatingFilter rating={rating} setRating={setRating} />
      </div>
    </>
  );
};

function PriceRangeFilter({
  value,
  setValue,
  MAX_PRICE,
  MIN_PRICE,
}: {
  value: PriceRange;
  setValue: (value: PriceRange) => void;
  MAX_PRICE: number;
  MIN_PRICE: number;
}) {
  const handleChange = (newValue: PriceRange) => {
    setValue(newValue);
  };

  return (
    <CollapsibleFilter title="Price Range" icon={CircleDollarSign}>
      <div className="flex justify-between space-x-4">
        <Input
          type="number"
          value={value.from}
          onChange={(e) =>
            handleChange({ from: +e.target.value, to: value.to })
          }
          // onBlur={handleBlur}
          className="w-20 border-3 border-[#a435f0]"
        />
        <Input
          type="number"
          value={value.to}
          onChange={(e) =>
            handleChange({ from: value.from, to: +e.target.value })
          }
          // onBlur={handleBlur}
          className="w-20 border-3 border-[#a435f0]"
        />
      </div>
      <Slider
        min={MIN_PRICE}
        max={MAX_PRICE}
        step={10}
        value={[value.from, value.to]}
        onValueChange={([from, to]) => handleChange({ from, to })}
        className="w-full mt-4 mb-3 slider-range"
      />
    </CollapsibleFilter>
  );
}

function RatingFilter({
  rating,
  setRating,
}: {
  rating: number | null;
  setRating: (rating: number | null) => void;
}) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  return (
    <CollapsibleFilter title="Rating" icon={Star}>
      <div className="flex space-x-1 mb-1">
        {[1, 2, 3, 4, 5].map((ratingValue) => (
          <Star
            key={ratingValue}
            className={`h-6 w-6 cursor-pointer ${
              (
                hoveredRating !== null
                  ? hoveredRating >= ratingValue
                  : rating !== null && rating >= ratingValue
              )
                ? "text-yellow-400 fill-yellow-400"
                : "text-[#512f8f] "
            }`}
            onMouseEnter={() => setHoveredRating(ratingValue)}
            onMouseLeave={() => setHoveredRating(null)}
            onClick={() =>
              setRating(ratingValue === rating ? null : ratingValue)
            }
          />
        ))}
      </div>
    </CollapsibleFilter>
  );
}

function CategoryFilter({
  categories,
  selectedCategories,
  setSelectedCategories,
}: {
  categories: string[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}) {
  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };

  return (
    <CollapsibleFilter title="Category" icon={Tag}>
      {categories.map((category) => (
        <div key={category} className="mb-2 flex items-center space-x-3">
          <Checkbox
            id={category}
            checked={selectedCategories.includes(category)}
            onCheckedChange={(checked) =>
              handleCategoryChange(category, checked as boolean)
            }
            className="h-6 w-6 border-3 border-[#a435f0] cursor-pointer"
          />
          <Label
            htmlFor={category}
            className="text-[17px] cursor-pointer text-[#512f8f]"
          >
            {category}
          </Label>
        </div>
      ))}
    </CollapsibleFilter>
  );
}

function SearchFilter({ setSerch }: { setSerch: (value: string) => void }) {
  return (
    <CollapsibleFilter title="Search" icon={Search}>
      <div>
        <div>
          <Input
            type="text"
            onChange={(e) => setSerch(e.target.value)}
            className="w-[300px] border-3 border-[#a435f0] rounded-md p-2"
            placeholder="Search my Courses"
          />
        </div>
      </div>
    </CollapsibleFilter>
  );
}
const CollapsibleFilter = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
}) => (
  <Collapsible defaultOpen>
    <CollapsibleTrigger className="group flex w-full items-center justify-between py-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-[#512f8f]">
        {!!Icon && <Icon className="h-5 w-5 " />} {title}
      </h3>
      <ChevronDown className="h-4 w-4 group-data-[state=open]:rotate-180 transition-transform text-muted-foreground cursor-pointer" />
    </CollapsibleTrigger>
    <CollapsibleContent className="pt-1 pb-3">{children}</CollapsibleContent>
  </Collapsible>
);

export default LeftBar;
