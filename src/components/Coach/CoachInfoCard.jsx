import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";

const CoachInfoCard = ({ coachId }) => {
  console.log("coachId:", coachId);
  const { id } = useParams();
  const [coachData, setCoachData] = useState(null);
  const [age, setAge] = useState(null);
  const [experienceYears, setExperienceYears] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("coachesList");
    const allCoaches = JSON.parse(stored || "[]");
    const foundCoach = allCoaches.find((c) => c.id.toString() === coachId);

    if (foundCoach) {
      setCoachData(foundCoach);

      const birth = new Date(foundCoach.birthDate);
      const start = new Date(foundCoach.startDate);
      const now = new Date();

      const calculatedAge =
        now.getFullYear() -
        birth.getFullYear() -
        (now.getMonth() < birth.getMonth() ||
        (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())
          ? 1
          : 0);
      setAge(calculatedAge);

      const calculatedExp =
        now.getFullYear() -
        start.getFullYear() -
        (now.getMonth() < start.getMonth() ||
        (now.getMonth() === start.getMonth() && now.getDate() < start.getDate())
          ? 1
          : 0);
      setExperienceYears(calculatedExp);

      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [id]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date)
      ? date.toLocaleDateString("fa-IR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "نامشخص";
  };

  if (loading) {
    return (
      <div className="text-center mt-8 text-[#256250]">در حال بارگذاری...</div>
    );
  }

  if (!coachData) {
    return (
      <div className="text-center mt-8 text-red-600">
        .مربی موردنظر پیدا نشد
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-full min-[800px]:max-w-[400px] min-w-[250px] h-[400px] mt-15 mx-2 sm:mx-4 font-[Tahoma] text-right border border-[#D1E7D8] rounded-4xl shadow-md p-4 bg-[#D1E7D8] max-sm:w-[350px]"
      >
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          src={coachData.avatar || assets.woman1}
          className="w-28 h-28 object-cover rounded-xl absolute -left-10 -top-12 z-10"
        />

        <div className="flex flex-col justify-start h-full mt-10 gap-2 text-gray-800 text-[15px] leading-relaxed">
          <h2 className="text-[#FF6600] font-extrabold text-[18px] border-b border-[#ccc] pb-1">
            {coachData.name} {coachData.lastName}
          </h2>

          <p>
            <span className="text-[#256250] font-semibold">تخصص:</span>{" "}
            {coachData.specialty || "نامشخص"}
          </p>

          <p>
            <span className="text-[#256250] font-semibold">سابقه کاری:</span>{" "}
            {experienceYears !== null ? `${experienceYears} سال` : "نامشخص"}
          </p>

          <p>
            <span className="text-[#256250] font-semibold">تاریخ تولد:</span>{" "}
            {coachData.birthDate && age !== null
              ? `${formatDate(coachData.birthDate)} (${age} ساله)`
              : "نامشخص"}
          </p>

          <p>
            <span className="text-[#256250] font-semibold">شماره تماس:</span>{" "}
            <a
              href={`tel:${coachData.phoneNumber}`}
              className="text-[#256250] hover:underline font-semibold"
            >
              {coachData.phoneNumber || "نامشخص"}
            </a>
          </p>

          <p className="text-sm text-[#444] mt-3 leading-6 text-center border-t border-b border-[#ccc] py-3">
            مربی با تجربه در تمرینات ذهن و بدن، با تمرکز بر آرامش، انعطاف‌پذیری
            و بهبود کیفیت زندگی
            <br /> آماده‌ام تا در مسیر رشد جسمی و ذهنی همراهت باشم
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CoachInfoCard;
