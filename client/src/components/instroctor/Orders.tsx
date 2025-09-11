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
import { useInstroctorOrders } from "@/hooks/react-query/react-hooks/instructor/instroctorHook";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const ITEMS_PER_PAGE = 10;

const Orders = () => {
  const { data: orders } = useInstroctorOrders();
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination values
  const totalItems = orders?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = orders?.slice(startIndex, endIndex) || [];

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
          <h2 className="text-3xl font-bold text-center">All Orders</h2>
          <div className="w-full border rounded-md overflow-hidden mt-5">
            <Table className="w-full">
              <TableHeader className="w-full">
                <TableRow>
                  <TableHead className="pl-4 ">ID</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Order Status</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>courses Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="w-full">
                {currentItems.map((order) => (
                  <TableRow key={order._id} className="odd:bg-muted/50">
                    <TableCell className="pl-4">{order._id}</TableCell>
                    <TableCell className="font-medium">
                      {order.totalAmount}
                    </TableCell>
                    <TableCell>{order.orderStatus}</TableCell>

                    <TableCell>
                      <div className="flex gap-2 items-center">
                        <Avatar>
                          <AvatarImage
                            src={
                              order?.users?.profilePicture?.url ||
                              order?.users?.gooleavatar ||
                              order?.users?.faceBookavatar ||
                              ""
                            }
                            alt="@shadcn"
                          />
                          <AvatarFallback>
                            {order.users.fullName.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        {order.users.fullName}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2 items-center">
                        <Avatar>
                          <AvatarImage
                            src={order?.courses?.image?.url || ""}
                            alt="@shadcn"
                          />
                          <AvatarFallback>
                            {order.courses.category.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        {order.courses.title.slice(0, 10)}
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
    </>
  );
};

export default Orders;
//  <TableCell className="flex gap-2 items-center">
//                       {" "}
//                       <Avatar>
//                         <AvatarImage
//                           src={order?.courses?.image?.url || ""}
//                           alt="@shadcn"
//                         />
//                         <AvatarFallback>
//                           {order.courses.category.slice(0, 1)}
//                         </AvatarFallback>
//                       </Avatar>
//                       {order.courses.title}
//                     </TableCell>
