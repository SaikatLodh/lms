import { Skeleton } from "@/components/ui/skeleton";

const SingleCourseSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8 md:my-[100px] my-[50px] md:px-0 px-4">
        <div className="lg:col-span-2 space-y-8 md:order-fast order-last">
          {/* Header */}
          <div>
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2" />
            <div className="my-4">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-1/2" />
            </div>
            <div className="flex gap-1 items-center mt-2">
              <Skeleton className="h-4 w-8" />
              <div className="flex">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="w-4 h-4" />
                ))}
              </div>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          {/* Course Structure Section */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-32 w-full" />
          </div>

          {/* Course Description Section */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-20 w-full" />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>

        {/* Right Column: Call to Action */}
        <div className="lg:col-span-1 md:order-last order-first">
          <div className="shadow-lg rounded-lg p-4 space-y-4">
            <Skeleton className="h-48 w-full rounded-md" />
            <div className="text-center">
              <Skeleton className="h-8 w-24 mx-auto" />
            </div>
            <Skeleton className="h-12 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <ul className="space-y-1">
                <li className="flex items-center">
                  <Skeleton className="w-4 h-4 mr-2" />
                  <Skeleton className="h-4 w-3/4" />
                </li>
                <li className="flex items-center">
                  <Skeleton className="w-4 h-4 mr-2" />
                  <Skeleton className="h-4 w-3/4" />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCourseSkeleton;
