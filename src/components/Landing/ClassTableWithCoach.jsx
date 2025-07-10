// ✅ ClassTableWithCoach.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const rowVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const ClassTableWithCoach = ({
  category = "بدنسازی",
  classType = "نوع دوره",
  classList = [],
}) => {
  const navigate = useNavigate();

  const handleBuy = (item) => {
    if (item.status === "ظرفیت دارد") {
      navigate("/payment", {
        state: {
          ...item,
          duration: classType,
        },
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-[#FEEDDB] p-4 sm:p-6 rounded-2xl shadow-lg w-full max-w-[1100px] mx-auto mt-10 font-[Tahoma] text-right border border-[#D1E7D8] overflow-hidden"
    >
      <h3 className="text-[#256250] border-b-2 border-[#FF6600] pb-2 mb-4 text-xl font-bold text-center">
        دوره‌های {category} - {classType}
      </h3>

      <div>
        <table className="w-full border-collapse">
          <thead className="text-[#FF6600] text-xs md:text-base">
            <tr>
              <th className="p-1 text-center border-b border-[#B5D2C1]">
                خرید
              </th>
              <th className="p-1 text-center border-b border-[#B5D2C1]">
                وضعیت
              </th>
              <th className="p-1 text-center border-b border-[#B5D2C1]">
                مربی
              </th>
              <th className="p-1 text-center border-b border-[#B5D2C1]">
                قیمت
              </th>
              <th className="p-1 text-center border-b border-[#B5D2C1]">سطح</th>
              <th className="p-1 text-center border-b border-[#B5D2C1]">روز</th>
            </tr>
          </thead>

          <tbody className="text-xs">
            {classList.map((item, index) => (
              <motion.tr
                key={item.id + "-" + item.coach + index}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={rowVariants}
                className="bg-[#FFF8ED] border-b border-[#EBD9BD] hover:bg-[#FDF2E1] transition"
              >
                <td className="p-1 md:p-2 text-center">
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={item.status !== "ظرفیت دارد"}
                    className={`px-2 md:px-4 py-0.5 md:py-1 rounded-full text-[10px] md:text-sm font-bold transition ${
                      item.status === "ظرفیت دارد"
                        ? "bg-[#D1E7D8] text-[#256250] hover:bg-[#BFDCCC] cursor-pointer"
                        : "bg-gray-300 text-[#888] cursor-not-allowed"
                    }`}
                  >
                    خرید دوره
                  </button>
                </td>

                <td className="p-1 md:p-2 text-center">
                  <span
                    className={`text-white px-2 md:px-4 py-0.5 md:py-1 rounded-xl text-[10px] md:text-sm whitespace-nowrap ${
                      item.status === "تکمیل شده"
                        ? "bg-[#FF6600]"
                        : "bg-[#256250]"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="p-1 text-center whitespace-nowrap">
                  {item.coach}
                </td>
                <td className="p-1 text-center">{item.price}</td>
                <td className="p-1 text-center">{item.level}</td>
                <td className="p-1 text-center text-[#256250] font-medium">
                  {item.day}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ClassTableWithCoach;
