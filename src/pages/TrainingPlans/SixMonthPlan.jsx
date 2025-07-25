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
            coach: "هستی بخشی",
            capacity: 5,
            sessionOptions: [
              { sessions: 8, price: "۱,۶۰۰,۰۰۰ ریال" },
              { sessions: 12, price: "۲,۱۰۰,۰۰۰ ریال" },
              { sessions: 16, price: "۲,۵۵۰,۰۰۰ ریال" },
              { sessions: 20, price: "۲,۹۰۰,۰۰۰ ریال" },
            ],
          },
          {
            id: 2,
            coach: "پردیس محمدی",
            capacity: 6,
            sessionOptions: [
              { sessions: 8, price: "۱,۵۰۰,۰۰۰ تومان" },
              { sessions: 12, price: "۲,۰۰۰,۰۰۰ تومان" },
              { sessions: 16, price: "۲,۴۰۰,۰۰۰ تومان" },
              { sessions: 20, price: "۲,۷۰۰,۰۰۰ تومان" },
            ],
          },
          {
            id: 3,
            coach: "نازنین عزتی",
            capacity: 0,
            sessionOptions: [
              { sessions: 8, price: "۱,۴۰۰,۰۰۰ تومان" },
              { sessions: 12, price: "۱,۸۰۰,۰۰۰ تومان" },
              { sessions: 16, price: "۲,۲۵۰,۰۰۰ تومان" },
              { sessions: 20, price: "۲,۵۰۰,۰۰۰ تومان" },
            ],
          },
          {
            id: 4,
            coach: "نیکی امیری",
            capacity: 4,
            sessionOptions: [
              { sessions: 8, price: "۱,۵۰۰,۰۰۰ تومان" },
              { sessions: 12, price: "۱,۹۰۰,۰۰۰ تومان" },
              { sessions: 16, price: "۲,۳۰۰,۰۰۰ تومان" },
              { sessions: 20, price: "۲,۶۰۰,۰۰۰ تومان" },
            ],
          },
        ]}
      />
      <ScrollToTopButton />
    </div>
  );
};

export default SixMonthPlan;
