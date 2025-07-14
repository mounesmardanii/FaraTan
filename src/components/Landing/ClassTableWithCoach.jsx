import React, { useState } from "react";
import { motion } from "framer-motion";
import PurchasePreviewModal from "./PurchasePreviewModal";

const rowVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const ClassTableWithCoach = ({
  category = "بدنسازی",
  classType = "نوع دوره",
  classList = [],
}) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleBuyClick = (item) => {
    if (item.capacity > 0) {
      const buyer = JSON.parse(localStorage.getItem("userProfile"));
      const date = new Date().toLocaleDateString("fa-IR");

      setSelectedClass({
        ...item,
        buyerName: buyer?.name || "بدون نام",
        date,
        duration: classType,
        sessions: item.sessions || item.sessionCount || 8,
      });

      setPreviewOpen(true);
    }
  };

  const getButtonClass = (capacity) =>
    capacity > 0
      ? "bg-[#D1E7D8] text-[#256250] hover:bg-[#BFDCCC] cursor-pointer"
      : "bg-gray-300 text-[#888] cursor-not-allowed";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="overflow-hidden bg-[#FEEDDB] p-4 sm:p-6 rounded-2xl shadow-lg w-full max-w-[1100px] mx-auto mt-4 font-[Tahoma] text-right border border-[#D1E7D8]"
      >
        <h3 className="text-[#256250] border-b-2 border-[#FF6600] pb-2 mb-4 text-xl font-bold text-center">
          دوره‌های {category} - {classType}
        </h3>

        {/* جدول دسکتاپ */}
        <div className="hidden sm:block overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="text-[#FF6600] text-sm md:text-base">
              <tr>
                <th className="p-2 border-b text-center">خرید</th>
                <th className="p-2 border-b text-center">ظرفیت</th>
                <th className="p-2 border-b text-center">قیمت</th>
                <th className="p-2 border-b text-center">مربی</th>
                <th className="p-2 border-b text-center">تعداد جلسات</th>
                <th className="p-2 border-b text-center">نوع دوره</th>
              </tr>
            </thead>
            <tbody className="text-sm md:text-base text-center">
              {classList.map((item, index) =>
                item.sessionOptions?.map((option, idx) => (
                  <motion.tr
                    key={`${item.id}-${option.sessions}`}
                    custom={index * 4 + idx}
                    initial="hidden"
                    animate="visible"
                    variants={rowVariants}
                    className="bg-[#FFF8ED] border-b border-[#EBD9BD] hover:bg-[#FDF2E1] transition"
                  >
                    <td className="p-2">
                      <button
                        onClick={() => handleBuyClick({ ...item, ...option })}
                        disabled={item.capacity <= 0}
                        className={`px-3 py-1 rounded-full text-sm font-bold transition ${getButtonClass(
                          item.capacity
                        )}`}
                      >
                        خرید دوره
                      </button>
                    </td>
                    <td className="p-2">{item.capacity}</td>
                    <td className="p-2">{option.price}</td>
                    <td className="p-2 whitespace-nowrap">{item.coach}</td>
                    <td className="p-2">{option.sessions}</td>
                    <td className="p-2">{classType}</td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* کارت‌های موبایل */}
        <div className="sm:hidden flex flex-col gap-4 mt-4">
          {classList.map((item, index) =>
            item.sessionOptions?.map((option, idx) => (
              <motion.div
                key={`${item.id}-${option.sessions}-mobile`}
                custom={index * 4 + idx}
                initial="hidden"
                animate="visible"
                variants={rowVariants}
                className="bg-[#FFF8ED] rounded-xl shadow-md border border-[#EBD9BD] p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#FF6600] font-bold">
                    {item.coach}
                  </span>
                  <span className="text-xs text-gray-500">{classType}</span>
                </div>
                <div className="text-sm space-y-1 mb-3">
                  <div>تعداد جلسات: {option.sessions}</div>
                  <div>قیمت: {option.price} تومان</div>
                  <div>ظرفیت باقی‌مانده: {item.capacity}</div>
                </div>
                <button
                  onClick={() => handleBuyClick({ ...item, ...option })}
                  disabled={item.capacity <= 0}
                  className={`w-full py-2 rounded-full text-sm font-bold transition ${getButtonClass(
                    item.capacity
                  )}`}
                >
                  خرید دوره
                </button>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* مودال پیش‌نمایش خرید */}
      <PurchasePreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        data={selectedClass}
      />
    </>
  );
};

export default ClassTableWithCoach;
