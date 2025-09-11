import { SingleUserCourse } from "@/types";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flag, Megaphone } from "lucide-react";
import moment from "moment";
const Announcement = ({
  getData,
}: {
  getData: SingleUserCourse | undefined;
}) => {
  return (
    <>
      <div className="max-w-xl mx-auto min-h-[100px]">
        {getData && getData?.announcements.length > 0 ? (
          getData?.announcements.map((item) => {
            return (
              <>
                <div key={item._id} className="mb-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage
                            src={
                              item.lecturer.profilePicture?.url ||
                              item.lecturer.gooleavatar ||
                              item.lecturer.faceBookavatar
                            }
                            alt="Hitesh"
                          />
                          <AvatarFallback>
                            {item.lecturer.fullName.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold">
                            {item.lecturer.fullName}
                          </p>
                          <div className="flex gap-2 items-center">
                            <p className="text-xs text-muted-foreground">
                              posted an announcement •{" "}
                              {moment(item.createdAt).fromNow()} ago
                            </p>
                            <Flag width={16} />
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-2xl font-bold mb-4">
                        {item.title}
                      </CardTitle>
                      <p className="text-sm mb-4">{item.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </>
            );
          })
        ) : (
          <>
            <div className="flex justify-center items-center min-h-[100px] gap-3 flex-1">
              {" "}
              <Megaphone className="w-7 h-7" />{" "}
              <h6 className="font-bold md:text-2xl text-1xl">
                No Announcements
              </h6>{" "}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Announcement;
