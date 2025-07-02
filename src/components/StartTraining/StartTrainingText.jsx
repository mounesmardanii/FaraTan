import React from "react";
import { motion } from "framer-motion";

const StartTrainingText = () => {
  return (
    <div className="text-center my-12">
      <motion.h1
        className="text-2xl md:text-3xl font-extrabold text-[#055B5C] mb-3"
        initial={{ opacity: 0, y: 40, rotate: -5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        !فراتر از حد توان خودت برو
      </motion.h1>

      <motion.span
        className="text-[#FF6600] text-sm md:text-base font-semibold block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
      >
        !همین حالا شروع کن و قدرتت رو کشف کن
      </motion.span>
    </div>
  );
};

export default StartTrainingText;
