import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Detailes from "./Detailes";
import Announcement from "./Announcement";
import Reviews from "../courses/Reviews";
import { useParams } from "next/navigation";
import { useSingleuserCourse } from "@/hooks/react-query/react-hooks/courses/coursesHook";
import ScheduleMettings from "./ScheduleMettings";

const CourseDetails = () => {
  const { slug } = useParams<{ slug: string[] }>();
  const { data: singleCourse } = useSingleuserCourse(slug[0] as string);

  const getData = singleCourse && singleCourse[0];
  const tabs = [
    {
      name: "Detailes",
      value: "Detailes",
      content: <Detailes getData={getData} />,
    },
    {
      name: "Announcement",
      value: "Announcement",
      content: <Announcement getData={getData} />,
    },
    {
      name: "Reviews",
      value: "Reviews",
      content: <Reviews getData={getData} />,
    },
    {
      name: "Schedule Mettings",
      value: "schedule Mettings",
      content: <ScheduleMettings getData={getData} />,
    },
  ];

  return (
    <>
      <Tabs defaultValue={tabs[0].value} className="w-full mt-4 pl-5">
        <TabsList className="w-full p-0 bg-background justify-start border-b rounded-none">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary cursor-pointer"
            >
              <code className="text-[18px] ">{tab.name}</code>
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};

export default CourseDetails;
