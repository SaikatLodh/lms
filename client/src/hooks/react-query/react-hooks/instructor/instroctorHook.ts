import { useQuery } from "@tanstack/react-query";
import {
  INSTRUCTOR_DASHBOARD,
  INSTROCTOR_COURSES,
  INSTROCTOR_ORDERS,
} from "../../react-keys/querykeys";
import getCourse from "@/api/functions/instructor/getCourse";
import getOrders from "@/api/functions/instructor/getOrders";
import getDashboard from "@/api/functions/instructor/getDashboard";

const useInstructorDashboard = () => {
  return useQuery({
    queryKey: [INSTRUCTOR_DASHBOARD],
    queryFn: () => getDashboard(),
    staleTime: 1000 * 60 * 15,
  });
};
const useInstroctorCourses = () => {
  return useQuery({
    queryKey: [INSTROCTOR_COURSES],
    queryFn: () => getCourse(),
    staleTime: 1000 * 60 * 15,
  });
};

const useInstroctorOrders = () => {
  return useQuery({
    queryKey: [INSTROCTOR_ORDERS],
    queryFn: () => getOrders(),
    staleTime: 1000 * 60 * 15,
  });
};

export { useInstructorDashboard, useInstroctorCourses, useInstroctorOrders };
