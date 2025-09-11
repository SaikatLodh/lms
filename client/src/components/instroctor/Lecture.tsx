"use client";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useBulkUpload,
  useUploadLecture,
} from "@/hooks/react-query/react-hooks/lecture/lectureHook";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useParams } from "next/navigation";
import LectureCard from "./LectureCard";
import Link from "next/link";

const courseSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(100, "Title must not exceed 100 characters"),
  description: z
    .string()
    .min(10, "Subtitle must be at least 10 characters")
    .max(500, "Subtitle must not exceed 500 characters"),
  freePreview: z.boolean(),
  lectureVideo: z
    .any()
    .refine((file) => file?.length > 0, "Video is required.")
    .refine(
      (file) => file?.[0]?.type?.startsWith("video/"),
      "Must be a video file."
    ),
});

export type CourseSchema = z.infer<typeof courseSchema>;

const Lecture = () => {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const { id } = useParams();
  const [preview, setPreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const form = useForm<CourseSchema>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      freePreview: false,
    },
  });

  const { mutate: uploadLecture, isPending } = useUploadLecture();
  const { mutate: bulkUpload, isPending: isPendingBulk } = useBulkUpload();

  const onSubmit = (data: CourseSchema) => {
    const formData = new FormData();
    formData.append("courseId", id as string);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("freePreview", data.freePreview.toString());
    formData.append("lectureVideo", data.lectureVideo[0]);

    uploadLecture(formData, {
      onSuccess: () => {
        form.reset();
        form.setValue("lectureVideo", null);
        setPreview(null);
      },
    });
  };

  const uploadHandler = async (data: FileList | null) => {
    if (!data) return;
    const formData = new FormData();
    for (let i = 0; i < data?.length; i++) {
      formData.append("lectureVideos", data[i]);
    }
    formData.append("courseId", id as string);

    bulkUpload(formData);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = event.dataTransfer.files;

    // Validate that files are video files
    const videoFiles = Array.from(files).filter((file) =>
      file.type.startsWith("video/")
    );

    if (videoFiles.length === 0) {
      // Show error message for non-video files
      alert("Please drop only video files");
      return;
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <>
      <div className="w-full h-screen rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto instroctor-course">
        <div>
          <div>
            <div className="flex justify-between md:mt-0 mt-5">
              <h2 className="text-xl md:text-2xl font-semibold mb-5">
                Add New Lecture
              </h2>
              <div className="flex gap-2">
                <Link href={`/instructor/announcement/${id}`}>
                  <Button
                    disabled={isPendingBulk}
                    className="border-1 bg-[#6D28D2] text-white hover:bg-[#EDE5F9] hover:text-[#6D28D2] hover:border-1 hover:border-[#6D28D2] cursor-pointer"
                  >
                    Announcement
                  </Button>
                </Link>

                <Button
                  disabled={isPendingBulk}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-1 bg-[#6D28D2] text-white hover:bg-[#EDE5F9] hover:text-[#6D28D2] hover:border-1 hover:border-[#6D28D2] cursor-pointer"
                >
                  {isPendingBulk ? "Uploading..." : " Bulk Upload"}
                </Button>
                <Input
                  type="file"
                  multiple
                  accept="video/*"
                  maxLength={5}
                  onChange={(e) => uploadHandler(e.target.files)}
                  ref={fileInputRef}
                  className="hidden"
                />
              </div>
            </div>

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

                {/* Free Preview Field */}
                <FormField
                  control={form.control}
                  name="freePreview"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Free Preview
                        </FormLabel>
                        <FormDescription>
                          Allow students to preview this lecture for free.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="cursor-pointer"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Lecture Video Field */}
                <FormField
                  control={form.control}
                  name="lectureVideo"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Lecture Video</FormLabel>
                      <FormControl>
                        <div
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          className={`border-2 border-dashed rounded-lg p-4 ${
                            isDragOver ? "border-blue-500" : "border-gray-300"
                          }`}
                        >
                          <Input
                            type="file"
                            accept="video/*"
                            {...fieldProps}
                            onChange={(event) => {
                              onChange(event.target.files);
                              const file = event.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  setPreview(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <p className="mt-3">
                            Drag and drop your video here, or click to select
                          </p>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload the video file for this lecture.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {preview && (
                  <div>
                    <video
                      src={preview}
                      controls
                      className="w-full md:h-[400px] h-[200px] object-cover"
                    />
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={isPending}
                  className="border-1 bg-[#6D28D2] text-white hover:bg-[#EDE5F9] hover:text-[#6D28D2] hover:border-1 hover:border-[#6D28D2] cursor-pointer"
                >
                  {isPending ? "Uploading..." : "Upload Lecture"}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        <div>
          <LectureCard courseId={id as string} />
        </div>
      </div>
    </>
  );
};

export default Lecture;
