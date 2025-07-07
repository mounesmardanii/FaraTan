import React from "react";
import { useReservations } from "../context/ReservationContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const rowVariants = {
  hidden: { opacity: 0, scale: 0.95, rotateX: -10 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    rotateX: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

const MyReservations = () => {
  const { reservations, cancelReservation } = useReservations();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center px-4 sm:px-6 py-6 max-w-[1000px] mx-auto"
    >
      {/* آیکن برگشت بالا سمت راست */}
      <div className="w-full flex justify-end mb-4">
        <img
          src={assets.back}
          alt="بازگشت"
          className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform duration-200"
          onClick={() => navigate(-1)}
        />
      </div>

      <div className="w-full bg-[#FEEDDB] bg-opacity-70 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-[#FFD9A0]">
        <h1 className="text-2xl font-extrabold text-[#256250] mb-6 text-center border-b-2 border-[#FF6600] pb-2 tracking-tight">
          رزروهای من
        </h1>

        {reservations.length === 0 ? (
          <div className="text-center text-[#FF6600] font-semibold text-lg bg-[#FFF1E3] py-10 rounded-xl shadow-inner mt-6">
            شما هنوز هیچ کلاسی رزرو نکرده‌اید.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-md mt-4">
            <table className="w-full text-center rounded-lg overflow-hidden bg-[#F7FDF9]">
              <thead className="bg-[#256250] text-white text-[15px]">
                <tr>
                  <th className="p-3">عملیات</th>
                  <th className="p-3">نوع کلاس</th>
                  <th className="p-3">ساعت</th>
                  <th className="p-3">روز</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={rowVariants}
                    className="border-b border-[#CDE7DA] hover:bg-[#EAF4ED] transition transform-gpu"
                  >
                    <td className="p-3">
                      <button
                        onClick={() => cancelReservation(item.id)}
                        className="bg-[#FFE5E5] text-[#D32F2F] px-3 py-1 rounded-xl text-sm hover:bg-[#FFD1D1] transition cursor-pointer"
                      >
                        لغو
                      </button>
                    </td>
                    <td className="p-3 text-[#256250] font-semibold">
                      بدنسازی
                    </td>
                    <td className="p-3 text-[#055B5C] font-bold">
                      {item.time}
                    </td>
                    <td className="p-3 text-[#256250]">{item.day}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MyReservations;
