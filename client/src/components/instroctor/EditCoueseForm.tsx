"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import {
  usePublishCourse,
  useSingleInstructorCourse,
  useUpdateCourse,
} from "@/hooks/react-query/react-hooks/courses/coursesHook";
import { useParams, useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
const formSchema = z.object({
  courseId: z.string(),
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(100, "Title must not exceed 100 characters"),
  category: z.string().min(1, "Please select a category"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  primaryLanguage: z.string().min(1, "Please select a language"),
  subtitle: z
    .string()
    .min(5, "Subtitle must be at least 5 characters")
    .max(100, "Subtitle must not exceed 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  welcomeMessage: z
    .string()
    .min(10, "Welcome message must be at least 10 characters")
    .max(500, "Welcome message must not exceed 500 characters"),
  pricing: z.number().min(0, "Price cannot be negative"),
  courseImage: z
    .instanceof(FileList)
    .refine(
      (files) => files?.[0]?.size <= 2 * 1024 * 1024,
      "Image size should be less than 2MB"
    )
    .refine(
      (files) =>
        ["image/jpeg", "image/jpg", "image/png"].includes(files?.[0]?.type),
      "Only .jpg, .jpeg, and .png files are accepted"
    )
    .optional()
    .nullable(),
});

type FormValues = z.infer<typeof formSchema>;

const categories = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "DevOps",
  "Cloud Computing",
  "UI/UX Design",
  "Game Development",
  "Cybersecurity",
  "Artificial Intelligence",
  "Blockchain",
];

const languages = ["English", "Hindi", "Spanish", "French", "German"];

const EditCoueseForm = () => {
  const { id } = useParams();
  const { data } = useSingleInstructorCourse(id as string);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { mutate, isPending } = useUpdateCourse();
  const { mutate: publish, isPending: isPublishPending } = usePublishCourse();

  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: id as string,
      title: "",
      category: "",
      level: "beginner",
      primaryLanguage: "",
      subtitle: "",
      description: "",
      welcomeMessage: "",
      pricing: 0,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        courseId: id as string,
        title: data.title,
        category: data.category,
        level: data.level as "beginner" | "intermediate" | "advanced",
        primaryLanguage: data.primaryLanguage,
        subtitle: data.subtitle,
        description: data.description,
        welcomeMessage: data.welcomeMessage,
        pricing: data.pricing,
      });

      if (data.image?.url) {
        setPreviewImage(data.image.url);
      }
    }
  }, [data, form, id]);

  const onSubmit = (data: FormValues) => {
    const formdata = new FormData();
    formdata.append("courseId", data.courseId);
    formdata.append("title", data.title);
    formdata.append("category", data.category);
    formdata.append("level", data.level.toLowerCase());
    formdata.append("primaryLanguage", data.primaryLanguage);
    formdata.append("subtitle", data.subtitle);
    formdata.append("description", data.description);
    formdata.append("welcomeMessage", data.welcomeMessage);
    formdata.append("pricing", data.pricing.toString());
    if (data.courseImage?.[0]) {
      formdata.append("courseImage", data.courseImage[0]);
    }

    mutate(formdata, {
      onSuccess: () => {
        form.reset();
        setPreviewImage(null);
        router.push("/instructor/create-course");
      },
    });
  };

  const handlePublishToggle = () => {
    publish({ courseId: id as string, isPublised: !data?.isPublised });
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLLabelElement>,
    onChange: (files: FileList) => void
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];

      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        form.setError("courseImage", {
          type: "manual",
          message: "Only .jpg, .jpeg, and .png files are accepted",
        });
        return;
      }

      // Validate file size
      if (file.size > 2 * 1024 * 1024) {
        form.setError("courseImage", {
          type: "manual",
          message: "Image size should be less than 2MB",
        });
        return;
      }

      // Create a new FileList-like object
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const fileList = dataTransfer.files;

      onChange(fileList);
      setPreviewImage(URL.createObjectURL(file));
      form.clearErrors("courseImage");
    }
  };

  return (
    <>
      <div className="w-full h-screen  rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto instroctor-course">
        <div className="md:w-[80%] w-full m-auto md:mt-0 mt-5">
          <div className="text-2xl font-bold mb-8">
            <h2> Create Course</h2>
          </div>
          <div className="flex justify-end">
            <div className="flex items-center gap-3">
              <Switch
                id="enable-feature"
                checked={data?.isPublised}
                onCheckedChange={handlePublishToggle}
                disabled={!data || isPublishPending}
                className="cursor-pointer"
              />
              <Label htmlFor="publish-course">
                {data?.isPublised ? "Published" : "Publish Course"}
              </Label>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter course title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="primaryLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Language</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language} value={language}>
                            {language}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter course subtitle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter course description"
                        className="h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="welcomeMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Welcome Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter welcome message"
                        className="h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pricing"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter course price"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="courseImage"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Course Image</FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="dropzone-file"
                          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                            isDragging
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                          }`}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, onChange)}
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {previewImage ? (
                              <img
                                src={previewImage}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-lg mb-4"
                              />
                            ) : (
                              <Upload className="w-10 h-10 mb-3 text-gray-400" />
                            )}
                            <p className="mb-2 text-sm text-gray-500">
                              {isDragging ? (
                                <span className="font-semibold text-blue-500">
                                  Drop the image here
                                </span>
                              ) : (
                                <>
                                  <span className="font-semibold">
                                    Click to upload
                                  </span>{" "}
                                  or drag and drop
                                </>
                              )}
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG or JPEG (MAX. 2MB)
                            </p>
                          </div>
                          <input
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files?.length) {
                                onChange(files);
                                setPreviewImage(URL.createObjectURL(files[0]));
                              }
                            }}
                            {...field}
                          />
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isPending}
                className="w-full border-1 bg-[#6D28D2] text-white hover:bg-[#EDE5F9] hover:text-[#6D28D2] hover:border-1 hover:border-[#6D28D2] cursor-pointer"
              >
                {isPending ? "Uploading...." : "Update Course"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default EditCoueseForm;
