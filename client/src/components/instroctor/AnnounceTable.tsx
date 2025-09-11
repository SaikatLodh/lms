"use client";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "../ui/button";
import { InstructorAnnouncement } from "@/types";
import moment from "moment";
import EditAnnouncement from "./EditAnnouncement";
import { useDeleteAnnouncement } from "@/hooks/react-query/react-hooks/announcement/announcementHook";

const ITEMS_PER_PAGE = 10;

const AnnounceTable = ({
  data: products,
}: {
  data: InstructorAnnouncement[] | undefined;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { mutate, isPending } = useDeleteAnnouncement();
  // Calculate pagination values
  const totalItems = products?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = products?.slice(startIndex, endIndex) || [];
  const [open, setOpen] = useState(false);
  const [announcementId, setAnnouncementId] = useState<string | null>(null);
  // Generate page numbers with dynamic range
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };
  return (
    <>
      <div className="w-full h-screen flex justify-center items-center rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <div className=" md:w-[80%] w-full m-auto">
          <h2 className="text-3xl font-bold text-center">All Announcements</h2>
          <div className="w-full border rounded-md overflow-hidden mt-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4 ">No</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((announcement, index) => (
                  <TableRow key={announcement._id} className="odd:bg-muted/50">
                    <TableCell className="pl-4">{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {announcement.title}
                    </TableCell>
                    <TableCell>
                      {announcement.description.slice(0, 50) + "..."}
                    </TableCell>
                    <TableCell>
                      {moment(announcement.createdAt).format("MMMM Do YYYY")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          className="cursor-pointer"
                          onClick={() => {
                            setOpen(!open);
                            setAnnouncementId(announcement._id);
                          }}
                        >
                          Update
                        </Button>
                        <Button
                          onClick={() => mutate(announcement._id)}
                          variant="destructive"
                          className="cursor-pointer"
                          disabled={isPending}
                        >
                          {isPending ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex flex-col items-center gap-2">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {getPageNumbers().map((pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(pageNum);
                      }}
                      isActive={currentPage === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        setCurrentPage(currentPage + 1);
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
              {totalItems} entries
            </div>
          </div>
        </div>
      </div>
      {announcementId && (
        <EditAnnouncement
          open={open}
          setOpen={setOpen}
          announcementId={announcementId as string}
        />
      )}
    </>
  );
};

export default AnnounceTable;
