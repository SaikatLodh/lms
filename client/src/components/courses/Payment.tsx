import createOrder from "@/api/functions/order/createOrder";
import getOrderKey from "@/api/functions/order/getOrderKey";
import { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";

const Payment = ({
  userId,
  instructorId,
  courseId,
  totalAmount,
}: {
  userId: string | undefined;
  instructorId: string;
  courseId: string;
  totalAmount: number;
}) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const data = {
    userId: userId,
    instructorId: instructorId,
    courseId: courseId,
    totalAmount: totalAmount,
  };

  const details = createOrder(data);
  const key = getOrderKey();

  console.log(details, key);

  const options = {
    key: "YOUR_KEY_ID", // Replace with your Razorpay key_id
    amount: "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    name: "Acme Corp",
    description: "Test Transaction",
    order_id: "order_IluGWxBm9U8zJ8", // This is the order_id created in the backend
    callback_url: "http://localhost:8000/order/getpaymentprocess", // Your success URL
    prefill: {
      name: `${user?.fullName}`,
      email: `${user?.email}`,
      contact: "9999999999",
    },
    theme: {
      color: "#F37254",
    },
  };

  const rzp = new Razorpay(options);
  rzp.open();

  return <div></div>;
};

export default Payment;
