import React from "react";
import ClassTableWithCoach from "../../components/Landing/ClassTableWithCoach";
import ScrollToTopButton from "../../components/ScrollToTopButton";

const ThreeMonthPlan = () => {
  return (
    <div className="py-10 px-4">
      <h1 className="text-center text-base sm:text-xl md:text-2xl font-bold text-[#055B5C] mb-4 sm:mb-6 leading-relaxed">
        برنامه عمومی
        <br /> تمرینات شخصی‌سازی‌شده بدون نیاز به مربی
      </h1>
      <ClassTableWithCoach
        category="بدنسازی"
        classType="عمومی"
        classList={[
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
            status: "تکمیل شده",
          },
          {
            id: 1,
            day: "شنبه",
            level: "پیشرفته",
            price: "۲,۵۰۰,۰۰۰ تومان",
            coach: "مریم عیدی",
            status: "ظرفیت دارد",
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
            status: "تکمیل شده",
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

export default ThreeMonthPlan;
