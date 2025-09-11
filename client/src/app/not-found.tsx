"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="text-9xl font-extrabold text-gray-900 dark:text-gray-100">
        404
      </h1>
      <h2 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Page Not Found
      </h2>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
        The page you are looking for does not exist.
      </p>
      <Link href="/" >
        <Button className="mt-6 cursor-pointer">Go Back to Homepage</Button>
      </Link>
    </div>
  );
}