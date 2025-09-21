"use client";
import io from "socket.io-client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { getUser, refreshToken, resetLoading } from "@/store/auth/authSlice";
import { USER_NOTIFICATION, ONLINE_USERS } from "@/socketkeys/socketKeys";
import { useGlobalHooks } from "@/hooks/globalHook";
import { NOTIFICATION } from "@/hooks/react-query/react-keys/querykeys";
import { Notification } from "@/types";

const MainWrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { queryClient } = useGlobalHooks();

  useEffect(() => {
    dispatch(refreshToken())
      .then((res) => {
        if (res?.payload?.status === 200) {
          dispatch(getUser());
        }
      })
      .finally(() => {
        dispatch(resetLoading());
      });
  }, [dispatch]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(refreshToken());
    }, 1 * 60 * 1000);
    return () => clearInterval(intervalId);
  });

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to server");
      const notificationAudio = new Audio("/mixkit-bell-notification-933.wav");

      socket.on(USER_NOTIFICATION, (notification: Notification) => {
        notificationAudio.play().catch((error) => {
          console.error("Error playing notification sound:", error);
        });
        queryClient.setQueryData([NOTIFICATION], (old: Notification[]) => [
          notification,
          ...old,
        ]);
      });
    });

    socket.on("disconnect", () => {
      socket.disconnect();
      console.log("Disconnected from server");
    });

    socket.on("connect_error", (error) => {
      socket.disconnect();
      console.error("Socket error:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  return <>{children}</>;
};

export default MainWrapper;
