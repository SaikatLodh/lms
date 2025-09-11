"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, X, Search } from "lucide-react";
import EditMeeting from "./EditMeeting";
import CreateMeeting from "./CreateMeeting";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  useGetSchedule,
  useLiveSchedule,
} from "@/hooks/react-query/react-hooks/schedule/sceduleHook";
import MeetingSkeleton from "./MeetingSkeleton";
import { usePathname } from "next/navigation";
import moment from "moment";
import ScheduleCalcel from "./ScheduleCalcel";
import Link from "next/link";

const Meeting = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openCreateMeeting, setOpenCreateMeeting] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { user } = useSelector((state: RootState) => state.auth);
  const { data, isLoading } = useGetSchedule();
  const { mutate } = useLiveSchedule();
  const location = usePathname();

  function handleEditClick() {
    setOpenCreate(true);
  }

  function handleCreateMeeting() {
    setOpenCreateMeeting(true);
  }

  const filteredMeetings =
    data &&
    data.filter(
      (m) =>
        m.course.title.toLowerCase().includes(search.toLowerCase()) ||
        m.reason.toLowerCase().includes(search.toLowerCase()) ||
        m.status.toLowerCase().includes(search.toLowerCase()) ||
        moment(m.date).format("YYYY-MM-DD").includes(search)
    );

  return (
    <>
      <div
        className={`w-full ${
          location === "/user/profile" ? "h-[400px]" : "h-screen"
        } rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto instroctor-course`}
      >
        <div>
          <h2 className="text-2xl md:text-5xl font-bold mb-4 md:mt-0 mt-5 md:text-left text-center">
            Meetings
          </h2>
        </div>

        <div className="my-8">
          <div className="relative md:w-1/5 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search meetings by title or reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
            {isLoading ? (
              <>
                <MeetingSkeleton />
              </>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Course</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead className="w-48">Date</TableHead>
                      <TableHead className="w-48">Time</TableHead>
                      <TableHead className="w-36">Status</TableHead>
                      <TableHead className="w-48">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMeetings &&
                      filteredMeetings.map((m) => (
                        <TableRow key={m._id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage
                                  src={m.course.image.url}
                                  alt={m.course.title}
                                  className="object-cover"
                                />
                                <AvatarFallback>
                                  {m.course.title.slice(0, 1)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          </TableCell>
                          <TableCell>{m.course.title}</TableCell>
                          <TableCell>{m.reason}</TableCell>
                          <TableCell>
                            {moment(m.date).format("YYYY-MM-DD")}
                          </TableCell>
                          <TableCell>
                            {m.time >= "12"
                              ? `${m.time.slice(0, 5)} PM`
                              : `${m.time.slice(0, 5)} AM`}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${
                                m.status === "Waiting"
                                  ? "bg-black"
                                  : m.status === "Scheduled"
                                  ? "bg-blue-600"
                                  : m.status === "Completed"
                                  ? "bg-green-600"
                                  : m.status === "Live"
                                  ? "bg-green-400"
                                  : "bg-red-600"
                              } uppercase`}
                            >
                              {m.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2 items-center">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleEditClick}
                                className="cursor-pointer"
                                disabled={
                                  m.status === "Scheduled" ||
                                  m.status === "Completed" ||
                                  m.status === "Live" ||
                                  m.status === "Cancelled"
                                    ? true
                                    : false
                                }
                              >
                                <Edit className="mr-2 h-3 w-3" /> Edit
                              </Button>
                              <Button
                                disabled={
                                  m.status === "Completed" ||
                                  m.status === "Live" ||
                                  m.status === "Cancelled"
                                    ? true
                                    : false
                                }
                                size="sm"
                                variant="destructive"
                                onClick={() => setOpen(true)}
                                className="cursor-pointer"
                              >
                                <X className="mr-2 h-3 w-3" /> Cancel
                              </Button>
                              {user?.role === "instructor" && !m.meetingUrl && (
                                <Button
                                  size="sm"
                                  onClick={handleCreateMeeting}
                                  className="cursor-pointer"
                                >
                                  Create meeting
                                </Button>
                              )}
                              {m.meetingUrl && (
                                <Link
                                  href={
                                    `${
                                      m.status === "Waiting"
                                        ? ""
                                        : `/meeting/${m.meetingUrl}/${m._id}/${m.meetingId}`
                                    }` || ""
                                  }
                                >
                                  <Button
                                    size="sm"
                                    className="cursor-pointer"
                                    disabled={m.status === "Waiting"}
                                    onClick={() => mutate(m._id)}
                                  >
                                    Go to meeting
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </TableCell>
                          <EditMeeting
                            openCreate={openCreate}
                            setOpenCreate={setOpenCreate}
                            id={m._id}
                          />
                          <CreateMeeting
                            openCreateMeeting={openCreateMeeting}
                            setOpenCreateMeeting={setOpenCreateMeeting}
                            course={m.course}
                            schedule={m}
                          />
                          <ScheduleCalcel
                            open={open}
                            setOpen={setOpen}
                            schedule={m}
                          />
                        </TableRow>
                      ))}
                    {filteredMeetings && filteredMeetings.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="p-6 text-center text-sm text-muted-foreground"
                        >
                          No meetings found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Meeting;
