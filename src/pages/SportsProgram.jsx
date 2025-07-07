import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const SportsProgram = () => {
  const navigate = useNavigate();

  const [workoutItems] = useState([
    {
      label: "جلسه اول بدنسازی",
      path: "/sports-program/session-1",
      videoPath: "/sports-program/session-1/video",
    },
    {
      label: "جلسه دوم بدنسازی",
      path: "/sports-program/session-2",
      videoPath: "/sports-program/session-2/video",
    },
    {
      label: "جلسه سوم بدنسازی",
      path: "/sports-program/session-3",
      videoPath: "/sports-program/session-3/video",
    },
    {
      label: "جلسه چهارم بدنسازی",
      path: "/sports-program/session-4",
      videoPath: "/sports-program/session-4/video",
    },
    {
      label: "جلسه پنجم بدنسازی",
      path: "/sports-program/session-5",
      videoPath: "/sports-program/session-5/video",
    },
    {
      label: "جلسه ششم بدنسازی",
      path: "/sports-program/session-6",
      videoPath: "/sports-program/session-6/video",
    },
    {
      label: "جلسه هفتم بدنسازی",
      path: "/sports-program/session-7",
      videoPath: "/sports-program/session-7/video",
    },
    {
      label: "جلسه هشتم بدنسازی",
      path: "/sports-program/session-8",
      videoPath: "/sports-program/session-8/video",
    },
  ]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      rotateY: 90,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      rotateY: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center p-4 sm:p-6 md:p-8 max-w-[1200px] mx-auto"
    >
      {/* دکمه برگشت */}
      <div className="w-full flex justify-end mb-4">
        <img
          src={assets.back}
          alt="بازگشت"
          className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform duration-200"
          onClick={() => navigate(-1)}
        />
      </div>

      {/* عنوان */}
      <h1 className="text-2xl font-bold text-[#055B5C] mb-6">برنامه ورزشی</h1>

      {/* لیست جلسات با انیمیشن چرخش */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-4 w-full"
      >
        {workoutItems.map((item, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-between border-2 border-[#055B5C] rounded-lg px-4 py-6 cursor-pointer
              hover:shadow-xl hover:rotate-1 hover:scale-105 transition-all duration-300 bg-[#D1E7D8]"
          >
            <p className="text-sm font-extrabold text-[#FF6600] mb-4">
              {item.label}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(item.videoPath);
              }}
              className="bg-[#055B5C] text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-[#044a4b] transition"
            >
              دیدن ویدیو
            </button>
          </motion.div>
        ))}
      </motion.div>

      <ScrollToTopButton />
    </motion.div>
  );
};

export default SportsProgram;
