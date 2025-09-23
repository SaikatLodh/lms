import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Schedule } from "@/types";
import { useUpdateSchedule } from "@/hooks/react-query/react-hooks/schedule/sceduleHook";

const ScheduleCalcel = ({
  open,
  setOpen,
  id,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}) => {
  const { mutate, isPending } = useUpdateSchedule();

  const handleCancel = () => {
    const data = {
      status: "Cancelled",
    };
    mutate(
      { data, scheduleId: id },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{"Cancel meeting"}</DialogTitle>
            <DialogDescription>
              {"Do you really want to cancel this meeting ?"}
            </DialogDescription>
          </DialogHeader>
          <Button
            disabled={isPending}
            onClick={handleCancel}
            className="w-full bg-red-600 mt-3 cursor-pointer"
          >
            {isPending ? "Cancelling..." : "Cancel"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScheduleCalcel;
