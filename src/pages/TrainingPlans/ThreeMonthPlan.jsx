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
            id: 1,
            coach: "یگانه عالمی",
            capacity: 3,
            sessionOptions: [
              { sessions: 8, price: "۱,۳۰۰,۰۰۰ ریال" },
              { sessions: 12, price: "۱,۷۰۰,۰۰۰ ریال" },
              { sessions: 16, price: "۲,۰۵۰,۰۰۰ ریال" },
              { sessions: 20, price: "۲,۳۰۰,۰۰۰ ریال" },
            ],
          },
          {
            id: 2,
            coach: "آتنا حسینی",
            capacity: 0,
            sessionOptions: [
              { sessions: 8, price: "۱,۴۰۰,۰۰۰ تومان" },
              { sessions: 12, price: "۱,۸۰۰,۰۰۰ تومان" },
              { sessions: 16, price: "۲,۲۵۰,۰۰۰ تومان" },
              { sessions: 20, price: "۲,۵۰۰,۰۰۰ تومان" },
            ],
          },
          {
            id: 3,
            coach: "مریم عیدی",
            capacity: 5,
            sessionOptions: [
              { sessions: 8, price: "۱,۶۰۰,۰۰۰ تومان" },
              { sessions: 12, price: "۲,۰۰۰,۰۰۰ تومان" },
              { sessions: 16, price: "۲,۴۰۰,۰۰۰ تومان" },
              { sessions: 20, price: "۲,۷۰۰,۰۰۰ تومان" },
            ],
          },
        ]}
      />
      <ScrollToTopButton />
    </div>
  );
};

export default ThreeMonthPlan;
