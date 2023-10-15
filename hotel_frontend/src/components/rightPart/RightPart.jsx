import { CashIcon } from "@heroicons/react/outline";
import React from "react";
import Chart from "./chart/Chart";

function RightPart() {
  return (
    <div className="col-span-3 items-start justify-start flex flex-col w-full pt-12 pb-6">
      {/* top section */}
      <div className="md:flex items-center justify-center w-full lg:space-y-0 space-y-4  lg:space-x-4  px-12">
        <div className="space-y-6 w-full items-center justify-center flex flex-col ">
          <span className="py-4 px-4 rounded-full shadow-lg shadow-gray-300 items-center justify-center flex">
            <CashIcon className="w-8 h-8 stroke-1 " />
          </span>
          <span className="items-center justify-center flex flex-col">
            <h2 className="ml-5" > Total Bookings (October)  </h2>
            <h2 className="font-bold text-xl">150 </h2>
          </span>
        </div>
        <div className="bg-[#BFFA00] pt-6 items-center justify-between flex flex-col w-full">
          <span className="items-center justify-center flex flex-col w-full px-4 py-6">
            <h3> Total Booking Amount </h3>
            <h1 className="text-black font-bold text-xl 2xl:text-3xl">
              ₹36,90,070
            </h1>
          </span>
          <div className="bg-black items-center justify-center flex text-white w-full py-3 ">
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 w-full my-4" />
      {/* chart */}
      <div className="w-full items-start justify-start flex flex-col px-12 py-2 ">
        <h1 className="text-xl font-bold xl:text-3xl"> Monthly Booking Amount </h1>
        <Chart />
      </div>
      
    </div>
  );
}

export default RightPart;
