"use client";

import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, ImageIcon } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useUpdateUser } from "@/hooks/react-query/react-hooks/user/userHook";

const formSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name must not exceed 50 characters"),
  email: z.string().email("Invalid email address"),
  profilePicture: z
    .instanceof(FileList)
    .refine((files) => files?.length === 1, "Profile picture is required")
    .refine(
      (files) => files?.[0]?.size <= 2 * 1024 * 1024,
      "File size should be less than 2MB"
    )
    .refine(
      (files) =>
        ["image/jpeg", "image/jpg", "image/png"].includes(files?.[0]?.type),
      "Only .jpg, .jpeg, and .png files are accepted"
    )
    .nullable(),
});

type FormValues = z.infer<typeof formSchema>;

export default function UpdateAccount() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isDragOver, setIsDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      profilePicture: null,
    },
  });
  const { mutate, isPending } = useUpdateUser();
  const onSubmit = (data: FormValues) => {
    const fordata = new FormData();
    fordata.append("fullName", data.fullName);
    if (data.profilePicture)
      fordata.append("profilePicture", data.profilePicture[0]);
    mutate(fordata);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only set drag over to false if we're leaving the drop zone entirely
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, onChange: (files: FileList | null) => void) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        onChange(files);
      }
    },
    []
  );

  // Handle image preview generation
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "profilePicture") {
        const profilePicture = value.profilePicture;

        if (profilePicture && profilePicture.length > 0) {
          const file = profilePicture[0];
          const objectUrl = URL.createObjectURL(file);
          setImagePreview(objectUrl);
        } else {
          setImagePreview(null);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <Card className="w-full max-w-md m-auto my-5">
      <CardHeader>
        <CardTitle>Update Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              disabled
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {user?.faceBookavatar || user?.gooleavatar ? (
              <></>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="profilePicture"
                  disabled={
                    user?.faceBookavatar || user?.gooleavatar ? true : false
                  }
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel>Profile Picture</FormLabel>
                      <FormControl>
                        <div className="flex items-center justify-center w-full">
                          <label
                            htmlFor="dropzone-file"
                            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                              isDragOver
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                            }`}
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, onChange)}
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              {imagePreview ? (
                                <div className="flex flex-col items-center">
                                  <img
                                    src={imagePreview}
                                    alt="Profile preview"
                                    className="w-32 h-32 mb-3 rounded-full object-cover border-2 border-blue-500"
                                  />
                                  <p className="mb-2 text-sm text-gray-600 font-medium">
                                    {value?.[0]?.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Click to change or drag a new file
                                  </p>
                                </div>
                              ) : value?.[0] ? (
                                <div className="flex flex-col items-center">
                                  <ImageIcon className="w-10 h-10 mb-3 text-blue-500" />
                                  <p className="mb-2 text-sm text-gray-600 font-medium">
                                    {value[0].name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Click to change or drag a new file
                                  </p>
                                </div>
                              ) : (
                                <>
                                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                  <p className="mb-2 text-sm text-gray-500">
                                    {isDragOver ? (
                                      <span className="font-semibold text-blue-600">
                                        Drop to upload
                                      </span>
                                    ) : (
                                      <span>
                                        <span className="font-semibold">
                                          Click to upload
                                        </span>{" "}
                                        or drag and drop
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    PNG, JPG or JPEG (MAX. 2MB)
                                  </p>
                                </>
                              )}
                            </div>
                            <input
                              {...field}
                              id="dropzone-file"
                              type="file"
                              className="hidden"
                              accept="image/png, image/jpeg, image/jpg"
                              onChange={(e) => onChange(e.target.files)}
                            />
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isPending}
            >
              {isPending ? "Updating..." : "Update"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
