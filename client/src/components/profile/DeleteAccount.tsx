import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDeleteAccount } from "@/hooks/react-query/react-hooks/user/userHook";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const schema = z.object({
  email: z.string().email().nonempty("Email is required"),
});

const DeleteAccount = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { mutate: deleteAccount, isPending } = useDeleteAccount();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: { email: string }) => {
    if (data.email === user?.email) {
      deleteAccount();
    } else {
      toast.error("Email does not match the registered email.");
    }
  };

  return (
    <div className="max-w-md m-auto min-h-[270px] flex justify-center items-center">
      <div className="w-full">
        <h2 className="text-lg font-bold">Delete Account</h2>
        <p className="text-gray-600 mt-2">
          Are you sure you want to delete your account? This action cannot be
          undone.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <Input
            type="email"
            placeholder={`Type ${user?.email} here...`}
            {...register("email")}
            className="mb-2"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
          <Button
            type="submit"
            variant="destructive"
            className="mt-2 cursor-pointer"
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete Account"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default DeleteAccount;
