import React from "react";
import Banner from "./Banner";
import LetsLearning from "./LetsLearning";
import AllCourses from "./AllCourses";
import WebDev from "./WebDev";
import MobilleDev from "./MobilleDev";
import Ai from "./Ai";

const Wrapper = async () => {
  return (
    <>
      <Banner />
      <div className="max-w-7xl m-auto md:px-0 px-3">
        <LetsLearning />
        <AllCourses />
        <WebDev />
        <MobilleDev />
        <Ai />
      </div>
    </>
  );
};

export default Wrapper;
