"use client";

import { useWindowSize } from "react-use";
import Confetti from "react-confetti";

const ConfettiAnimationn = () => {
  const { width, height } = useWindowSize();
  return <Confetti width={width} height={height} recycle={false} />;
};

export default ConfettiAnimationn;
