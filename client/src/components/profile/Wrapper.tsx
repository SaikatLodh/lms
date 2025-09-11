"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WishList from "@/components/wishlist/WishList";
import LetsLearning from "../home/LetsLearning";
import UpdateAccount from "./UpdateAccount";
import ChangePassword from "./ChangePassword";
import DeleteAccount from "./DeleteAccount";
import UserMeetings from "./UserMeetings";
const Wrapper = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <>
      <div className="bg-[#F2EFFF] h-[350px] w-full">
        <div className="max-w-7xl m-auto flex items-center h-full">
          <div className="md:px-0 px-5">
            <h5 className="text-2xl font-bold">
              {user?.role === "user" ? "LEARNER" : "INSTRUCTOR"}
            </h5>
            <h3 className="text-4xl font-bold mt-3">{user?.fullName}</h3>
          </div>
        </div>
      </div>

      <div className="max-w-7xl m-auto mt-10 flex min-h-[370px]">
        <Tabs defaultValue="Learning" className="w-full flex-1  min-h-[370px]">
          <TabsList
            className={`w-full grid grid-cols-2 sm:grid-cols-2 ${
              user?.role === "user" ? "md:grid-cols-6" : "md:grid-cols-5"
            } gap-2`}
          >
            <TabsTrigger
              value="Learning"
              className="cursor-pointer text-sm sm:text-base truncate md:h-full h-[30px]"
            >
              Learning
            </TabsTrigger>
            <TabsTrigger
              value="Wishlist"
              className="cursor-pointer text-sm sm:text-base truncate md:h-full h-[30px]"
            >
              Wishlist
            </TabsTrigger>
            <TabsTrigger
              value="Editeprofile"
              className="cursor-pointer text-sm sm:text-base truncate md:h-full h-[30px]"
            >
              Edite Profile
            </TabsTrigger>
            <TabsTrigger
              value="Changepassword"
              className="cursor-pointer text-sm sm:text-base truncate md:h-full h-[30px]"
            >
              Change Password
            </TabsTrigger>
            {user?.role === "user" && (
              <TabsTrigger
                value="Meetings"
                className="cursor-pointer text-sm sm:text-base truncate md:h-full h-[30px]"
              >
                Meetings
              </TabsTrigger>
            )}
            <TabsTrigger
              value="DeleteAccount"
              className="cursor-pointer text-sm sm:text-base truncate md:h-full h-[30px]"
            >
              Delete Account
            </TabsTrigger>
          </TabsList>
          <div className="md:mt-2 mt-15 p-4 border rounded-md">
            <TabsContent value="Learning">
              <LetsLearning />
            </TabsContent>
            <TabsContent value="Wishlist">
              <WishList />
            </TabsContent>
            <TabsContent value="Editeprofile">
              <UpdateAccount />
            </TabsContent>
            <TabsContent value="Changepassword">
              <ChangePassword />
            </TabsContent>
            {user?.role === "user" && (
              <TabsContent value="Meetings" className="h-full">
                <UserMeetings />
              </TabsContent>
            )}
            <TabsContent value="DeleteAccount" className="h-full">
              <DeleteAccount />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default Wrapper;
