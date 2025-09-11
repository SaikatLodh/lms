import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MonitorPlay, Play } from "lucide-react";
import { Lecture } from "@/types";
import { formatDuration } from "@/feature/feature";
import Preview from "./Preview";

const AccordionDemo = ({ lectures }: { lectures: Lecture[] }) => {
  const [open, setOpen] = React.useState<boolean | false>(false);
  const [selectedLecture, setSelectedLecture] = React.useState<Lecture | null>(
    null
  );

  const handelOpen = (lecture: Lecture) => {
    setOpen(!open);
    setSelectedLecture(lecture);
  };
  return (
    <>
      {lectures &&
        lectures.length > 0 &&
        lectures.slice(0, 6).map((lecture) => (
          <div
            className="flex items-center justify-between py-2 px-4"
            key={lecture._id}
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600">
                <MonitorPlay />
              </div>
              <span className="text-sm">{lecture.title}</span>
            </div>
            {lecture.freePreview === true && (
              <div
                className="flex items-center gap-1 cursor-pointer text-[#5022C3]"
                onClick={() => handelOpen(lecture)}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600">
                  <Play className="w-4 h-4" />
                </div>
                Preview
              </div>
            )}

            <span className="text-xs text-gray-500">
              {formatDuration(lecture.videos.duration)}
            </span>
          </div>
        ))}
      <Preview lecture={selectedLecture} open={open} setOpen={setOpen} />
    </>
  );
};

export default AccordionDemo;
