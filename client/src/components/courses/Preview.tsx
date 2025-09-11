import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Lecture } from "@/types";
import ReactPlayer from "react-player";
const Preview = ({
  lecture,
  open,
  setOpen,
}: {
  lecture: Lecture | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full">
          <ReactPlayer
            src={lecture?.videos.url}
            autoPlay={true}
            controls={true}
            width="100%"
            height="100%"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Preview;
