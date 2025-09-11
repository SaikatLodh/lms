import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGlobalHooks } from "@/hooks/globalHook";
import { logout } from "@/store/auth/authSlice";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";

const Logout = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { queryClient } = useGlobalHooks();
  const logoutHandler = () => {
    dispatch(logout());
    queryClient.removeQueries();
    setOpen(false);
    window.location.href = "/user/home";
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] z-[100]">
          <DialogHeader>
            <DialogTitle className="text-center">
              Do you really want to log out?
            </DialogTitle>
          </DialogHeader>
          <Button
            onClick={logoutHandler}
            className="w-full bg-red-600 mt-3 cursor-pointer"
          >
            Log out
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Logout;
