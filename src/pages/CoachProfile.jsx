import React from "react";
import { motion } from "framer-motion";
import ClassTable from "../components/Coach/ClassTable";
import CoachInfoCard from "../components/Coach/CoachInfoCard";
import ScrollToTopButton from "../components/ScrollToTopButton";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.2, duration: 0.5, ease: "easeOut" },
  }),
};

const CoachProfile = () => {
  return (
    <div className="relative p-4 sm:p-6 md:p-8 max-w-[1400px] w-full mx-auto mt-8">
      <div className="flex flex-col-reverse justify-center items-center gap-4 sm:gap-6 md:gap-8 min-[800px]:items-start min-[800px]:flex-row-reverse">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={1}
        >
          <ClassTable />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={2}
        >
          <CoachInfoCard />
        </motion.div>
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default CoachProfile;
