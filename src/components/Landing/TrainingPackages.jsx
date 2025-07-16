import React from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const cardData = [
  {
    title: " VIP برنامه",
    description:
      "شامل مربی اختصاصی و استفاده از باشگاه به‌صورت خصوصی است، هیچ‌کس جز شما و مربی در باشگاه نیست",
    points: [
      "مربی اختصاصی برای تمرینات شما",
      "استفاده از باشگاه به‌صورت خصوصی",
      "برنامه‌ریزی دقیق برای تمامی نیازهای شما",
    ],
    footer: "مربی اختصاصی و باشگاه خصوصی، تجربه‌ای بی‌نظیر از تمرینات بدنسازی",
    crown: true,
    path: "/plan/1year",
  },
  {
    title: "برنامه خصوصی",
    description:
      "مربی مخصوص شماست و تمامی تمرینات به‌طور کامل زیر نظر مربی انجام می‌شود",
    points: [
      "مربی اختصاصی برای تمرینات شما",
      "پیگیری و ارزیابی مداوم تمرینات",
      "تمرینات شخصی‌سازی‌شده بر اساس نیازهای شما",
    ],
    footer:
      "تمرینات شما تحت نظر مربی حرفه‌ای، آماده برای دستیابی به بهترین نتایج",
    path: "/plan/6months",
  },
  {
    title: "برنامه عمومی ",
    description:
      " فرد خود به تمرینات پرداخته و می‌تواند بر اساس برنامه ارائه‌شده، تمرینات را به‌صورت شخصی انجام دهد.",
    points: [
      "تمرینات شخصی‌سازی‌شده برای افرادی که به‌طور مستقل تمرین می‌کنند",
      "مدیریت خودکار برنامه تمرینی بدون نیاز به مربی",
      "تمرینات انعطاف‌پذیر بر اساس نیازها و اهداف فردی",
    ],
    footer: "با تمرینات شخصی خودت، قدم اول رو بردار و به هدفت برس",
    path: "/plan/3months",
  },
];

const TrainingCard = ({
  title,
  description,
  points,
  footer,
  crown,
  onClick,
}) => (
  <div
    id="Card"
    onClick={onClick}
    className={`relative bg-[#D1E7D8] rounded-3xl p-4 md:p-6 w-full md:w-1/3 shadow-md text-xs md:text-sm leading-relaxed text-right cursor-pointer transition-all duration-300 transform hover:scale-105 hover:brightness-95 ${
      crown ? "border-2 border-[#ffa366]" : ""
    }`}
  >
    <div className="flex justify-center items-center">
      <h3 className="font-extrabold text-[#055B5C] mb-2 text-sm md:text-base leading-snug">
        {/* نمایش عنوان و اضافه کردن vip بعد از "برنامه" */}
        {title.split(" – ").map((part, index) =>
          index === 0 ? (
            <span key={index}>{part} </span>
          ) : (
            crown && (
              <span key={index} className="font-bold text-[#FF6600]">
                vip
              </span>
            )
          )
        )}
      </h3>
    </div>

    <p className="mb-3 text-[11px] md:text-sm">{description}</p>

    <ul className="space-y-2 text-[11px] md:text-sm">
      {points.map((point, index) => (
        <li key={index} className="flex flex-row-reverse items-start gap-2">
          <span className="text-green-700">✔️</span>
          <span>{point}</span>
        </li>
      ))}
    </ul>

    {/* وسط چین کردن فوتر */}
    <p className="mt-4 font-bold text-[#055B5C] text-[11px] md:text-sm text-center">
      {footer}
    </p>

    {crown && (
      <img
        src={assets.crown}
        alt="crown"
        className="absolute top-[-20px] md:top-[-32px] left-[-22px] w-10 h-10 md:w-12 md:h-12"
      />
    )}
  </div>
);

function TrainingPackages() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
        {cardData.map((card, idx) => (
          <TrainingCard
            key={idx}
            {...card}
            onClick={() => navigate(card.path)}
          />
        ))}
      </div>
    </div>
  );
}

export default TrainingPackages;
