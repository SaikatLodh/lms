import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  useGetSingleAnnouncement,
  useUpdateAnnouncement,
} from "@/hooks/react-query/react-hooks/announcement/announcementHook";

const announcementSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 10 characters")
    .max(100, "Title must not exceed 100 characters"),
  description: z
    .string()
    .min(10, "Subtitle must be at least 10 characters")
    .max(500, "Subtitle must not exceed 500 characters"),
});

export type announcementSchema = z.infer<typeof announcementSchema>;

const EditAnnouncement = ({
  open,
  setOpen,
  announcementId,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  announcementId: string;
}) => {
  const { data } = useGetSingleAnnouncement(announcementId);
  const { mutate, isPending } = useUpdateAnnouncement();

  const form = useForm<announcementSchema>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });
  useEffect(() => {
    form.setValue("title", data?.title as string);
    form.setValue("description", data?.description as string);
  }, [data, form]);
  const onSubmit = (data: announcementSchema) => {
    mutate(
      { announcementId, data },
      {
        onSuccess: () => {
          form.reset();
          setOpen(false);
        },
      }
    );
  };
  console.log(announcementId);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <form>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Announcement</DialogTitle>
              <DialogDescription>
                Make changes to your Announcement here. You can change your
                Course Announcement,
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {/* Title Field */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter course title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description Field */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter course description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    disabled={isPending}
                    type="submit"
                    className="border-1 bg-[#6D28D2] text-white hover:bg-[#EDE5F9] hover:text-[#6D28D2] hover:border-1 hover:border-[#6D28D2] cursor-pointer"
                  >
                    {isPending ? "Updating..." : "Update"}
                  </Button>
                </form>
              </Form>
            </div>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
};

export default EditAnnouncement;
