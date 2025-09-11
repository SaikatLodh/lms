"use client";
import React, { useState } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  LayoutDashboard,
  LogOut,
  ShoppingCart,
  User,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Link from "next/link";
import { useUserCart } from "@/hooks/react-query/react-hooks/cart/cartHook";
import { useUserWishlist } from "@/hooks/react-query/react-hooks/wishlist/wishListHook";
import { usePathname } from "next/navigation";
import Logout from "./Logout";
import NotificationDemo from "./Notification";

const NavbarComponent = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const navItems = [
    {
      name: "Courses",
      link: "/user/courses",
    },
    {
      name: "AI Search",
      link: "/user/ai-search",
    },
    {
      name: "Contact Support",
      link: "/user/contact",
    },
  ];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data } = useUserCart();
  const { data: wishlist } = useUserWishlist();

  const location = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="relative w-full">
        {!location.startsWith("/meeting") &&
        !location.startsWith("/instructor") ? (
          <Navbar>
            {/* Desktop Navigation */}
            <NavBody>
              <Link href="/user/home">
                {" "}
                <NavbarLogo />
              </Link>
              <NavItems
                items={navItems}
                isAuthenticated={isAuthenticated}
                user={user}
              />
              <div className="flex items-center gap-4">
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center ">
                      <Link href="/user/wishlist">
                        <NavbarButton
                          variant="secondary"
                          className="px-2 relative"
                        >
                          {wishlist && wishlist?.length > 0 && (
                            <div className="absolute top-[-3px] right-0 w-5 h-5 bg-[#A435F0] text-white rounded-full">
                              {wishlist?.length}
                            </div>
                          )}
                          <Heart width={20} height={20} />
                        </NavbarButton>
                      </Link>
                      <Link href="/user/cart">
                        <NavbarButton
                          variant="secondary"
                          className="px-2 relative"
                        >
                          {data && data?.length > 0 && (
                            <div className="absolute top-[-3px] right-0 w-5 h-5 bg-[#A435F0] text-white rounded-full">
                              {data?.length}
                            </div>
                          )}
                          <ShoppingCart width={20} height={20} />
                        </NavbarButton>
                      </Link>
                      <NavbarButton
                        variant="secondary"
                        className="px-2 relative"
                      >
                        <NotificationDemo />
                      </NavbarButton>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger className="focus:outline-none focus:ring-[2px] focus:ring-offset-2 focus:ring-primary rounded-full cursor-pointer">
                        <Avatar>
                          <AvatarImage
                            src={
                              user.profilePicture?.url ||
                              user.gooleavatar ||
                              user.faceBookavatar
                            }
                            alt="@shadcn"
                            className="object-cover"
                          />
                          <AvatarFallback>
                            {user?.fullName?.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {" "}
                        <DropdownMenuLabel className="cursor-pointer">
                          My Account
                        </DropdownMenuLabel>{" "}
                        <DropdownMenuSeparator />
                        <Link href="/user/profile">
                          <DropdownMenuItem className="cursor-pointer">
                            <User className="h-4 w-4" /> Profile
                          </DropdownMenuItem>
                        </Link>
                        {user?.role === "instructor" && (
                          <Link href="/instructor">
                            <DropdownMenuItem className="cursor-pointer">
                              <LayoutDashboard className="h-4 w-4" /> Dashboard
                            </DropdownMenuItem>
                          </Link>
                        )}
                        <DropdownMenuItem
                          className="text-destructive cursor-pointer"
                          onClick={() => setIsOpen(true)}
                        >
                          <LogOut className="h-4 w-4" /> Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <>
                    <Link href="/log-in">
                      <NavbarButton variant="secondary">Login</NavbarButton>
                    </Link>
                    <Link href="/send-mail">
                      {" "}
                      <NavbarButton variant="secondary">
                        Sign Up
                      </NavbarButton>{" "}
                    </Link>
                  </>
                )}
              </div>
            </NavBody>

            {/* Mobile Navigation */}
            <MobileNav>
              <MobileNavHeader>
                <Link href="/user/home">
                  <NavbarLogo />
                </Link>
                <MobileNavToggle
                  isOpen={isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
              </MobileNavHeader>

              <MobileNavMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
              >
                {navItems.map((item, idx) => (
                  <Link
                    key={`mobile-link-${idx}`}
                    href={item.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="relative text-neutral-600 dark:text-neutral-300"
                  >
                    <span className="block">{item.name}</span>
                  </Link>
                ))}
                <div className="flex w-full flex-col gap-4">
                  {!user && !isAuthenticated && (
                    <>
                      <NavbarButton
                        onClick={() => setIsMobileMenuOpen(false)}
                        variant="primary"
                        className="w-full"
                      >
                        Login
                      </NavbarButton>

                      <NavbarButton
                        onClick={() => setIsMobileMenuOpen(false)}
                        variant="primary"
                        className="w-full"
                      >
                        Sign Up
                      </NavbarButton>
                    </>
                  )}

                  {user && isAuthenticated ? (
                    <>
                      <Link
                        href="/user/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="relative text-neutral-600 dark:text-neutral-300"
                      >
                        Profile
                      </Link>
                      {user?.role === "instructor" && (
                        <Link
                          href="/instructor"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="relative text-neutral-600 dark:text-neutral-300"
                        >
                          Dashboard
                        </Link>
                      )}

                      <Link
                        href="/user/wishlist"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="px-2 relative">
                          {wishlist && wishlist?.length > 0 && (
                            <div className="absolute top-[-3px] right-0 md:w-5 mdh-5 w-7 h-7 bg-[#A435F0] text-white rounded-full flex justify-center items-center">
                              {wishlist?.length}
                            </div>
                          )}
                          <Heart width={20} height={20} />
                        </div>
                      </Link>
                      <Link
                        href="/user/cart"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="px-2 relative">
                          {data && data?.length > 0 && (
                            <div className="absolute top-[-3px] right-0 md:w-5 md:h-5 w-7 h-7 bg-[#A435F0] text-white rounded-full flex justify-center items-center">
                              {data?.length}
                            </div>
                          )}
                          <ShoppingCart width={20} height={20} />
                        </div>
                      </Link>

                      <div className="px-2 relative cursor-pointer">
                        <NotificationDemo />
                      </div>

                      <div
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsOpen(true);
                        }}
                        className="relative text-neutral-600 dark:text-neutral-300 cursor-pointer"
                      >
                        Logout
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </MobileNavMenu>
            </MobileNav>
          </Navbar>
        ) : (
          ""
        )}
        <Logout open={isOpen} setOpen={setIsOpen} />
      </div>
    </>
  );
};

export default NavbarComponent;
