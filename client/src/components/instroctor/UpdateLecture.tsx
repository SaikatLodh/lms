"use client";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  usePreViewLecture,
  useSingelLecture,
  useUpdateLecture,
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
import { useParams, useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Switch } from "@/components/ui/switch";
const lectureSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(100, "Title must not exceed 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  lectureVideo: z
    .any()
    .refine(
      (file) =>
        !file || file.length === 0 || file?.[0]?.type?.startsWith("video/"),
      "Must be a video file."
    )
    .optional()
    .nullable(),
});

export type LectureSchema = z.infer<typeof lectureSchema>;

const UpdateLecture = () => {
  const { id } = useParams();
  const { data: lectureData } = useSingelLecture(id as string);
  const [preview, setPreview] = React.useState<string | null>(null);
  const router = useRouter();
  const form = useForm<LectureSchema>({
    resolver: zodResolver(lectureSchema),
    defaultValues: {
      title: "",
      description: "",
      lectureVideo: null,
    },
  });

  React.useEffect(() => {
    if (lectureData) {
      form.setValue("title", lectureData.title);
      form.setValue("description", lectureData.description);
      if (lectureData.videos?.url) {
        setPreview(lectureData.videos.url);
      }
    }
  }, [lectureData, form]);

  const { mutate: updateLecture, isPending } = useUpdateLecture();
  const { mutate: publish, isPending: isPublishPending } = usePreViewLecture();

  const onSubmit = (data: LectureSchema) => {
    if (!lectureData) return;
    const formData = new FormData();
    formData.append("lectureId", id as string);
    formData.append("courseId", lectureData?.courseId as string);
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data.lectureVideo?.[0]) {
      formData.append("lectureVideo", data.lectureVideo[0]);
    }

    updateLecture(formData, {
      onSuccess: () => {
        form.reset();
        setPreview(null);
        router.push(`/instructor/lecture/${lectureData?.courseId}`);
      },
    });
  };

  const handlePublishToggle = () => {
    publish(id as string);
  };

  return (
    <>
      <div className="w-full h-screen rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto instroctor-course">
        <div className="md:w-[80%] w-full m-auto md:mt-0 mt-5">
          <h2 className="text-2xl font-semibold mb-5">Update Lecture</h2>
          <div className="flex justify-end">
            <div className="flex items-center gap-3">
              <Switch
                id="enable-feature"
                checked={lectureData?.freePreview}
                onCheckedChange={handlePublishToggle}
                disabled={!lectureData || isPublishPending}
                className="cursor-pointer"
              />
              <Label htmlFor="publish-course">
                {lectureData?.freePreview ? "Preview" : "Not Previewe"}
              </Label>
            </div>
          </div>
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

              {/* Lecture Video Field */}
              <FormField
                control={form.control}
                name="lectureVideo"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Lecture Video</FormLabel>
                    <FormControl>
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
                    </FormControl>
                    <FormDescription>
                      Update the video file for this lecture (optional).
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
                    className="w-full h-[400px] object-cover"
                  />
                </div>
              )}
              <Button
                type="submit"
                disabled={isPending}
                className="border-1 bg-[#6D28D2] text-white hover:bg-[#EDE5F9] hover:text-[#6D28D2] hover:border-1 hover:border-[#6D28D2] cursor-pointer"
              >
                {isPending ? "Updating..." : "Update Lecture"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default UpdateLecture;
