import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const SportsProgram = () => {
  const navigate = useNavigate();
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);

  const [workoutItems] = useState([
    {
      label: "حرکت اول بدنسازی",
      path: "/sports-program/movement-1",
      videoPath: "https://example.com/videos/movement-1.mp4", // URL placeholder
    },
    {
      label: "حرکت دوم بدنسازی",
      path: "/sports-program/movement-2",
      videoPath: "https://example.com/videos/movement-2.mp4",
    },
    {
      label: "حرکت سوم بدنسازی",
      path: "/sports-program/movement-3",
      videoPath: "https://example.com/videos/movement-3.mp4",
    },
    {
      label: "حرکت چهارم بدنسازی",
      path: "/sports-program/movement-4",
      videoPath: "https://example.com/videos/movement-4.mp4",
    },
    {
      label: "حرکت پنجم بدنسازی",
      path: "/sports-program/movement-5",
      videoPath: "https://example.com/videos/movement-5.mp4",
    },
    {
      label: "حرکت ششم بدنسازی",
      path: "/sports-program/movement-6",
      videoPath: "https://example.com/videos/movement-6.mp4", // جایگزین مسیر محلی
    },
    {
      label: "حرکت هفتم بدنسازی",
      path: "/sports-program/movement-7",
      videoPath: "https://example.com/videos/movement-7.mp4",
    },
    {
      label: "حرکت هشتم بدنسازی",
      path: "/sports-program/movement-8",
      videoPath: "https://example.com/videos/movement-8.mp4",
    },
  ]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const openVideoModal = (url) => {
    setSelectedVideoUrl(url);
    setVideoModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
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

      {/* لیست حرکات با انیمیشن */}
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
            whileHover={{ y: -10, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
            className="flex flex-col items-center justify-between border-2 border-[#055B5C] rounded-lg px-4 py-6 transition-all duration-300 bg-[#D1E7D8]"
          >
            <p className="text-sm font-extrabold text-[#FF6600] mb-4">
              {item.label}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openVideoModal(item.videoPath);
              }}
              className="bg-[#055B5C] text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-[#044a4b] transition cursor-pointer"
            >
              دیدن ویدیو
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal برای پخش ویدیو */}
      {videoModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white p-4 rounded-lg max-w-lg w-full text-right">
            {selectedVideoUrl ? (
              <video
                controls
                src={selectedVideoUrl}
                className="w-full h-auto rounded-md"
                autoPlay
              />
            ) : (
              <p className="text-red-500">ویدیو در دسترس نیست</p>
            )}
            <button
              onClick={() => setVideoModalOpen(false)}
              className="mt-4 text-red-500 hover:text-red-700 cursor-pointer"
            >
              بستن
            </button>
          </div>
        </motion.div>
      )}

      <ScrollToTopButton />
    </motion.div>
  );
};

export default SportsProgram;
