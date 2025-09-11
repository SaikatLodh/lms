"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateContact } from "@/hooks/react-query/react-hooks/contactsupport/contactSupport";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(2, {
      message: "Full name must be at least 2 characters.",
    })
    .max(50, {
      message: "Full name must be less than 50 characters.",
    }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  number: z
    .string()
    .min(10, {
      message: "Phone number must be at least 10 digits.",
    })
    .max(10, {
      message: "Phone number must be exactly 10 digits.",
    })
    .regex(/^\d+$/, {
      message: "Phone number must contain only digits.",
    }),
  subject: z
    .string()
    .min(5, {
      message: "Subject must be at least 5 characters.",
    })
    .max(100, {
      message: "Subject must be less than 100 characters.",
    }),
  message: z
    .string()
    .min(10, {
      message: "Message must be at least 10 characters.",
    })
    .max(500, {
      message: "Message must be less than 500 characters.",
    }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const { mutate, isPending } = useCreateContact();
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: user?.email || "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    const submitData = {
      ...data,
      number: parseInt(data.number, 10),
    };

    mutate(submitData, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <>
      <div className="flex justify-center items-center mt-20">
        <div className="bg-white shadow-lg rounded-2xl md:p-8 p-6 max-w-lg w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Contact Support
          </h1>
          <p className="text-gray-600 mb-6 text-center">
            Need help? Reach out to our support team at
            <span className="font-semibold pl-1">LMS ACADEMY</span>. We’ll get
            back to you as soon as possible.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                {...register("fullName")}
                type="text"
                placeholder="Enter your name"
                className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 ${
                  errors.fullName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
                disabled
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                {...register("number")}
                type="tel"
                placeholder="Enter your phone number"
                className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 ${
                  errors.number
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
              />
              {errors.number && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.number.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                {...register("subject")}
                type="text"
                placeholder="Issue subject"
                className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 ${
                  errors.subject
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                {...register("message")}
                rows={4}
                placeholder="Describe your issue..."
                className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 ${
                  errors.message
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
              ></textarea>
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.message.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`w-full py-3 rounded-lg font-medium transition border-1 bg-[#6D28D2] text-white hover:bg-[#EDE5F9] hover:text-[#6D28D2] hover:border-1 hover:border-[#6D28D2] cursor-pointer`}
            >
              {isPending ? "Sending..." : "Submit Request"}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-600 text-sm">
            <p className="md:text-[17px] text-[15px]">
              Or email us directly at
              <a
                href="mailto:owner@yopmail.com"
                className="text-blue-600 font-semibold pl-1"
              >
                owner@yopmail.com
              </a>
            </p>
            <p className="mt-1 md:text-[17px] text-[15px]">
              Call us: <span className="font-semibold">+91 82403880102</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
