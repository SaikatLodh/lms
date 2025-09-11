"use client";
import React from "react";
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
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import AnnounceTable from "./AnnounceTable";
import {
  useCreateAnnouncement,
  useGetAnnouncement,
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

const Announcement = () => {
  const { id } = useParams();
  const { mutate, isPending } = useCreateAnnouncement();
  const { data } = useGetAnnouncement(id as string);
  const form = useForm<announcementSchema>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = (data: announcementSchema) => {
    const addCourseId = { courseId: id as string, ...data };
    mutate(addCourseId, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <>
      <div className="w-full h-screen rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto instroctor-course">
        <div className="md:mt-0 mt-5">
          <h2 className="text-xl md:text-2xl font-semibold mb-5">
            Add Announcement
          </h2>
        </div>
        <div className="md:w-[30%] w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                type="submit"
                disabled={isPending}
                className="border-1 bg-[#6D28D2] text-white hover:bg-[#EDE5F9] hover:text-[#6D28D2] hover:border-1 hover:border-[#6D28D2] cursor-pointer"
              >
                {isPending ? "Creating..." : "Create"}
              </Button>
            </form>
          </Form>
        </div>
        <div className="mt-5">
          <AnnounceTable data={data} />
        </div>
      </div>
    </>
  );
};

export default Announcement;
