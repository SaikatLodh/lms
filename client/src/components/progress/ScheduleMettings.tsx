"use client";
import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import moment from "moment";
import { useCreateSchedule } from "@/hooks/react-query/react-hooks/schedule/sceduleHook";
import { SingleUserCourse } from "@/types";

const schema = z.object({
  date: z.date().refine((val) => val instanceof Date && !isNaN(val.getTime()), {
    message: "Date is required",
  }),
  time: z.string().min(1, "Time is required"),
  reason: z.string().min(1, "Reason is required"),
});

type FormData = z.infer<typeof schema>;

const ScheduleMettings = ({
  getData,
}: {
  getData: SingleUserCourse | undefined;
}) => {
  const [open, setOpen] = React.useState(false);
  const { mutate, isPending } = useCreateSchedule();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const convertData = {
      ...data,
      courseId: getData?._id as string,
      instuctorId: getData?.instructorId as string,
    };
    mutate(convertData, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <>
      <div className="flex gap-4 justify-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="date-picker" className="px-1">
                Date
              </Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date-picker"
                        className="w-32 justify-between font-normal"
                      >
                        {field.value
                          ? field.value.toLocaleDateString()
                          : "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          field.onChange(date);
                          setOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="time-picker" className="px-1">
                Time
              </Label>
              <Input
                type="time"
                id="time-picker"
                step="1"
                {...register("time")}
                defaultValue={moment().format("HH:mm")}
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              {errors.time && (
                <p className="text-red-500 text-sm">{errors.time.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="reason" className="px-1">
                Reason
              </Label>
              <Input
                type="text"
                id="reason"
                {...register("reason")}
                placeholder="Enter reason for the meeting"
              />
              {errors.reason && (
                <p className="text-red-500 text-sm">{errors.reason.message}</p>
              )}
            </div>
          </div>
          <div className="mt-6">
            <Button
              disabled={isPending}
              type="submit"
              className="border-1 bg-[#6D28D2] text-white hover:bg-[#EDE5F9] hover:text-[#6D28D2] hover:border-1 hover:border-[#6D28D2] cursor-pointer"
            >
              {isPending ? "Scheduling..." : "Schedule Meeting"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ScheduleMettings;
