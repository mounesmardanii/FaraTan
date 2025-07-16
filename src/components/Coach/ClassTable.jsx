import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useReservations } from "../../context/ReservationContext";
import { usePurchases } from "../../context/PurchaseContext";

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

const ClassTable = ({ coachId }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { reservations, reserveClass } = useReservations();
  const { purchases } = usePurchases();

  const fetchClasses = useCallback(() => {
    try {
      const key = `coachSchedule_${String(coachId)}`;
      const data = JSON.parse(localStorage.getItem(key) || "[]");
      setClasses(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError("خطا در دریافت اطلاعات کلاس‌ها");
    } finally {
      setLoading(false);
    }
  }, [coachId]);

  useEffect(() => {
    fetchClasses();
    const interval = setInterval(fetchClasses, 3000);
    return () => clearInterval(interval);
  }, [fetchClasses]);

  const handleReserve = async (classItem) => {
    try {
      const alreadyReserved = reservations.some((r) => r.id === classItem.id);
      const hasPurchased = purchases.some(
        (p) => p.duration === classItem.courseType
      );

      if (classItem.status > 0 && !alreadyReserved && hasPurchased) {
        await reserveClass(classItem);

        setClasses((prev) =>
          prev.map((cls) =>
            cls.id === classItem.id ? { ...cls, status: cls.status - 1 } : cls
          )
        );

        alert(
          `کلاس ${classItem.day} در ساعت ${classItem.time} با موفقیت رزرو شد.`
        );
      } else if (!hasPurchased) {
        alert("برای رزرو این کلاس باید دوره مربوطه را خریداری کنید.");
      } else if (alreadyReserved) {
        alert("شما قبلاً این کلاس را رزرو کرده‌اید.");
      } else {
        alert("ظرفیت این کلاس تکمیل شده است.");
      }
    } catch (err) {
      console.error("Error reserving class:", err);
      alert("خطا در رزرو کلاس. لطفاً دوباره تلاش کنید.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6600]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FEEDDB] p-6 rounded-2xl shadow-lg max-w-[1100px] mx-auto my-8 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="bg-[#FEEDDB] p-6 rounded-2xl shadow-lg max-w-[1100px] mx-auto my-8 text-center text-[#256250]">
        .هیچ کلاسی برای این مربی وجود ندارد
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-[#FEEDDB] p-4 sm:p-6 rounded-2xl shadow-lg w-full max-w-[1100px] mx-auto my-8 font-[Tahoma] text-right border border-[#D1E7D8]"
    >
      <h3 className="text-[#256250] border-b-2 border-[#FF6600] pb-3 mb-6 text-lg md:text-xl font-bold text-center">
        لیست کلاس‌های مربی
      </h3>

      {/* Desktop View */}
      <div className="hidden sm:block">
        <table className="w-full table-auto">
          <thead className="text-[#FF6600] text-[15px] md:text-[16px]">
            <tr>
              <th className="p-3 border-b text-center">رزرو</th>
              <th className="p-3 border-b text-center">ظرفیت</th>
              <th className="p-3 border-b text-center">ساعت</th>
              <th className="p-3 border-b text-center">روز</th>
              <th className="p-3 border-b text-center">نوع کلاس</th>
              <th className="p-3 border-b text-center">نوع دوره</th>
            </tr>
          </thead>
          <tbody>
            {[...classes].reverse().map((item, index) => {
              const isReserved = reservations.some((r) => r.id === item.id);
              const hasPurchased = purchases.some(
                (p) => p.duration === item.courseType
              );
              const disabled = item.status === 0 || isReserved || !hasPurchased;

              return (
                <motion.tr
                  key={item.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={rowVariants}
                  className="bg-[#FFF8ED] hover:bg-[#FDF2E1] transition-colors"
                >
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleReserve(item)}
                      disabled={disabled}
                      className={`px-3 py-1 text-xs md:text-sm rounded-xl min-w-[90px] max-w-[120px] transition text-center ${
                        disabled
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-[#D1E7D8] text-[#256250] hover:bg-[#BFDCCC] hover:shadow-md"
                      }`}
                    >
                      {isReserved
                        ? "رزرو شده"
                        : !hasPurchased
                        ? "خرید دوره لازم است"
                        : "رزرو"}
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        item.status === 0
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.status > 0
                        ? `${item.status} ظرفیت باقی‌مانده`
                        : "تکمیل شده"}
                    </span>
                  </td>
                  <td className="p-3 text-center text-[#256250]">
                    {item.time}
                  </td>
                  <td className="p-3 text-center text-[#256250]">{item.day}</td>
                  <td className="p-3 text-center text-[#256250]">
                    {item.classType}
                  </td>
                  <td className="p-3 text-center text-[#256250]">
                    {item.courseType}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden space-y-4">
        {[...classes].reverse().map((item, index) => {
          const isReserved = reservations.some((r) => r.id === item.id);
          const hasPurchased = purchases.some(
            (p) => p.duration === item.courseType
          );
          const disabled = item.status === 0 || isReserved || !hasPurchased;

          return (
            <motion.div
              key={item.id}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={rowVariants}
              className="bg-[#FFF8ED] border border-[#EBD9BD] rounded-xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-[#256250] font-bold text-base">
                  {item.day}
                </h4>
                <span className="text-sm bg-[#D1E7D8] text-[#256250] px-3 py-1 rounded">
                  {item.time}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">نوع کلاس</p>
                  <p className="text-sm text-[#256250]">{item.classType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">نوع دوره</p>
                  <p className="text-sm text-[#256250]">{item.courseType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">وضعیت</p>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      item.status === 0
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {item.status > 0
                      ? `${item.status} ظرفیت باقی‌مانده`
                      : "تکمیل شده"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleReserve(item)}
                disabled={disabled}
                className={`w-full py-2 rounded-xl text-sm transition ${
                  disabled
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#D1E7D8] text-[#256250] hover:bg-[#BFDCCC] hover:shadow-md"
                }`}
              >
                {isReserved
                  ? "رزرو شده"
                  : !hasPurchased
                  ? "نیاز به خرید دوره"
                  : "رزرو کلاس"}
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ClassTable;
