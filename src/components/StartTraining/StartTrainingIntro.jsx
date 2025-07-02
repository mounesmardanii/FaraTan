import React from "react";
import { assets } from "../../assets/assets";
import { motion } from "framer-motion";
import StartTrainingFooter from "../StartTraining/StartTrainingFooter";
import { useNavigate } from "react-router-dom";

const StartTrainingIntro = () => {
  const coaches = [
    { name: "مریم عیدی", label: "نمایش برنامه تمرینی" },
    { name: "مریم عیدی", label: "نمایش برنامه تمرینی" },
    { name: "مریم عیدی", label: "نمایش برنامه تمرینی" },
    { name: "مریم عیدی", label: "نمایش برنامه تمرینی" },
  ];

  const navigate = useNavigate();

  return (
    <section className="bg-[#D1E7D8] rounded-t-[32px] border-t-2 border-l-2 border-r-2 border-[#055B5C] border-b-0 px-6 md:px-16 py-10 md:py-14 text-center mt-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-center gap-3 mb-6 -mt-6">
        <motion.img
          src={assets.BodybuildingPic}
          alt="BodybuildingPic"
          className="w-12 h-12 md:w-14 md:h-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.h2
          className="text-[#055B5C] text-xl md:text-2xl font-bold mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          بدنسازی
        </motion.h2>
      </div>

      <motion.p
        className="text-[#055B5C] text-base md:text-lg leading-relaxed font-extrabold max-w-3xl mx-auto mt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        بدنسازی یعنی ساختن بدنی قوی، ذهنی متمرکز و سبک‌زندگی سالم. با تمرینات
        اصولی و راهنمایی مربیان حرفه‌ای، به تناسب اندام، قدرت و اعتمادبه‌نفس
        دلخواهت برس
      </motion.p>

      <motion.h3
        className="text-[#FF6600] mt-16 mb-8 font-extrabold text-base md:text-xl text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        (: با مربی‌های بدنسازی فراتن آشنا شو
      </motion.h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-center items-center mt-25 cursor-pointer">
        {coaches.map((coach, index) => (
          <motion.div
            key={index}
            onClick={() => navigate(`/coach/${coach.id}`)}
            className="flex flex-col items-center gap-2 bg-[#F2F2F2] rounded-[150px] py-6 shadow-md w-[200px] h-[300px] hover:scale-105 transition-transform"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: index * 0.2 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              transition: { duration: 0.3 },
            }}
          >
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-inner border-2 border-[#055B5C]">
              <motion.img
                src={assets.woman1}
                alt={coach.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="text-[#055B5C] font-bold text-[14px] mt-8">
              {coach.name}
            </div>
            <motion.button
              className="bg-[#FF6600] text-white text-[12px] px-3 py-1 rounded-full hover:bg-orange-500 transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05, backgroundColor: "#FF5500" }}
              whileTap={{ scale: 0.95 }}
            >
              {coach.label}
            </motion.button>
          </motion.div>
        ))}
      </div>
      <StartTrainingFooter />
    </section>
  );
};

export default StartTrainingIntro;
