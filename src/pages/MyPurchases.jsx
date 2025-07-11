import React from "react";
import { usePurchases } from "../context/PurchaseContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const rowVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

const MyPurchases = () => {
  const { purchases, clearPurchases } = usePurchases();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center px-4 sm:px-6 py-6 max-w-[1000px] mx-auto"
    >
      <div className="w-full flex justify-between items-center mb-4">
        {purchases.length > 0 ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearPurchases}
            className="bg-red-100 text-red-700 border border-red-300 rounded-md px-3 py-1 text-sm font-semibold hover:bg-red-200 hover:shadow-sm transition cursor-pointer"
          >
            پاک‌سازی لیست خریدها
          </motion.button>
        ) : (
          <div />
        )}
        <motion.img
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          src={assets.back}
          alt="بازگشت"
          className="w-8 h-8 cursor-pointer transition-transform duration-200"
          onClick={() => navigate(-1)}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        className="w-full bg-[#FEEDDB] rounded-xl shadow-lg p-4 sm:p-6 border border-[#FFD9A0]"
      >
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl sm:text-2xl font-bold text-[#256250] text-center border-b-2 border-[#FF6600] pb-2 mb-4 sm:mb-6"
        >
          خریدهای من
        </motion.h1>

        {purchases.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-[#FF6600] text-base sm:text-lg font-medium bg-[#FFF1E3] py-10 rounded-xl shadow-inner"
          >
           .هنوز هیچ دوره‌ای خریداری نکرده‌اید
          </motion.div>
        ) : (
          <>
            {/* کارت در موبایل */}
            <div className="block sm:hidden space-y-4">
              {purchases.map((item, i) => (
                <motion.div
                  key={`${item.id}-${item.coach}-${i}`}
                  initial="hidden"
                  animate="visible"
                  variants={rowVariants}
                  custom={i}
                  className="bg-[#F7FDF9] border border-[#D1E7D8] rounded-lg shadow p-4 text-[#256250] text-right"
                >
                  <div className="mb-3 text-[#055B5C] font-extrabold text-lg">
                    {item.coach}
                  </div>
                  <div className="mb-1">
                    <span className="font-semibold">نوع دوره: </span>
                    <span className="font-normal">{item.duration}</span>
                  </div>
                  <div className="mb-1">
                    <span className="font-semibold">روز: </span>
                    <span className="font-normal">{item.day}</span>
                  </div>
                  <div className="mb-1">
                    <span className="font-semibold">سطح: </span>
                    <span className="font-normal">{item.level}</span>
                  </div>
                  <div className="mb-1">
                    <span className="font-semibold">قیمت: </span>
                    <span className="font-bold text-[#FF6600]">
                      {item.price}
                    </span>
                  </div>
                  <div className="mb-1">
                    <span className="font-semibold">جلسات/ماه: </span>
                    <span className="font-normal">
                      {item.sessionsPerMonth || "---"} جلسه
                    </span>
                  </div>
                  <div className="mt-3 text-[#888] text-sm">
                    <span className="font-semibold">تاریخ خرید: </span>
                    <span>{item.date || "---"}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* جدول در دسکتاپ */}
            <div className="hidden sm:block overflow-x-auto w-full">
              <table className="w-full text-center bg-[#F7FDF9] rounded-lg">
                <thead className="bg-[#256250] text-white text-xs sm:text-sm md:text-base">
                  <tr>
                    <th className="p-2 sm:p-3 md:p-4">نوع دوره</th>
                    <th className="p-2 sm:p-3 md:p-4">مربی</th>
                    <th className="p-2 sm:p-3 md:p-4">روز</th>
                    <th className="p-2 sm:p-3 md:p-4">سطح</th>
                    <th className="p-2 sm:p-3 md:p-4">قیمت</th>
                    <th className="p-2 sm:p-3 md:p-4">جلسات/ماه</th>
                    <th className="p-2 sm:p-3 md:p-4">تاریخ خرید</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((item, i) => (
                    <motion.tr
                      key={`${item.id}-${item.coach}-${i}`}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={rowVariants}
                      className="border-b border-[#D1E7D8] hover:bg-[#EAF4ED] transition text-xs sm:text-sm md:text-base"
                    >
                      <td className="p-2 sm:p-3 md:p-4 text-[#256250]">
                        {item.duration}
                      </td>
                      <td className="p-2 sm:p-3 md:p-4 text-[#256250] font-medium">
                        {item.coach}
                      </td>
                      <td className="p-2 sm:p-3 md:p-4 text-[#055B5C]">
                        {item.day}
                      </td>
                      <td className="p-2 sm:p-3 md:p-4 text-[#256250]">
                        {item.level}
                      </td>
                      <td className="p-2 sm:p-3 md:p-4 text-[#256250] font-bold">
                        {item.price}
                      </td>
                      <td className="p-2 sm:p-3 md:p-4 text-[#256250]">
                        {item.sessionsPerMonth || "---"} جلسه
                      </td>
                      <td className="p-2 sm:p-3 md:p-4 text-[#888]">
                        {item.date || "---"}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MyPurchases;
