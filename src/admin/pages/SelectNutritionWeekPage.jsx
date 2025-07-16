import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import { motion, AnimatePresence } from "framer-motion"; // ✅ اضافه شده

function SelectNutritionWeekPage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [weeks, setWeeks] = useState([]);
  const [newWeek, setNewWeek] = useState("");
  const [editingWeekId, setEditingWeekId] = useState(null);
  const [editedWeekName, setEditedWeekName] = useState("");

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
    if (editingWeekId !== null) return;
    navigate(`/admin/nutrition/${userId}/${weekId}`);
  };

  const handleDeleteWeek = (e, weekId) => {
    e.stopPropagation();
    if (!window.confirm("آیا از حذف این هفته مطمئن هستید؟")) return;
    const data = JSON.parse(localStorage.getItem("nutritionWeeks")) || {};
    const userWeeks = data[userId] || [];
    const updatedWeeks = userWeeks.filter((w) => w.id !== weekId);
    data[userId] = updatedWeeks;
    localStorage.setItem("nutritionWeeks", JSON.stringify(data));
    setWeeks(updatedWeeks);
  };

  const startEditing = (e, weekId, currentName) => {
    e.stopPropagation();
    setEditingWeekId(weekId);
    setEditedWeekName(currentName);
  };

  const cancelEditing = (e) => {
    e.stopPropagation();
    setEditingWeekId(null);
    setEditedWeekName("");
  };

  const saveEditedWeek = (e, weekId) => {
    e.stopPropagation();
    if (!editedWeekName.trim()) return;
    const data = JSON.parse(localStorage.getItem("nutritionWeeks")) || {};
    const userWeeks = data[userId] || [];
    const updatedWeeks = userWeeks.map((w) =>
      w.id === weekId ? { ...w, name: editedWeekName } : w
    );
    data[userId] = updatedWeeks;
    localStorage.setItem("nutritionWeeks", JSON.stringify(data));
    setWeeks(updatedWeeks);
    setEditingWeekId(null);
    setEditedWeekName("");
  };

  return (
    <div
      className="relative bg-[#FCEFE3] min-h-screen px-4 py-8 md:px-10 font-sans"
      dir="rtl"
    >
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto mt-20 bg-white p-6 rounded-2xl shadow-lg border border-[#FF6600]"
      >
        <h2 className="text-center text-[#FF6600] text-xl font-extrabold mb-6">
          مدیریت هفته‌های برنامه غذایی
        </h2>

        <div className="flex flex-row-reverse gap-2 mb-6">
          <input
            type="text"
            value={newWeek}
            onChange={(e) => setNewWeek(e.target.value)}
            placeholder="مثلاً هفته اول"
            className="flex-1 border-2 border-[#055B5C] text-sm px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            onClick={handleAddWeek}
            className="bg-[#055B5C] text-white px-5 rounded-xl hover:bg-[#256250] transition whitespace-nowrap cursor-pointer"
          >
            افزودن
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {weeks.map((w) => (
              <motion.div
                key={w.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => goToNutrition(w.id)}
                className="p-4 bg-[#FEEDDB] rounded-xl shadow hover:shadow-lg cursor-pointer transition flex flex-col gap-2 border border-[#FFB347]"
              >
                {editingWeekId === w.id ? (
                  <div className="flex flex-col gap-2">
                    <input
                      value={editedWeekName}
                      onChange={(e) => setEditedWeekName(e.target.value)}
                      className="border border-[#FF6600] rounded px-2 py-1 text-sm"
                    />
                    <div className="flex justify-end gap-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => saveEditedWeek(e, w.id)}
                        className="bg-[#FF6600] text-white px-3 py-1 rounded hover:brightness-110 text-xs"
                      >
                        ذخیره
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={cancelEditing}
                        className="bg-[#9FC6C3] text-white px-3 py-1 rounded hover:brightness-95 text-xs"
                      >
                        انصراف
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-[#055B5C] font-semibold">
                      {w.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={(e) => startEditing(e, w.id, w.name)}
                        className="bg-[#256250] text-white text-xs px-2 py-1 rounded-lg transition"
                      >
                        ویرایش
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={(e) => handleDeleteWeek(e, w.id)}
                        className="bg-red-500 text-white text-xs px-2 py-1 rounded-lg hover:bg-red-600 transition"
                      >
                        حذف
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default SelectNutritionWeekPage;
