import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets";

const CoachInfoCard = () => {
  const [initialValues, setInitialValues] = useState({
    name: "",
    age: "",
    phone: "",
    specialty: "",
    experience: "",
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("coach"));
    if (saved) {
      setInitialValues(saved);
    } else {
      setInitialValues({
        name: "مریم عبدی",
        age: 31,
        phone: "09116868921",
        specialty: "یوگا",
        experience: "۸ سال",
      });
    }
  }, []);

  return (
    <div className="flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-full min-[800px]:max-w-[400px] min-w-[250px] h-[400px] mt-15 mx-2 sm:mx-4 font-[Tahoma] text-right border border-[#D1E7D8] rounded-4xl shadow-md p-4 bg-[#D1E7D8]
        max-sm:w-[350px]" // 👈 عرض یکسان در موبایل
      >
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          src={assets.woman1}
          className="w-28 h-28 object-cover rounded-xl absolute -left-10 -top-12 z-10"
        />

        <div className="flex flex-col justify-start h-full mt-10 gap-2 text-gray-800 text-[15px] leading-relaxed">
          <h2 className="text-[#FF6600] font-extrabold text-[18px] border-b border-[#ccc] pb-1">
            {initialValues.name}
          </h2>
          <p>
            <span className="text-[#256250] font-semibold">تخصص:</span>{" "}
            {initialValues.specialty}
          </p>
          <p>
            <span className="text-[#256250] font-semibold">سابقه کاری:</span>{" "}
            {initialValues.experience}
          </p>
          <p>
            <span className="text-[#256250] font-semibold">سن:</span>{" "}
            {initialValues.age} سال
          </p>
          <p>
            <span className="text-[#256250] font-semibold">شماره تماس:</span>{" "}
            <a
              href={`tel:${initialValues.phone}`}
              className="text-[#256250] hover:underline font-semibold"
            >
              {initialValues.phone}
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
