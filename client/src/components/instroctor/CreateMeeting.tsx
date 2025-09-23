import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Schedule, SingleUserCourse } from "@/types";
import { useCreateMeeting } from "@/hooks/react-query/react-hooks/meeting/meetingHook";
const schema = z.object({
  meetingName: z.string().min(1, "Meeting name is required"),
  duration: z.enum(
    ["15m", "30m", "1h", "2h"],
    "Duration must be one of 15m, 30m, 1h, 2h"
  ),
});
type FormData = z.infer<typeof schema>;

const CreateMeeting = ({
  openCreateMeeting,
  setOpenCreateMeeting,
  schedule,
}: {
  openCreateMeeting: boolean;
  setOpenCreateMeeting: React.Dispatch<React.SetStateAction<boolean>>;
  schedule: Schedule | null;
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const { mutate, isPending } = useCreateMeeting();

  const onSubmit = (data: FormData) => {
    const durationMap: Record<string, number> = {
      "15m": 15,
      "30m": 30,
      "1h": 60,
      "2h": 120,
    };
    const dataToSend = {
      ...data,
      duration: durationMap[data.duration],
      courseId: schedule && schedule.courseId,
      userId: schedule && schedule.userId,
      scheduleId: schedule && schedule._id,
      date: schedule && schedule.date,
      startTime: schedule && schedule.time,
    };

    mutate(dataToSend, {
      onSuccess: () => {
        setOpenCreateMeeting(false);
      },
    });
  };
  return (
    <>
      <Dialog open={openCreateMeeting} onOpenChange={setOpenCreateMeeting}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{"Create Meeting"}</DialogTitle>
            <DialogDescription>{"Create a new meeting."}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-2 py-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex justify-between gap-4  md:flex-nowrap flex-wrap">
                <div className="flex flex-col gap-3 md:w-fit w-full">
                  <Label htmlFor="meetingName" className="px-1">
                    Meeting Name
                  </Label>
                  <Input
                    type="text"
                    id="meetingName"
                    {...register("meetingName")}
                    placeholder="Enter meeting name"
                  />
                  {errors.meetingName && (
                    <p className="text-red-500 text-sm">
                      {errors.meetingName.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-3 md:w-fit w-full">
                  <Label htmlFor="duration" className="px-1">
                    Duration
                  </Label>
                  <Controller
                    control={control}
                    name="duration"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue="15m"
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15m">15m</SelectItem>
                          <SelectItem value="30m">30m</SelectItem>
                          <SelectItem value="1h">1h</SelectItem>
                          <SelectItem value="2h">2h</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.duration && (
                    <p className="text-red-500 text-sm">
                      {errors.duration.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-6">
                <Button
                  disabled={isPending}
                  type="submit"
                  className="border-1 bg-[#6D28D2] text-white hover:bg-[#EDE5F9] hover:text-[#6D28D2] hover:border-1 hover:border-[#6D28D2] cursor-pointer"
                >
                  {isPending ? "Creating..." : "Create Meeting"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateMeeting;
