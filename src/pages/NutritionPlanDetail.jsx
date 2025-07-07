import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { assets } from "../assets/assets";

const NutritionPlanDetail = () => {
  const { weekId } = useParams();
  const navigate = useNavigate();

  const nutritionPlan = {
    "week-1": [
      {
        day: "روز 1",
        breakfast: "نان و پنیر",
        snack: "موز",
        lunch: "عدس پلو",
        dinner: "سوپ جو",
        eveningSnack: "ماست",
      },
      {
        day: "روز 2",
        breakfast: "تخم مرغ و نان",
        snack: "سیب",
        lunch: "قرمه سبزی",
        dinner: "سوپ سبزیجات",
        eveningSnack: "شیر",
      },
      {
        day: "روز 3",
        breakfast: "املت",
        snack: "خرما",
        lunch: "زرشک پلو",
        dinner: "سالاد مرغ",
        eveningSnack: "ماست یونانی",
      },
      {
        day: "روز 4",
        breakfast: "نان و عسل",
        snack: "پرتقال",
        lunch: "کباب کوبیده",
        dinner: "سوپ قارچ",
        eveningSnack: "شیر بادام",
      },
      {
        day: "روز 5",
        breakfast: "پنکیک",
        snack: "انگور",
        lunch: "خورشت قیمه",
        dinner: "سالاد تن ماهی",
        eveningSnack: "ماست چکیده",
      },
      {
        day: "روز 6",
        breakfast: "تخم مرغ آب‌پز",
        snack: "هلو",
        lunch: "لوبیا پلو",
        dinner: "سوپ عدس",
        eveningSnack: "شیر گرم",
      },
      {
        day: "روز 7",
        breakfast: "نان و مربا",
        snack: "سیب سبز",
        lunch: "خورشت کرفس",
        dinner: "سوپ مرغ",
        eveningSnack: "ماست ساده",
      },
    ],
    "week-2": [
      {
        day: "روز 1",
        breakfast: "املت گوجه",
        snack: "گردو",
        lunch: "مرغ کبابی",
        dinner: "سالاد مرغ",
        eveningSnack: "خرما",
      },
      {
        day: "روز 2",
        breakfast: "نان و عسل",
        snack: "پرتقال",
        lunch: "کباب کوبیده",
        dinner: "سوپ قارچ",
        eveningSnack: "ماست یونانی",
      },
      {
        day: "روز 3",
        breakfast: "تخم مرغ نیمرو",
        snack: "موز",
        lunch: "خورشت بادمجان",
        dinner: "سالاد سبزیجات",
        eveningSnack: "شیر",
      },
      {
        day: "روز 4",
        breakfast: "نان و پنیر",
        snack: "سیب",
        lunch: "عدس پلو",
        dinner: "سوپ جو",
        eveningSnack: "ماست",
      },
      {
        day: "روز 5",
        breakfast: "پنکیک و عسل",
        snack: "انگور",
        lunch: "زرشک پلو",
        dinner: "سالاد تن ماهی",
        eveningSnack: "شیر بادام",
      },
      {
        day: "روز 6",
        breakfast: "تخم مرغ آب‌پز",
        snack: "خرما",
        lunch: "خورشت قیمه",
        dinner: "سوپ عدس",
        eveningSnack: "ماست چکیده",
      },
      {
        day: "روز 7",
        breakfast: "نان و مربا",
        snack: "کیوی",
        lunch: "خورشت کرفس",
        dinner: "سوپ مرغ",
        eveningSnack: "ماست ساده",
      },
    ],
    "week-3": [
      {
        day: "روز 1",
        breakfast: "پنکیک و عسل",
        snack: "انگور",
        lunch: "زرشک پلو",
        dinner: "سالاد تن ماهی",
        eveningSnack: "شیر بادام",
      },
      {
        day: "روز 2",
        breakfast: "تخم مرغ آب‌پز",
        snack: "خرما",
        lunch: "خورشت قیمه",
        dinner: "سوپ عدس",
        eveningSnack: "ماست چکیده",
      },
      {
        day: "روز 3",
        breakfast: "نان و مربا",
        snack: "کیوی",
        lunch: "خورشت کرفس",
        dinner: "سوپ مرغ",
        eveningSnack: "ماست ساده",
      },
      {
        day: "روز 4",
        breakfast: "املت قارچ",
        snack: "آناناس",
        lunch: "کباب تابه‌ای",
        dinner: "سالاد کاهو",
        eveningSnack: "شیر گرم",
      },
      {
        day: "روز 5",
        breakfast: "نان و کره بادام زمینی",
        snack: "توت فرنگی",
        lunch: "خورشت بامیه",
        dinner: "سوپ عدس",
        eveningSnack: "ماست چکیده",
      },
      {
        day: "روز 6",
        breakfast: "تخم مرغ و نان",
        snack: "سیب",
        lunch: "قرمه سبزی",
        dinner: "سوپ سبزیجات",
        eveningSnack: "شیر",
      },
      {
        day: "روز 7",
        breakfast: "نان و پنیر",
        snack: "موز",
        lunch: "عدس پلو",
        dinner: "سوپ جو",
        eveningSnack: "ماست",
      },
    ],
    "week-4": [
      {
        day: "روز 1",
        breakfast: "نان و کره بادام زمینی",
        snack: "توت فرنگی",
        lunch: "خورشت بامیه",
        dinner: "سوپ عدس",
        eveningSnack: "ماست چکیده",
      },
      {
        day: "روز 2",
        breakfast: "تخم مرغ و نان",
        snack: "سیب",
        lunch: "قرمه سبزی",
        dinner: "سوپ سبزیجات",
        eveningSnack: "شیر",
      },
      {
        day: "روز 3",
        breakfast: "نان و پنیر",
        snack: "موز",
        lunch: "عدس پلو",
        dinner: "سوپ جو",
        eveningSnack: "ماست",
      },
      {
        day: "روز 4",
        breakfast: "املت",
        snack: "خرما",
        lunch: "زرشک پلو",
        dinner: "سالاد مرغ",
        eveningSnack: "ماست یونانی",
      },
      {
        day: "روز 5",
        breakfast: "نان و عسل",
        snack: "پرتقال",
        lunch: "کباب کوبیده",
        dinner: "سوپ قارچ",
        eveningSnack: "شیر بادام",
      },
      {
        day: "روز 6",
        breakfast: "پنکیک",
        snack: "انگور",
        lunch: "خورشت قیمه",
        dinner: "سالاد تن ماهی",
        eveningSnack: "ماست چکیده",
      },
      {
        day: "روز 7",
        breakfast: "تخم مرغ آب‌پز",
        snack: "هلو",
        lunch: "لوبیا پلو",
        dinner: "سوپ عدس",
        eveningSnack: "شیر گرم",
      },
    ],
    "week-5": [
      {
        day: "روز 1",
        breakfast: "تخم مرغ آب‌پز",
        snack: "هلو",
        lunch: "لوبیا پلو",
        dinner: "سالاد سبزیجات",
        eveningSnack: "شیر کاکائو",
      },
      {
        day: "روز 2",
        breakfast: "نان و پنیر",
        snack: "موز",
        lunch: "عدس پلو",
        dinner: "سوپ جو",
        eveningSnack: "ماست",
      },
      {
        day: "روز 3",
        breakfast: "املت",
        snack: "خرما",
        lunch: "زرشک پلو",
        dinner: "سالاد مرغ",
        eveningSnack: "ماست یونانی",
      },
      {
        day: "روز 4",
        breakfast: "نان و عسل",
        snack: "پرتقال",
        lunch: "کباب کوبیده",
        dinner: "سوپ قارچ",
        eveningSnack: "شیر بادام",
      },
      {
        day: "روز 5",
        breakfast: "پنکیک",
        snack: "انگور",
        lunch: "خورشت قیمه",
        dinner: "سالاد تن ماهی",
        eveningSnack: "ماست چکیده",
      },
      {
        day: "روز 6",
        breakfast: "تخم مرغ نیمرو",
        snack: "سیب",
        lunch: "خورشت بادمجان",
        dinner: "سوپ سبزیجات",
        eveningSnack: "شیر",
      },
      {
        day: "روز 7",
        breakfast: "نان و مربا",
        snack: "کیوی",
        lunch: "خورشت کرفس",
        dinner: "سوپ مرغ",
        eveningSnack: "ماست ساده",
      },
    ],
    "week-6": [
      {
        day: "روز 1",
        breakfast: "نان و خامه",
        snack: "انبه",
        lunch: "قیمه",
        dinner: "سوپ کدو",
        eveningSnack: "ماست میوه‌ای",
      },
      {
        day: "روز 2",
        breakfast: "تخم مرغ و نان",
        snack: "سیب",
        lunch: "قرمه سبزی",
        dinner: "سوپ سبزیجات",
        eveningSnack: "شیر",
      },
      // Add more days
    ],
    "week-7": [
      {
        day: "روز 1",
        breakfast: "املت قارچ",
        snack: "آناناس",
        lunch: "کباب تابه‌ای",
        dinner: "سالاد کاهو",
        eveningSnack: "شیر گرم",
      },
      // Add more days
    ],
    "week-8": [
      {
        day: "روز 1",
        breakfast: "نان و مربا",
        snack: "کیوی",
        lunch: "خورشت کرفس",
        dinner: "سوپ مرغ",
        eveningSnack: "ماست ساده",
      },
      // Add more days
    ],
  };

  const weekData = nutritionPlan[weekId] || nutritionPlan["week-1"];
  if (!weekData) {
    console.error("No data for weekId:", weekId);
    return <div>خطا: داده‌ای برای این هفته پیدا نشد.</div>;
  }

  return (
    <div className="flex flex-col items-center p-4 sm:p-6 md:p-8 max-w-[1200px] mx-auto">
      <div className="w-full flex justify-end mb-4">
        <img
          src={assets.back}
          alt="بازگشت"
          className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform duration-200"
          onClick={() => navigate(-1)}
        />
      </div>
      <h1 className="text-2xl font-bold text-[#055B5C] mb-6">
        برنامه تغذیه - هفته {weekId.replace("week-", "")}
      </h1>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-center border-collapse border-2 border-[#055B5C] bg-[#D1E7D8]">
          <thead>
            <tr className="bg-[#055B5C] text-white">
              <th className="border-2 border-[#055B5C] p-2">شام</th>
              <th className="border-2 border-[#055B5C] p-2">میان وعده شب</th>
              <th className="border-2 border-[#055B5C] p-2">ناهار</th>
              <th className="border-2 border-[#055B5C] p-2">میان وعده</th>
              <th className="border-2 border-[#055B5C] p-2">صبحانه</th>
              <th className="border-2 border-[#055B5C] p-2">روز</th>
            </tr>
          </thead>
          <tbody>
            {weekData.map((day, index) => (
              <tr key={index} className="border-2 border-[#055B5C]">
                <td className="border-2 border-[#055B5C] p-2">{day.dinner}</td>
                <td className="border-2 border-[#055B5C] p-2">
                  {day.eveningSnack}
                </td>
                <td className="border-2 border-[#055B5C] p-2">{day.lunch}</td>
                <td className="border-2 border-[#055B5C] p-2">{day.snack}</td>
                <td className="border-2 border-[#055B5C] p-2">
                  {day.breakfast}
                </td>
                <td className="border-2 border-[#055B5C] p-2">{day.day}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default NutritionPlanDetail;
