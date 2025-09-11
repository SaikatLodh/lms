import createOrder from "@/api/functions/order/createOrder";
import getOrderKey from "@/api/functions/order/getOrderKey";
import { Cart, SingleUserCourse, User } from "@/types";
import moment from "moment";

function formatDuration(totalSeconds: number): string {
  const hours: number = Math.floor(totalSeconds / 3600);
  const minutes: number = Math.floor((totalSeconds % 3600) / 60);
  const seconds: number = totalSeconds % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }

  // Add minutes if there are any, or if hours are present (to show "4h 0m")
  if (minutes > 0 || (hours > 0 && seconds > 0)) {
    parts.push(`${minutes}m`);
  }

  // Add seconds. If the duration is less than a minute, show the decimal seconds.
  // Otherwise, round to the nearest whole second.
  if (seconds > 0) {
    if (hours === 0 && minutes === 0) {
      parts.push(`${seconds.toFixed(2)}s`);
    } else {
      parts.push(`${Math.floor(seconds)}s`);
    }
  }

  // If the total duration is 0, return '0s'
  if (parts.length === 0) {
    return "0s";
  }

  return parts.join(" ");
}

const isNewCourse = (date: string) => {
  return moment().diff(moment(date), "days") <= 30;
};

const labels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const getLast7Days = () => {
  const currentDate = moment();

  const last7Days = [];

  for (let i = 0; i < 7; i++) {
    const dayDate = currentDate.clone().subtract(i, "days");
    const dayName = dayDate.format("dddd");

    last7Days.unshift(dayName);
  }

  return last7Days;
};

const handelPayment = async (
  data: SingleUserCourse | undefined,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  user: User | null
) => {
  setIsLoading(true);
  const orderdata = {
    userId: user?._id,
    instructorId: data?.instructorId,
    courseId: data?._id,
    totalAmount: data?.pricing,
  };

  const details = await createOrder(orderdata);
  const key = await getOrderKey();

  const options = {
    key: key, // Replace with your Razorpay key_id
    amount: `${details?.amount}`, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: `${details?.currency}`,
    name: "LMS Academy",
    description: "LMS Academy Course Payment",
    order_id: `${details?.id}`, // This is the order_id created in the backend
    callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/getpaymentprocess/${details?.OrderId}`, // Your success URL
    prefill: {
      name: `${user?.fullName}`,
      email: `${user?.email}`,
    },
    theme: {
      color: "#F37254",
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();

  setIsLoading(false);
};

const handelPaymentCart = async (
  data: Cart[] | undefined,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  user: User | null,
  total: number | undefined
) => {
  setIsLoading(true);

  const getData = [];

  if (data && data.length > 0) {
    for (let i = 0; i < data?.length; i++) {
      const orderdata = {
        userId: user?._id,
        instructorId: data[i]?.courses.instructorId,
        courseId: data[i]?.courses?._id,
        totalAmount: data[i]?.courses.pricing,
      };

      const details = await createOrder(orderdata);

      getData.push(details);
    }
  }

  const key = await getOrderKey();
  const orderids = getData.map((item) => item?.OrderId);

  const options = {
    key: key, // Replace with your Razorpay key_id
    amount: `${total}`, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: `${getData[0]?.currency}`,
    name: "LMS Academy",
    description: "LMS Academy Course Payment",
    order_id: `${getData[0]?.id}`, // This is the order_id created in the backend
    callback_url:
      `${process.env.NEXT_PUBLIC_BASE_URL}/order/getpaymentprocessforcart?orderid=` +
      orderids, // Your success URL
    prefill: {
      name: `${user?.fullName}`,
      email: `${user?.email}`,
    },
    theme: {
      color: "#F37254",
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();

  setIsLoading(false);
};

export {
  formatDuration,
  isNewCourse,
  labels,
  getLast7Days,
  handelPayment,
  handelPaymentCart,
};
