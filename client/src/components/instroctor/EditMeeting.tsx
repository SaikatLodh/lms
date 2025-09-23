import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import moment from "moment";
import React, { useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  useSingleSchedule,
  useUpdateSchedule,
} from "@/hooks/react-query/react-hooks/schedule/sceduleHook";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
const schema = z.object({
  date: z.date().refine((val) => val instanceof Date && !isNaN(val.getTime()), {
    message: "Date is required",
  }),
  time: z.string().min(1, "Time is required"),
  status: z.string().optional(),
  reason: z.string().optional(),
});
type FormData = z.infer<typeof schema>;
const EditMeeting = ({
  openCreate,
  setOpenCreate,
  id,
}: {
  openCreate: boolean;
  setOpenCreate: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const { user } = useSelector((state: RootState) => state.auth);
  const { data } = useSingleSchedule(id);
  const { mutate, isPending } = useUpdateSchedule();

  const onSubmit = (data: FormData) => {
    mutate(
      {
        data,
        scheduleId: id,
      },
      {
        onSuccess: () => {
          setOpenCreate(false);
        },
      }
    );
  };

  useEffect(() => {
    if (data) {
      setValue("reason", data.reason);
      setValue("date", new Date(data.date));
      setValue("time", data.time);
      setValue("status", data.status);
    }
  }, [data, setValue]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);
  return (
    <>
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{"Edit meeting"}</DialogTitle>
            <DialogDescription>
              {"Update the meeting details."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2 py-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex justify-between gap-4  md:flex-nowrap flex-wrap">
                {user?.role === "user" && (
                  <div className="flex flex-col gap-3 md:w-fit w-full">
                    <Label htmlFor="time-picker" className="px-1">
                      Reason
                    </Label>
                    <Input
                      type="text"
                      {...register("reason")}
                      defaultValue={moment().format("HH:mm")}
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                    {errors.reason && (
                      <p className="text-red-500 text-sm">
                        {errors.reason.message}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-3 md:w-fit w-full">
                  <Label htmlFor="date-picker" className="px-1">
                    Date
                  </Label>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            id="date-picker"
                            className=" justify-between font-normal"
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
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm">
                      {errors.date.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-3 md:w-fit w-full">
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
                    <p className="text-red-500 text-sm">
                      {errors.time.message}
                    </p>
                  )}
                </div>
                {user?.role === "instructor" && (
                  <div className="flex flex-col gap-3 md:w-fit w-full">
                    <Label htmlFor="status-select" className="px-1">
                      Status
                    </Label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Waiting">Waiting</SelectItem>
                            <SelectItem value="Scheduled">Scheduled</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.status && (
                      <p className="text-red-500 text-sm">
                        {errors.status.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="mt-6">
                <Button
                  disabled={isPending}
                  type="submit"
                  className="border-1 bg-[#6D28D2] text-white hover:bg-[#EDE5F9] hover:text-[#6D28D2] hover:border-1 hover:border-[#6D28D2] cursor-pointer"
                >
                  {isPending ? "Updating..." : " Update Meeting"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditMeeting;
