import React from "react";
import ClassTableWithCoach from "../../components/Landing/ClassTableWithCoach";
import ScrollToTopButton from "../../components/ScrollToTopButton";

const OneYearPlan = () => {
  return (
    <div className="py-10 px-4">
      <h1 className="text-center text-base sm:text-xl md:text-2xl font-bold text-[#055B5C] mb-4 sm:mb-6 leading-relaxed">
        VIP برنامه <br /> مربی اختصاصی و باشگاه خصوصی
      </h1>
      <ClassTableWithCoach
        category="بدنسازی"
        classType="VIP"
        classList={[
          {
            id: 1,
            coach: "پردیس محمدی",
            capacity: 8,
            sessionOptions: [
              { sessions: 8, price: "۱,۵۰۰,۰۰۰ ریال" },
              { sessions: 12, price: "۲,۰۰۰,۰۰۰ ریال" },
              { sessions: 16, price: "۲,۴۰۰,۰۰۰ ریال" },
              { sessions: 20, price: "۲,۷۰۰,۰۰۰ ریال" },
            ],
          },
          {
            id: 2,
            coach: "نازنین عزتی",
            capacity: 0,
            sessionOptions: [
              { sessions: 8, price: "۱,۴۰۰,۰۰۰ ریال" },
              { sessions: 12, price: "۱,۸۰۰,۰۰۰ ریال" },
              { sessions: 16, price: "۲,۲۵۰,۰۰۰ ریال" },
              { sessions: 20, price: "۲,۵۰۰,۰۰۰ ریال" },
            ],
          },
          // کلاس‌های بیشتر...
        ]}
      />

      <ScrollToTopButton />
    </div>
  );
};

export default OneYearPlan;
