import { formatDuration } from "@/feature/feature";
import { SingleUserCourse } from "@/types";

import { Star } from "lucide-react";

const Detailes = ({ getData }: { getData: SingleUserCourse | undefined }) => {
  const rating = getData?.reviews.reduce((acc, curr) => acc + curr.rating, 0);
  const totalReviews = getData?.reviews?.length || 0;
  return (
    <>
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <div>
          <h1 className="md:text-4xl text-2xl font-bold mb-2">{getData?.title}</h1>
          <p className="text-gray-600">{getData?.subtitle}</p>
          <div className="my-4">
            <h3 className="font-bold">Instructor: {getData?.instructorName}</h3>
            <h5>Language: {getData?.primaryLanguage}</h5>
            <h5>Level: {getData?.level}</h5>
            <h4>Welcome Message: {getData?.welcomeMessage}</h4>
          </div>

          <div className="flex gap-1 items-center mt-2 text-sm text-gray-500">
            <span> {rating && rating / totalReviews}</span>
            <span className="flex">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  className={`w-4 h-4 fill-current ${
                    rating && index < rating / totalReviews
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                  key={index}
                />
              ))}
            </span>
            <span>
              {" "}
              {getData?.reviews && getData?.reviews.length > 0 ? (
                <>
                  {" "}
                  <h6 className="text-[#0260ff]">
                    ({getData?.reviews.length} Reviews)
                  </h6>
                </>
              ) : null}
            </span>
            <span>
              {getData?.students && getData?.students.length > 0 ? (
                <>{getData?.students.length} Students</>
              ) : null}
            </span>
          </div>
        </div>

        {/* Course Structure Section */}
        {getData?.lectures && getData?.lectures.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold">Course Structure</h2>
            <div className="flex items-center gap-3">
              <h6>{getData?.lectures.length} Lectures</h6>
              <h6>
                {" "}
                Duration:{" "}
                {formatDuration(
                  getData?.lectures.reduce(
                    (total, lecture) => total + lecture.videos.duration,
                    0
                  )
                )}{" "}
              </h6>
            </div>

            {/* This will be a separate component */}
          </div>
        )}

        {/* Course Description Section */}
        <div>
          <h2 className="text-2xl font-semibold">Course Description</h2>
          <p>{getData?.description}</p>
        </div>
      </div>
    </>
  );
};

export default Detailes;
