import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const NutritionProgram = () => {
  const navigate = useNavigate();

  const [nutritionItems] = useState([
    { label: "هفته اول", planPath: "/nutrition/week-1/plan" },
    { label: "هفته دوم", planPath: "/nutrition/week-2/plan" },
    { label: "هفته سوم", planPath: "/nutrition/week-3/plan" },
    { label: "هفته چهارم", planPath: "/nutrition/week-4/plan" },
    { label: "هفته پنجم", planPath: "/nutrition/week-5/plan" },
    { label: "هفته ششم", planPath: "/nutrition/week-6/plan" },
    { label: "هفته هفتم", planPath: "/nutrition/week-7/plan" },
    { label: "هفته هشتم", planPath: "/nutrition/week-8/plan" },
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center p-4 sm:p-6 md:p-8 max-w-[1200px] mx-auto"
    >
      <div className="w-full flex justify-end mb-4">
        <img
          src={assets.back}
          alt="بازگشت"
          className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform duration-200"
          onClick={() => navigate(-1)}
        />
      </div>

      <h1 className="text-2xl font-bold text-[#055B5C] mb-6">برنامه تغذیه</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-4">
        {nutritionItems.map((item, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            onClick={() => navigate(item.planPath)}
            className="flex flex-col items-center justify-between border-2 border-[#055B5C] rounded-lg px-4 py-6 cursor-pointer
              hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out bg-[#D1E7D8]"
          >
            <p className="text-sm font-extrabold text-[#FF6600] mb-4">
              {item.label}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(item.planPath);
              }}
              className="bg-[#055B5C] text-white text-sm font-medium px-4 py-2 rounded-md
                hover:bg-[#044a4b] transition-colors duration-200"
            >
              دیدن برنامه تغذیه
            </button>
          </motion.div>
        ))}
      </div>

      <ScrollToTopButton />
    </motion.div>
  );
};

export default NutritionProgram;
