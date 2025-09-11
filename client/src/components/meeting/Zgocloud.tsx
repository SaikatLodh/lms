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

  if (data && data?.endTime) {
    function timeToMinutes(timeStr: string): number {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    }

    const currentTime = new Date();
    const currentMinutes =
      currentTime.getHours() * 60 + currentTime.getMinutes();
    const targetMinutes = timeToMinutes(data?.endTime as string);

    if (currentMinutes > targetMinutes) {
      router.push(`/user/profile`);
    }
  }

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

  return (
    <>
      <div ref={containerRef} className="w-full h-screen relative">
        <div className="absolute top-5 left-10 text-[#557BFF] text-[50px] z-[7000]">
          {formatTime(timeLeft)}
        </div>
      </div>
    </>
  );
};

export default Zgocloud;
