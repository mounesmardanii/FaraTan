import React from 'react';
import { assets } from '../../assets/assets';

const cardData = [
  {
    title: 'برنامه ۱ ساله – سرمایه‌گذاری روی بدن و ذهن',
    description: 'تعهد یک‌ساله یعنی جدی گرفتن خودت، در این مسیر ما همراهت هستیم',
    points: [
      'بهترین قیمت نسبت به مدت',
      'برنامه‌ریزی دقیق بلندمدت',
      'پشتیبانی مداوم مربیان',
    ],
    footer: '!سال جدید رو با خودی قوی‌تر شروع کن',
    crown: true,
  },
  {
    title: 'برنامه ۶ ماهه – ثبات، پیشرفت، انگیزه',
    description: 'با این پلن به قدم ذهنت نزدیک‌تر می‌شی و پیشرفت واقعی رو حس می‌کنی',
    points: [
      'مناسب برای ادامه‌دهنده‌ها',
      'ترکیب برنامه تغذیه و تمرین',
      'پیگیری و ارزیابی منظم',
    ],
    footer: '!نیم‌سال سلامتی رو با انگیزه بساز',
  },
  {
    title: 'برنامه ۳ ماهه – شروعی برای تغییر',
    description: 'اگر تازه می‌خوای ورزش رو شروع کنی یا به دنبال یک بازگشت جدی هستی، این دوره نقطه‌ی شروعه',
    points: [
      'مناسب برای مبتدی‌ها',
      'رسیدن به فرم اولیه بدن',
      'ایجاد عادت ورزشی منظم',
    ],
    footer: '!همین امروز شروع کن و خودتو به چالش بکش',
  },
];

const TrainingCard = ({ title, description, points, footer, crown }) => (
  <div
    className={`relative bg-[#D1E7D8] rounded-3xl p-4 md:p-6 w-full md:w-1/3 shadow-md text-xs md:text-sm leading-relaxed text-right cursor-pointer transition-all duration-300 transform hover:scale-105 hover:brightness-95 ${crown ? 'border-2 border-yellow-400' : ''
      }`}
  >
    <h3 className="font-extrabold text-[#055B5C] mb-2 text-sm md:text-base leading-snug">
      {title}
    </h3>
    <p className="mb-3 text-[11px] md:text-sm">{description}</p>

    <ul className="space-y-2 text-[11px] md:text-sm">
      {points.map((point, index) => (
        <li key={index} className="flex flex-row-reverse items-start gap-2">
          <span className="text-green-700">✔️</span>
          <span>{point}</span>
        </li>
      ))}
    </ul>

    <p className="mt-4 font-bold text-[#055B5C] text-[11px] md:text-sm">{footer}</p>

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
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
        {cardData.map((card, idx) => (
          <TrainingCard key={idx} {...card} />
        ))}
      </div>
    </div>
  );
}

export default TrainingPackages;
