"use client";
import React, { useEffect, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useParams, useRouter } from "next/navigation";
import {
  useGetMeeting,
  useUpdateMeeting,
} from "@/hooks/react-query/react-hooks/meeting/meetingHook";

const Zgocloud = () => {
  const { id } = useParams<{ id: string[] }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const roomID = id[0];
  const { data } = useGetMeeting(id && id[2]);
  const { mutate } = useUpdateMeeting(id && id[1], id[2]);
  const containerRef = useRef<HTMLDivElement>(null);
  const zpRef = useRef<ZegoUIKitPrebuilt | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [timeLeft, setTimeLeft] = useState<number>(7200);
  const router = useRouter();

  // Date comparison function
  const compareDates = (createdAt: string) => {
    const currentDate = new Date();
    const meetingDate = new Date(createdAt);

    // Reset time to compare only dates
    const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const meetingDateOnly = new Date(meetingDate.getFullYear(), meetingDate.getMonth(), meetingDate.getDate());

    const diffTime = currentDateOnly.getTime() - meetingDateOnly.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      diffDays,
      isToday: diffDays === 0,
      isYesterday: diffDays === 1,
      isOlder: diffDays > 1,
      meetingDate: meetingDateOnly,
      currentDate: currentDateOnly
    };
  };

  // Check if meeting was created today or is old
  const dateComparison = data?.createdAt ? compareDates(data.createdAt) : null;

  // Handle meeting validation and redirects
  useEffect(() => {
    if (data && data?.endTime && data?.date) {
      function timeToMinutes(timeStr: string): number {
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours * 60 + minutes;
      }

      const currentDateTime = new Date();
      const meetingDate = new Date(data.date);

      // Reset time to compare only dates
      const currentDate = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate());
      const meetingDateOnly = new Date(meetingDate.getFullYear(), meetingDate.getMonth(), meetingDate.getDate());

      const currentMinutes = currentDateTime.getHours() * 60 + currentDateTime.getMinutes();
      const targetMinutes = timeToMinutes(data.endTime);

      console.log('Current date:', currentDate.toISOString());
      console.log('Meeting date:', meetingDateOnly.toISOString());
      console.log('Current time (minutes):', currentMinutes);
      console.log('Meeting end time (minutes):', targetMinutes);

      // Check if meeting date is in the past
      if (meetingDateOnly < currentDate) {
        console.log('Meeting date is in the past, redirecting to profile');
        router.push(`/user/profile`);
        return;
      }

      // Check if meeting date is today but time has passed
      if (meetingDateOnly.getTime() === currentDate.getTime() && currentMinutes > targetMinutes) {
        console.log('Meeting time has passed today, redirecting to profile');
        router.push(`/user/profile`);
        return;
      }

      // Meeting is either today and time hasn't passed, or in the future - allow access
      console.log('Meeting is valid - allowing access');
    }
  }, [data, router]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const myMeeting = async (element: HTMLElement) => {
    const appID = Number(process.env.NEXT_PUBLIC_APP_ID);
    const serverSecret = process.env.NEXT_PUBLIC_SERVER_SECRECT as string;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      user?._id as string,
      user?.fullName as string
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zpRef.current = zp;

    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Copy Link",
          url: `${process.env.NEXT_PUBLIC_ZGOCLOUD_URL}/meeting/${roomID}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },

      onUserJoin: () => {
        if (!intervalRef.current) {
          intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
          }, 1000);
        }
      },
    });
  };

  useEffect(() => {
    if (containerRef.current) {
      myMeeting(containerRef.current);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      zpRef.current?.destroy?.();
    };
  }, []);

  useEffect(() => {
    if (data?.duration) {
      setTimeLeft(data.duration * 60);
    }
  }, [data]);

  useEffect(() => {
    if (timeLeft <= 0 && zpRef.current) {
      zpRef.current.destroy();
      mutate();
      router.push(`/user/profile`);
    }
  }, [timeLeft, mutate, router]);

  // Format date for display
  const formatDateDisplay = (dateComparison: any) => {
    if (dateComparison.isToday) {
      return "Created: Today";
    } else if (dateComparison.isYesterday) {
      return "Created: Yesterday";
    } else if (dateComparison.diffDays <= 7) {
      return `Created: ${dateComparison.diffDays} days ago`;
    } else {
      return `Created: ${dateComparison.diffDays} days ago`;
    }
  };

  return (
    <>
      <div ref={containerRef} className="w-full h-screen relative">
        <div className="absolute top-5 left-10 text-[#557BFF] text-[50px] z-[7000]">
          {formatTime(timeLeft)}
        </div>
        {dateComparison && (
          <div className="absolute top-5 right-10 text-white text-lg z-[7000] bg-black/50 px-3 py-1 rounded">
            {formatDateDisplay(dateComparison)}
          </div>
        )}
      </div>
    </>
  );
};

export default Zgocloud;
