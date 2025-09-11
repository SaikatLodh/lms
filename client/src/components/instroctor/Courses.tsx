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
import { useInstroctorCourses } from "@/hooks/react-query/react-hooks/instructor/instroctorHook";
import AvatarGroupMaxAvatarDemo from "./GroupAvtar";

const ITEMS_PER_PAGE = 10;

const Courses = () => {
  const { data: products } = useInstroctorCourses();
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = products?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = products?.slice(startIndex, endIndex) || [];

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
          <h2 className="md:text-5xl text-2xl font-bold md:mt-0 mt-5 md:text-left text-center">
            All Courses
          </h2>
          <div className="w-full border rounded-md overflow-hidden mt-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4 ">ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Users</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((product) => (
                  <TableRow key={product._id} className="odd:bg-muted/50">
                    <TableCell className="pl-4">{product._id}</TableCell>
                    <TableCell className="font-medium">
                      {product.title}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      {product.description.slice(0, 50) + "..."}
                    </TableCell>
                    <TableCell>
                      <AvatarGroupMaxAvatarDemo user={product.user} />
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
    </>
  );
};

export default Courses;
