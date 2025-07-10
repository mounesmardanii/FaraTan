import React from "react";
import ClassTableWithCoach from "../../components/Landing/ClassTableWithCoach";
import ScrollToTopButton from "../../components/ScrollToTopButton";

const SixMonthPlan = () => {
  return (
    <div className="py-10 px-4">
      <h1 className="text-center text-base sm:text-xl md:text-2xl font-bold text-[#055B5C] mb-4 sm:mb-6 leading-relaxed">
        برنامه خصوصی <br /> مربی اختصاصی شما در کنار شما
      </h1>
      <ClassTableWithCoach
        category="بدنسازی"
        classType="خصوصی"
        classList={[
          {
            id: 1,
            day: "شنبه",
            level: "پیشرفته",
            price: "۲,۵۰۰,۰۰۰ تومان",
            coach: "هستی بخشی",
            status: "ظرفیت دارد",
          },
          {
            id: 2,
            day: "سه‌شنبه",
            level: "متوسط",
            price: "۲,۰۰۰,۰۰۰ تومان",
            coach: "پردیس محمدی",
            status: "ظرفیت دارد",
          },
          {
            id: 2,
            day: "سه‌شنبه",
            level: "متوسط",
            price: "۲,۰۰۰,۰۰۰ تومان",
            coach: "نازنین عزتی",
            status: "تکمیل شده",
          },
          {
            id: 2,
            day: "سه‌شنبه",
            level: "متوسط",
            price: "۲,۰۰۰,۰۰۰ تومان",
            coach: "نیکی امیری",
            status: "ظرفیت دارد",
          },
          {
            id: 2,
            day: "سه‌شنبه",
            level: "متوسط",
            price: "۲,۰۰۰,۰۰۰ تومان",
            coach: "بهاره نصیری",
            status: "تکمیل شده",
          },
          {
            id: 2,
            day: "سه‌شنبه",
            level: "متوسط",
            price: "۲,۰۰۰,۰۰۰ تومان",
            coach: "مریم عیدی",
            status: "ظرفیت دارد",
          },
          {
            id: 2,
            day: "سه‌شنبه",
            level: "متوسط",
            price: "۲,۰۰۰,۰۰۰ تومان",
            coach: "یگانه عالمی",
            status: "ظرفیت دارد",
          },
          {
            id: 2,
            day: "سه‌شنبه",
            level: "متوسط",
            price: "۲,۰۰۰,۰۰۰ تومان",
            coach: "آتنا حسینی",
            status: "ظرفیت دارد",
          },
        ]}
      />
      <ScrollToTopButton />
    </div>
  );
};

export default SixMonthPlan;
