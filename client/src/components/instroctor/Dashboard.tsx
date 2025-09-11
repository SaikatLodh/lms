"use client";
import DashboardDetails from "./DashboardDetails";
import LineChart, { BarChart } from "@/chart/Chart";
import { useInstructorDashboard } from "@/hooks/react-query/react-hooks/instructor/instroctorHook";
import React from "react";

const Dashboard = () => {
  const { data } = useInstructorDashboard();

  const values = React.useMemo(() => {
    if (!data?.calculatedCourseByyear) return new Array(12).fill(0);

    const monthValues = new Array(12).fill(0);

    data.calculatedCourseByyear.forEach((item) => {
      const monthIndex = item.month - 1;
      monthValues[monthIndex] = item.courseCount + monthValues[monthIndex];
    });

    return monthValues;
  }, [data?.calculatedCourseByyear]);

  const getValueInLast7Days = React.useMemo(() => {
    if (!data?.totalEarningsOfyWeek) return new Array(7).fill(0);

    const dayValues = new Array(7).fill(0);

    data.totalEarningsOfyWeek.forEach((item) => {
      const dayIndex = item.dayOfWeek - 1;
      dayValues[dayIndex] = item.totalEarnings + dayValues[dayIndex];
    });

    return dayValues;
  }, [data?.totalEarningsOfyWeek]);

  return (
    <div className="flex flex-1 ">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-5 md:p-10 dark:border-neutral-700 dark:bg-neutral-900 ">
        <div className="flex gap-2 w-full">
          <DashboardDetails
            totalCourses={data?.totalCourses}
            totalStudents={data?.totalStudents}
            totalOrders={data?.totalOrders}
            totalEarnings={data?.totalEarnings}
          />
        </div>
        <div className="flex flex-1 flex-wrap gap-15 items-center h-[500px] md:mt-0 mt-5">
          <div className="md:w-[48%] w-[100%]">
            <h3 className="text-2xl font-bold mb-2 text-[#a435f0] text-center">
              Courses Chart
            </h3>
            <BarChart values={values as number[]} />
          </div>

          <div className="md:w-[48%] w-[100%]">
            <h3 className="text-2xl font-bold mb-2 text-[#4BC0C0] text-center">
              Sales Chart
            </h3>
            <LineChart values={getValueInLast7Days as number[]} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
