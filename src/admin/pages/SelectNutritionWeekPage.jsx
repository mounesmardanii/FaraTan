import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../../assets/assets";

function SelectNutritionWeekPage() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [weeks, setWeeks] = useState([]);
    const [newWeek, setNewWeek] = useState("");

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("nutritionWeeks")) || {};
        setWeeks(data[userId] || []);
    }, [userId]);

    const handleAddWeek = () => {
        if (!newWeek.trim()) return;

        const data = JSON.parse(localStorage.getItem("nutritionWeeks")) || {};
        const userWeeks = data[userId] || [];

        const newEntry = { id: Date.now(), name: newWeek };
        const updatedWeeks = [...userWeeks, newEntry];

        data[userId] = updatedWeeks;
        localStorage.setItem("nutritionWeeks", JSON.stringify(data));
        setWeeks(updatedWeeks);
        setNewWeek("");
    };

    const goToNutrition = (weekId) => {
        navigate(`/admin/nutrition/${userId}/${weekId}`);
    };

    // ✅ فقط این تابع اضافه شد
    const handleDeleteWeek = (e, weekId) => {
        e.stopPropagation(); // جلوگیری از رفتن به صفحه هفته
        if (!window.confirm("آیا از حذف این هفته مطمئن هستید؟")) return;

        const data = JSON.parse(localStorage.getItem("nutritionWeeks")) || {};
        const userWeeks = data[userId] || [];
        const updatedWeeks = userWeeks.filter((w) => w.id !== weekId);

        data[userId] = updatedWeeks;
        localStorage.setItem("nutritionWeeks", JSON.stringify(data));
        setWeeks(updatedWeeks);
    };

    return (
        <div className="relative bg-[#FCEFE3] min-h-screen px-4 py-8 md:px-10 font-sans" dir="rtl">
            {/* دکمه بازگشت */}
            <button
                onClick={() => navigate("/admin/users", { replace: true })}
                className="absolute top-4 right-4 z-10"
                title="بازگشت"
            >
                <img
                    src={assets.back}
                    alt="بازگشت"
                    className="w-8 h-8 hover:scale-110 transition-transform cursor-pointer"
                />
            </button>

            <div className="max-w-2xl mx-auto mt-20 bg-white p-6 rounded-2xl shadow-lg border border-[#FF6600]">
                <h2 className="text-center text-[#FF6600] text-xl font-extrabold mb-6">
                    مدیریت هفته‌های برنامه غذایی
                </h2>

                {/* افزودن هفته - راست‌چین */}
                <div className="flex flex-row-reverse gap-2 mb-6">
                    <input
                        type="text"
                        value={newWeek}
                        onChange={(e) => setNewWeek(e.target.value)}
                        placeholder="مثلاً هفته اول"
                        className="flex-1 border-2 border-[#055B5C] text-sm px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <button
                        onClick={handleAddWeek}
                        className="bg-[#055B5C] text-white px-5 rounded-xl hover:bg-[#033f40] transition whitespace-nowrap cursor-pointer"
                    >
                        افزودن
                    </button>
                </div>

                {/* لیست هفته‌ها */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {weeks.map((w) => (
                        <div
                            key={w.id}
                            onClick={() => goToNutrition(w.id)}
                            className="p-4 bg-[#FEEDDB] rounded-xl shadow hover:shadow-lg cursor-pointer transition flex items-center justify-between border border-[#FFB347]"
                        >
                            <span className="text-[#055B5C] font-semibold">{w.name}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-[#FF6600] text-lg">➤</span>
                                {/* ✅ دکمه حذف */}
                                <button
                                    onClick={(e) => handleDeleteWeek(e, w.id)}
                                    className="bg-red-500 text-white text-xs px-2 py-1 rounded-lg hover:bg-red-600 transition cursor-pointer"
                                    title="حذف"
                                >
                                    حذف
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SelectNutritionWeekPage;
