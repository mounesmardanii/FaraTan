import React, { useState } from "react";
import { motion } from "framer-motion";
import { useReservations } from "../../context/ReservationContext";
import { usePurchases } from "../../context/PurchaseContext";

const initialClasses = [
  {
    id: 1,
    day: "شنبه",
    time: "15 - 17",
    status: "تکمیل شده",
    courseType: "خصوصی",
  },
  {
    id: 2,
    day: "پنجشنبه",
    time: "11 - 13",
    status: "ظرفیت دارد",
    courseType: "عمومی",
  },
  {
    id: 3,
    day: "دوشنبه",
    time: "8 - 10",
    status: "ظرفیت دارد",
    courseType: "VIP",
  },
  {
    id: 4,
    day: "دوشنبه",
    time: "11 - 13",
    status: "تکمیل شده",
    courseType: "عمومی",
  },
  {
    id: 5,
    day: "سه‌شنبه",
    time: "14 - 16",
    status: "ظرفیت دارد",
    courseType: "خصوصی",
  },
  {
    id: 6,
    day: "جمعه",
    time: "10 - 12",
    status: "ظرفیت دارد",
    courseType: "VIP",
  },
];

const rowVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const ClassTable = () => {
  const [classes] = useState(initialClasses);
  const { reservations, reserveClass } = useReservations();
  const { purchases } = usePurchases();

  const handleReserve = (classItem) => {
    const alreadyReserved = reservations.some((r) => r.id === classItem.id);
    const hasPurchased = purchases.some(
      (p) => p.duration === classItem.courseType
    );

    if (classItem.status === "ظرفیت دارد" && !alreadyReserved && hasPurchased) {
      reserveClass(classItem);
      alert(
        `کلاس ${classItem.day} در ساعت ${classItem.time} با موفقیت رزرو شد.`
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-[#FEEDDB] p-4 sm:p-5 md:p-6 rounded-2xl shadow-lg w-full max-w-[1100px] min-w-[300px] mx-auto mt-15 font-[Tahoma] text-right border border-[#D1E7D8]"
    >
      <h3 className="text-[#256250] border-b-2 border-[#FF6600] pb-2 mb-4 text-base sm:text-lg md:text-xl font-bold text-center">
        لیست کلاس‌های مربی
      </h3>

      {/* حالت دسکتاپ */}
      <div className="hidden sm:block">
        <table className="w-full table-fixed border-collapse rounded-xl overflow-hidden">
          <thead className="text-[#FF6600] text-[14px] md:text-[16px]">
            <tr>
              <th className="p-2 text-center border-b border-[#B5D2C1]">
                رزرو
              </th>
              <th className="p-2 text-center border-b border-[#B5D2C1]">
                وضعیت
              </th>
              <th className="p-2 text-center border-b border-[#B5D2C1]">
                ساعت
              </th>
              <th className="p-2 text-center border-b border-[#B5D2C1]">روز</th>
              <th className="p-2 text-center border-b border-[#B5D2C1]">
                نوع کلاس
              </th>
              <th className="p-2 text-center border-b border-[#B5D2C1]">
                نوع دوره
              </th>
            </tr>
          </thead>
          <tbody className="text-[12px]">
            {[...classes].reverse().map((item, index) => {
              const isReserved = reservations.some((r) => r.id === item.id);
              const hasPurchased = purchases.some(
                (p) => p.duration === item.courseType
              );
              const disabled =
                item.status === "تکمیل شده" || isReserved || !hasPurchased;

              return (
                <motion.tr
                  key={item.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={rowVariants}
                  className="bg-[#FFF8ED] border-b border-[#EBD9BD] hover:bg-[#FDF2E1] transition"
                >
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleReserve(item)}
                      disabled={disabled}
                      className={`px-2 py-1 rounded-xl text-sm w-full max-w-[90px] mx-auto transition ${
                        disabled
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-[#D1E7D8] text-[#256250] hover:bg-[#BFDCCC] cursor-pointer"
                      }`}
                    >
                      {isReserved
                        ? "رزرو شده"
                        : !hasPurchased
                        ? "نیاز به خرید دوره"
                        : "رزرو"}
                    </button>
                  </td>
                  <td className="p-2 text-center">
                    <span
                      className={`text-white px-3 py-1 rounded-xl text-sm whitespace-nowrap ${
                        item.status === "تکمیل شده"
                          ? "bg-[#FF6600]"
                          : "bg-[#256250]"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-2 text-center">{item.time}</td>
                  <td className="p-2 text-center">{item.day}</td>
                  <td className="p-2 text-center text-[#256250] font-medium">
                    بدنسازی
                  </td>
                  <td className="p-2 text-center text-[#256250] font-medium">
                    {item.courseType}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* حالت موبایل */}
      <div className="flex flex-col gap-4 sm:hidden">
        {[...classes].reverse().map((item, index) => {
          const isReserved = reservations.some((r) => r.id === item.id);
          const hasPurchased = purchases.some(
            (p) => p.duration === item.courseType
          );
          const disabled =
            item.status === "تکمیل شده" || isReserved || !hasPurchased;

          return (
            <motion.div
              key={item.id}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={rowVariants}
              className="bg-[#FFF8ED] border border-[#EBD9BD] rounded-xl p-4 shadow-sm w-full max-w-[350px] mx-auto"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#256250] font-bold">{item.day}</span>
                <span className="text-sm text-gray-600">{item.time}</span>
              </div>
              <div className="text-sm text-[#256250] mb-1">
                نوع کلاس: بدنسازی
              </div>
              <div className="text-sm text-[#256250] mb-2">
                نوع دوره: {item.courseType}
              </div>
              <span
                className={`text-white px-3 py-1 rounded-xl text-xs whitespace-nowrap inline-block mb-2 ${
                  item.status === "تکمیل شده" ? "bg-[#FF6600]" : "bg-[#256250]"
                }`}
              >
                {item.status}
              </span>
              <button
                onClick={() => handleReserve(item)}
                disabled={disabled}
                className={`block w-full px-2 py-1 rounded-xl text-sm transition ${
                  disabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#D1E7D8] text-[#256250] hover:bg-[#BFDCCC] cursor-pointer"
                }`}
              >
                {isReserved
                  ? "رزرو شده"
                  : !hasPurchased
                  ? "نیاز به خرید دوره"
                  : "رزرو"}
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ClassTable;
