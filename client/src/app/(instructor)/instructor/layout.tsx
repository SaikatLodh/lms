"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconBrandTabler } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  ClipboardClock,
  GraduationCap,
  LogOut,
  ShoppingCart,
  User,
} from "lucide-react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Logout from "@/components/Logout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [open, setOpen] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const links = [
    {
      label: "Dashboard",
      href: "/instructor",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Create Courses",
      href: "/instructor/create-course",
      icon: (
        <GraduationCap className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Meetings",
      href: "/instructor/meetings",
      icon: (
        <ClipboardClock className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "My Courses",
      href: "/instructor/courses",
      icon: (
        <BookOpen className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "My Orders",
      href: "/instructor/orders",
      icon: (
        <ShoppingCart className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  return (
    <>
      <div
        className={cn(
          "mx-auto flex w-full flex-1 flex-col  rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
          "h-[100vh]" // for your use case, use `h-screen` instead of `h-[60vh]`
        )}
      >
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
            <div>
              <SidebarLink
                link={{
                  label: user?.fullName || "User",
                  href: "#",
                  icon: (
                    <Avatar>
                      <AvatarImage
                        src={
                          user?.profilePicture?.url ||
                          user?.gooleavatar ||
                          user?.faceBookavatar ||
                          ""
                        }
                        alt="@shadcn"
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {user?.fullName.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                  ),
                }}
              />
              <Link href="/user/profile">
                <div className="pl-2 flex gap-4  mb-2">
                  {" "}
                  <User className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />{" "}
                  <h6 className="text-neutral-700 dark:text-neutral-200 text-md group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0">
                    Profile
                  </h6>
                </div>
              </Link>

              <div
                className="pl-2 flex gap-4 cursor-pointer items-center"
                onClick={() => setOpenLogout(true)}
              >
                {" "}
                <LogOut className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />{" "}
                <h6 className=" dark:text-neutral-200 text-md group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0 text-[#e7000b]">
                  Logout
                </h6>
              </div>
            </div>
          </SidebarBody>
          <Logout open={openLogout} setOpen={setOpenLogout} />
        </Sidebar>
        {children}
      </div>
    </>
  );
};

export const Logo = () => {
  return (
    <>
      <Link href="/user/home">
        <div className="relative z-20 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black">
          <img
            src="https://assets.aceternity.com/logo-dark.png"
            alt="logo"
            width={30}
            height={30}
          />
          <span className="font-medium text-black dark:text-white">
            LMS Academy
          </span>
        </div>
      </Link>
    </>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="/user/home"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <img
        src="https://assets.aceternity.com/logo-dark.png"
        alt="logo"
        width={30}
        height={30}
      />
    </Link>
  );
};

// Dummy dashboard component with content

export default Layout;
