import React from "react";
import { useAuth } from "../context/AuthContext";
import ProfileInfoCard from "../components/Profile/ProfileInfoCard";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { motion } from "framer-motion";
import UserDashboard from "../pages/UserDashboard";

// انیمیشن
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="relative p-4 sm:p-6 md:p-8 max-w-[1400px] w-full mx-auto mt-8">
      <div className="flex flex-col gap-2 sm:gap-2 min-[800px]:flex-row min-[800px]:items-start ml-20">
        {/* ستون پروفایل (کوچک‌تر و نزدیک‌تر) */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={1}
          className="w-full min-[800px]:w-[300px]"
        >
          <ProfileInfoCard />
        </motion.div>

        {/* ستون داشبورد کاربر */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={2}
          className="w-full"
        >
          <UserDashboard />
        </motion.div>
      </div>

      <ScrollToTopButton />
    </div>
  );
};

export default ProfilePage;
