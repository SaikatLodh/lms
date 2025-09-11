"use client";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
interface Image {
  fullName: string;
  email: string;
  profilePicture: {
    public_id: string;
    url: string;
  };
  gooleavatar: string;
  faceBookavatar: string;
}
type AvatarProps = React.ComponentProps<typeof Avatar>;
interface AvatarGroupProps extends React.ComponentProps<"div"> {
  children: React.ReactElement<AvatarProps>[];
  max?: number;
}
const AvatarGroup = ({
  children,
  max,
  className,
  ...props
}: AvatarGroupProps) => {
  const totalAvatars = React.Children.count(children);
  const displayedAvatars = React.Children.toArray(children)
    .slice(0, max)
    .reverse();
  const remainingAvatars = max ? Math.max(totalAvatars - max, 1) : 0;
  return (
    <div
      className={cn("flex items-center flex-row-reverse", className)}
      {...props}
    >
      {remainingAvatars > 0 && (
        <Avatar className="-ml-2 hover:z-10 relative ring-2 ring-background">
          <AvatarFallback className="bg-muted-foreground text-white">
            +{remainingAvatars}
          </AvatarFallback>
        </Avatar>
      )}
      {displayedAvatars.map((avatar, index) => {
        if (!React.isValidElement(avatar)) return null;
        return (
          <div key={index} className="-ml-2 hover:z-10 relative">
            {React.cloneElement(avatar as React.ReactElement<AvatarProps>, {
              className: "ring-2 ring-background",
            })}
          </div>
        );
      })}
    </div>
  );
};
export default function AvatarGroupMaxAvatarDemo({ user }: { user: Image[] }) {
  return (
    <AvatarGroup className="flex items-center" max={3}>
      {user &&
        user.slice(0, 3).map((item, index) => {
          return (
            <Avatar className="-ml-2 first:ml-0 cursor-pointer" key={index}>
              <AvatarImage
                src={
                  item?.profilePicture?.url ||
                  item?.gooleavatar ||
                  item?.faceBookavatar ||
                  ""
                }
                alt="@shadcn"
              />
              <AvatarFallback className="bg-indigo-500 text-white">
                {item?.fullName.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
          );
        })}
    </AvatarGroup>
  );
}
