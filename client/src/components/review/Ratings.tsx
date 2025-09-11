import { Star } from "lucide-react";
import { useState } from "react";

interface RatingsProps {
  value: number;
  onChange: (rating: number) => void;
}

const Ratings = ({ value, onChange }: RatingsProps) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => onChange(rating)}
          onMouseEnter={() => setHoveredRating(rating)}
          onMouseLeave={() => setHoveredRating(0)}
          className="cursor-pointer"
        >
          <Star
            className={`h-5 w-5 ${
              rating <= (hoveredRating || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default Ratings;
