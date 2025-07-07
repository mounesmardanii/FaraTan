import React, { useState, useEffect, useRef } from "react";
import { usePurchases } from "../../context/PurchaseContext";
import { Chart } from "chart.js/auto";

const ProfileTable = () => {
  const [editMode, setEditMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const { purchases } = usePurchases();

  const [profileData, setProfileData] = useState({
    height: 160,
    weight: 65,
    waist: 65,
    arm: 65,
    chest: 65,
    hip: 65,
  });

  const [formData, setFormData] = useState(profileData);
  const [monthlyData, setMonthlyData] = useState({
    weight: [65, 66, 65, 64, 65, 63, 64, 65, 66, 65, 64, 63], // داده‌های نمونه برای یک سال
    months: [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ],
  });

  const chartRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const currentMonth = new Date().toLocaleString("fa-IR", { month: "long" });
    setProfileData(formData);
    setMonthlyData((prev) => ({
      weight: [...prev.weight, formData.weight],
      months: [...prev.months, currentMonth],
    }));
    setEditMode(false);
    setShowReminder(false);
    localStorage.setItem("lastUpdate", new Date());
  };

  const handleCancel = () => {
    setFormData(profileData);
    setEditMode(false);
  };

  const checkOneYearAccess = () => {
    const hasOneYear = purchases.some(
      (item) => item.duration === "دوره یک‌ساله"
    );
    if (!hasOneYear) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 10000);
    } else {
      setShowChart(true);
    }
  };

  useEffect(() => {
    if (showReminder) {
      const lastUpdate = localStorage.getItem("lastUpdate");
      const now = new Date();
      if (!lastUpdate || new Date(lastUpdate).getMonth() !== now.getMonth()) {
        setShowReminder(true);
      }
    }
  }, [showReminder]);

  useEffect(() => {
    if (showChart) {
      const ctx = document.getElementById("progressChart").getContext("2d");
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      chartRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: monthlyData.months,
          datasets: [
            {
              label: "وزن (کیلوگرم)",
              data: monthlyData.weight,
              borderColor: "#FF6600",
              backgroundColor: "rgba(255, 102, 0, 0.2)",
              fill: true,
              tension: 0.1,
              pointRadius: 5,
              pointHoverRadius: 7,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: "وزن (کیلوگرم)",
                color: "#1F2D27",
              },
              ticks: {
                stepSize: 1,
                color: "#1F2D27",
              },
            },
            x: {
              title: {
                display: true,
                text: "ماه",
                color: "#1F2D27",
              },
              ticks: {
                color: "#1F2D27",
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: "#1F2D27",
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.label}: ${context.raw} کیلوگرم`;
                },
              },
            },
          },
        },
      });
    }
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [showChart, monthlyData]);

  const fields = [
    { key: "height", label: "قد" },
    { key: "weight", label: "وزن" },
    { key: "waist", label: "دور کمر" },
    { key: "arm", label: "دور بازو" },
    { key: "chest", label: "دور سینه" },
    { key: "hip", label: "دور باسن" },
  ];

  return (
    <div className="flex flex-col items-center w-full px-4 mt-6 relative">
      {showAlert && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-4">
          <div className="bg-[#FFF1E3] border border-[#FF6600] text-[#333] px-6 py-6 rounded-2xl text-base shadow-2xl w-full max-w-2xl relative">
            <button
              onClick={() => setShowAlert(false)}
              className="absolute top-3 right-4 text-[#FF6600] text-2xl font-extrabold hover:scale-125 transition-transform duration-200 cursor-pointer"
              aria-label="بستن"
            >
              ×
            </button>
            <p className="text-center text-[16px] sm:text-[18px] font-semibold leading-7 text-[#1F2D27] px-2 sm:px-6">
              نتایج تمرین‌ها و پیشرفت رو لحظه به لحظه با اشتراک VIP ببین و قدرتت
              رو بیشتر کن!
            </p>
          </div>
        </div>
      )}

      {showReminder && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4 w-full max-w-3xl">
          <strong className="font-bold">یادآوری!</strong>
          <span className="block sm:inline">
            لطفاً اطلاعات خود را برای این ماه به‌روزرسانی کنید.
          </span>
          <button
            onClick={() => setShowReminder(false)}
            className="absolute top-0 right-0 mt-2 mr-2 text-yellow-700 hover:text-yellow-900"
          >
            ×
          </button>
        </div>
      )}

      {showChart && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-4">
          <div className="bg-[#FFF1E3] border border-[#FF6600] text-[#333] px-6 py-6 rounded-2xl text-base shadow-2xl w-full max-w-2xl relative">
            <button
              onClick={() => setShowChart(false)}
              className="absolute top-3 right-4 text-[#FF6600] text-2xl font-extrabold hover:scale-125 transition-transform duration-200 cursor-pointer"
              aria-label="بستن"
            >
              ×
            </button>
            <p className="text-center font-semibold leading-6 text-[#1F2D27]">
              تغییرات وزن شما در طول سال
            </p>
            <p className="text-center text-sm text-[#1F2D27] mt-2">
              این نمودار تغییرات وزن شما را نشان می‌دهد. افزایش وزن ممکن است به
              دلیل عضله‌سازی باشد، و کاهش وزن نشان‌دهنده چربی‌سوزی است. برای
              تحلیل دقیق‌تر، اطلاعات ماهانه خود را به‌روز نگه دارید
            </p>
            <div className="h-64 mt-4">
              <canvas id="progressChart"></canvas>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#9FC6C3] w-full max-w-3xl rounded-xl p-4 sm:p-6 text-right shadow-md mt-10">
        <h2 className="text-white font-extrabold text-lg sm:text-xl mb-4 border-b border-white pb-2">
          جزئیات فیزیکی
        </h2>

        <div className="block sm:hidden">
          <div className="grid grid-cols-2 gap-2 text-[#1F2D27] font-bold text-sm">
            {fields.map(({ key, label }) => (
              <div
                key={key}
                className="flex flex-col items-center text-center bg-white/10 p-2 rounded"
              >
                <span>{label}</span>
                {editMode ? (
                  <input
                    type="number"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="mt-1 w-20 px-2 py-1 rounded border border-gray-300 text-center text-sm"
                  />
                ) : (
                  <span className="mt-1 text-[15px]">{profileData[key]}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm text-center text-[#1F2D27] font-bold">
            <thead>
              <tr className="border-b border-gray-600">
                {fields.map(({ label }) => (
                  <th key={label} className="py-2">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="text-[15px]">
                {fields.map(({ key }) => (
                  <td key={key} className="py-2">
                    {editMode ? (
                      <input
                        type="number"
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        className="w-16 px-1 py-0.5 rounded border border-gray-300 text-center text-sm"
                      />
                    ) : (
                      profileData[key]
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="bg-[#256250] hover:bg-[#1E4D43] text-white px-4 py-2 rounded-md transition text-sm font-semibold w-full sm:w-auto"
              >
                ذخیره
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition text-sm font-semibold w-full sm:w-auto"
              >
                لغو
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditMode(true)}
                className="bg-[#FF6600] hover:bg-orange-600 text-white px-4 py-2 rounded-md transition text-sm font-semibold w-full sm:w-auto cursor-pointer"
              >
                به‌روزرسانی
              </button>
              <button
                onClick={checkOneYearAccess}
                className="bg-[#FF6600] hover:bg-orange-600 text-white px-4 py-2 rounded-md transition text-sm font-semibold w-full sm:w-auto cursor-pointer"
              >
                نتایج تمرینات و تلاش‌ها
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileTable;
