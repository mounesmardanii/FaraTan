import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { motion, AnimatePresence } from "framer-motion"; // ✅ اضافه شد

// توابع مدیریت داده‌ها
const fetchRows = () => {
  try {
    return JSON.parse(localStorage.getItem("fitnessProgramRows")) || [];
  } catch (error) {
    console.error("خطا در بازیابی ردیف‌ها از localStorage:", error);
    return [];
  }
};

const saveRows = (rows) => {
  try {
    localStorage.setItem("fitnessProgramRows", JSON.stringify(rows));
  } catch (error) {
    console.error("خطا در ذخیره ردیف‌ها در localStorage:", error);
  }
};

function FitnessProgramPage() {
  const navigate = useNavigate();

  const [rows, setRows] = useState(fetchRows());
  const [newRow, setNewRow] = useState({
    title: "",
    sets: "",
    time: "",
    type: "",
    video: null,
    videoId: null,
    videoName: null,
  });

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setRows(fetchRows());

    const selected = JSON.parse(localStorage.getItem("selectedVideo"));
    const editing = JSON.parse(localStorage.getItem("editingRowId"));
    const savedNewRow = JSON.parse(localStorage.getItem("newRow"));

    if (selected) {
      if (editing !== null) {
        setRows((prev) =>
          prev.map((row) =>
            row.id === editing
              ? {
                  ...row,
                  title: selected.name || row.title,
                  video: selected.file,
                  videoId: selected.id,
                  videoName: selected.name,
                  type: selected.type || "عمومی",
                }
              : row
          )
        );
        saveRows(rows);
        localStorage.removeItem("editingRowId");
      } else {
        setNewRow((prev) => ({
          ...prev,
          ...savedNewRow,
          title: selected.name || prev.title,
          video: selected.file || prev.video,
          videoId: selected.id,
          videoName: selected.name,
          type: selected.type || "عمومی",
          fileName: selected.fileName || "",
        }));
      }

      localStorage.removeItem("selectedVideo");
      localStorage.removeItem("newRow");
    }
  }, []);

  useEffect(() => {
    saveRows(rows);
  }, [rows]);

  const handleAddRow = () => {
    const isValid = newRow.title && newRow.sets && newRow.type;
    if (!isValid) {
      setError("تمام فیلدها الزامی است (بجز زمان و ویدیو).");
      return;
    }

    const newItem = { id: Date.now(), ...newRow };
    setRows([...rows, newItem]);
    setNewRow({
      title: "",
      sets: "",
      time: "",
      type: "",
      video: null,
      videoId: null,
      videoName: null,
    });
    setError("");
    localStorage.removeItem("newRow");
  };

  const handleDelete = (id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSaveEdit = () => {
    setEditingId(null);
  };

  const handleChange = (e, id) => {
    const { name, value } = e.target;
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [name]: value } : r))
    );
  };

  const handleVideoSelect = (id) => {
    localStorage.setItem("editingRowId", JSON.stringify(id));
    navigate("/admin/videos");
  };

  const handleNewVideoSelect = () => {
    localStorage.setItem("newRow", JSON.stringify(newRow));
    navigate("/admin/videos");
  };

  const handleSubmit = () => {
    navigate("/admin/users");
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col relative p-4 md:p-15">
      <main
        dir="rtl"
        className="flex-1 border-r-2 border-l-2 border-t-2 border-b-0 border-[#055B5C] rounded-t-[30px] md:rounded-tl-[70px] bg-white text-right p-4 md:p-6 relative min-h-screen"
      >
        <button
          onClick={() => navigate("/admin/users")}
          className="absolute top-4 right-4 hover:opacity-70 transition cursor-pointer"
          title="بازگشت"
        >
          <img src={assets.back} alt="بازگشت" className="w-8 h-8" />
        </button>

        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-[#FF6600] font-bold text-xl mb-6"
        >
          برنامه ورزشی
        </motion.h2>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#FF6347] bg-red-50 border border-[#FF6347] rounded px-4 py-2 text-sm mb-4 text-center"
          >
            {error}
          </motion.div>
        )}

        <div className="w-full overflow-x-auto rounded-lg">
          <table className="min-w-full text-sm font-bold text-[#055B5C] text-center border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-[#055B5C] text-white">
                <th>نام ورزش/حرکت</th>
                <th>ست</th>
                <th>زمان</th>
                <th>نوع ویدیو</th>
                <th>ویدیوی آموزشی</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {rows.map((row) => (
                  <motion.tr
                    key={row.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#EFFAF2] rounded h-10"
                  >
                    {editingId === row.id ? (
                      <>
                        {["title", "sets", "time", "type"].map((field) => (
                          <td key={field}>
                            <input
                              type="text"
                              name={field}
                              value={row[field]}
                              onChange={(e) => handleChange(e, row.id)}
                              className="w-full border px-1 rounded text-xs h-8"
                            />
                          </td>
                        ))}
                        <td>
                          <div className="flex flex-col items-center">
                            {row.video ? (
                              <>
                                <video
                                  src={row.video}
                                  controls
                                  className="w-32 h-20 mx-auto rounded mb-1"
                                />
                                <p className="text-xs text-gray-600 truncate max-w-[120px]">
                                  {row.videoName || "بدون نام"}
                                </p>
                              </>
                            ) : (
                              <span className="text-gray-400 text-xs">
                                ندارد
                              </span>
                            )}
                            <button
                              onClick={() => handleVideoSelect(row.id)}
                              className="mt-1 text-xs text-[#055B5C] underline cursor-pointer hover:text-[#033f40]"
                            >
                              تغییر ویدیو
                            </button>
                          </div>
                        </td>
                        <td>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSaveEdit}
                            className="bg-[#9FC6C3] hover:bg-[#7eb2ac] text-white text-xs px-2 py-1 rounded cursor-pointer"
                          >
                            ذخیره
                          </motion.button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{row.title}</td>
                        <td>{row.sets}</td>
                        <td>{row.time || "-"}</td>
                        <td>{row.type || "-"}</td>
                        <td>
                          {row.video ? (
                            <video
                              src={row.video}
                              controls
                              className="w-32 h-20 mx-auto rounded"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">ندارد</span>
                          )}
                        </td>
                        <td className="flex justify-center gap-1 py-1">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(row.id)}
                            className="bg-[#FEEDDB] hover:bg-[#fcd8a4] text-[#055B5C] text-xs px-2 py-1 rounded cursor-pointer"
                          >
                            ویرایش
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(row.id)}
                            className="bg-[#EFFAF2] hover:bg-red-100 text-[#FF6347] text-xs px-2 py-1 rounded cursor-pointer"
                          >
                            حذف
                          </motion.button>
                        </td>
                      </>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>

              {/* سطر افزودن ردیف جدید */}
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#D1E7D8] rounded h-10"
              >
                {["title", "sets", "time", "type"].map((field) => (
                  <td key={field}>
                    <input
                      type="text"
                      name={field}
                      value={newRow[field]}
                      onChange={(e) =>
                        setNewRow({ ...newRow, [field]: e.target.value })
                      }
                      placeholder={field === "time" ? "زمان (اختیاری)" : "..."}
                      className="w-full border px-1 rounded text-xs h-8"
                    />
                  </td>
                ))}
                <td>
                  <div className="flex flex-col items-center gap-1">
                    {newRow.video && (
                      <>
                        <video
                          src={newRow.video}
                          controls
                          className="w-24 h-16 rounded"
                        />
                        <p className="text-xs text-gray-600 truncate max-w-[100px]">
                          {newRow.videoName || "بدون نام"}
                        </p>
                      </>
                    )}
                    <label
                      onClick={handleNewVideoSelect}
                      className="text-xs text-[#055B5C] underline cursor-pointer hover:text-[#033f40]"
                    >
                      انتخاب از لیست
                    </label>
                  </div>
                </td>
                <td>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleAddRow}
                    title="افزودن"
                    className="bg-[#055B5C] text-white w-8 h-8 rounded-full flex items-center justify-center text-lg hover:bg-[#033f40] cursor-pointer mx-auto"
                  >
                    +
                  </motion.button>
                </td>
              </motion.tr>
            </tbody>
          </table>
        </div>

        <div className="text-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="bg-[#FEEDDB] hover:bg-[#fcd8a4] text-[#055B5C] font-bold py-1 px-6 rounded-full border border-[#055B5C] cursor-pointer"
          >
            ثبت نهایی
          </motion.button>
        </div>
      </main>
    </div>
  );
}

export default FitnessProgramPage;
