"use client";
import React, { useMemo, useState } from "react";
import { Bell, CheckCheck, Dot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  useGetNotification,
  useSeenNotification,
} from "@/hooks/react-query/react-hooks/notification/notificationHook";
import { Notification } from "@/types";

function classNames(...c: (string | false | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}

function timeAgo(iso: string) {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return date.toLocaleDateString();
}

function getAvatarUrl(n: Notification) {
  return (
    n?.senderId?.profilePicture?.url ||
    n?.senderId?.gooleavatar ||
    n?.senderId?.faceBookavatar ||
    undefined
  );
}

function NotificationItem({
  n,
  mutate,
  onOpen,
}: {
  n: Notification;
  mutate: (id: string) => void;
  onOpen?: (n: Notification) => void;
}) {
  return (
    <>
      <motion.button
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.15 }}
        onClick={() => onOpen?.(n)}
        className={classNames(
          "w-full text-left rounded-2xl p-3 hover:bg-muted/60 transition",
          !n.seen && "bg-muted/40"
        )}
      >
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={getAvatarUrl(n)} alt={n.senderId?.fullName} />
              <AvatarFallback className="font-medium">
                {n.senderId?.fullName?.slice(0, 2)?.toUpperCase() || "NA"}
              </AvatarFallback>
            </Avatar>
            {!n.seen && (
              <Dot className="absolute -right-1 -top-1 h-5 w-5 text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold truncate">{n.title}</p>
              <Badge variant="outline" className="shrink-0">
                {n.messageType}
              </Badge>
              <span className="ml-auto text-xs text-muted-foreground">
                {timeAgo(n.createdAt)}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {n.message}
            </p>
            <div className="mt-2 flex items-center gap-2 ">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  mutate(n._id);
                }}
                className="rounded-xl cursor-pointer"
                disabled={n.seen}
              >
                <CheckCheck className="mr-1 h-4 w-4" />
                {n.seen ? "Mark readed" : "Mark read"}
              </Button>
            </div>
          </div>
        </div>
      </motion.button>
    </>
  );
}

export function NotificationBell({
  items,
  onOpenItem,
  mutate,
  filterUnseen,
}: {
  items: Notification[] | undefined;
  onOpenItem?: (n: Notification) => void;
  mutate: (id: string) => void;
  filterUnseen: Notification[] | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items?.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q) ||
        n.messageType.toLowerCase().includes(q) ||
        n.senderId?.fullName?.toLowerCase().includes(q)
    );
  }, [items, search]);
  const checkAllRead = items?.every((n) => n.seen);

  const handleMarkAllRead = () => {
    items?.forEach((n) => mutate(n._id));
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Bell width={20} height={20} />
            {filterUnseen && filterUnseen?.length > 0 && (
              <div className="absolute top-[-10px] right-[-8px] w-5 h-5 bg-[#A435F0] text-white rounded-full">
                {filterUnseen?.length}
              </div>
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          className="lg:w-[720px] md:w-[500px] w-[95%] p-0 rounded-2xl shadow-xl px-3 z-[150]"
        >
          <div className="p-3 pb-2">
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold">Notifications</p>
              <Badge variant="secondary" className="rounded-xl">
                {filterUnseen?.length}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                className="ml-auto rounded-xl cursor-pointer"
                onClick={handleMarkAllRead}
                disabled={checkAllRead}
              >
                Mark all read
              </Button>
            </div>
            <div className="mt-2">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notifications…"
                className="rounded-xl"
              />
            </div>
          </div>
          <Separator />
          <ScrollArea className="h-[360px] p-2">
            <AnimatePresence initial={false}>
              {filtered?.length === 0 ? (
                <div className="px-4 py-16 text-center text-sm text-muted-foreground">
                  No notifications found.
                </div>
              ) : (
                filtered?.map((n) => (
                  <NotificationItem
                    key={n._id}
                    n={n}
                    mutate={mutate}
                    onOpen={(item) => {
                      onOpenItem?.(item);
                      setOpen(false);
                    }}
                  />
                ))
              )}
            </AnimatePresence>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </>
  );
}

export default function NotificationDemo() {
  const { data: notification } = useGetNotification();
  const { mutate } = useSeenNotification();
  const filterUnseen = notification?.filter((n) => !n.seen);

  return (
    <>
      <div className="flex items-center gap-4">
        <NotificationBell
          items={notification}
          mutate={mutate}
          filterUnseen={filterUnseen}
        />
      </div>
    </>
  );
}
