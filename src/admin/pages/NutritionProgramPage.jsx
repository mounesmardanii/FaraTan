import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../../assets/assets";

function NutritionProgramPage() {
  const navigate = useNavigate();
  const { userId, weekId } = useParams();

  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newRow, setNewRow] = useState({
    day: "",
    breakfast: "",
    snack1: "",
    lunch: "",
    snack2: "",
    dinner: "",
  });
  const [error, setError] = useState("");

  // بارگذاری داده‌ها از لوکال‌استوریج برای کاربر و هفته موردنظر
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("nutritionPrograms")) || {};
    const weekData = data[userId]?.[weekId] || [];
    setRows(weekData);
  }, [userId, weekId]);

  const handleAddRow = () => {
    const isValid = Object.values(newRow).every((val) => val.trim() !== "");
    if (!isValid) {
      setError("لطفاً همه فیلدها را کامل وارد کنید.");
      return;
    }
    const newItem = { id: Date.now(), ...newRow };
    const updatedRows = [...rows, newItem];
    setRows(updatedRows);
    setNewRow({
      day: "",
      breakfast: "",
      snack1: "",
      lunch: "",
      snack2: "",
      dinner: "",
    });
    setError("");
  };

  const handleDelete = (id) => {
    const updated = rows.filter((r) => r.id !== id);
    setRows(updated);
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSaveEdit = () => {
    setEditingId(null);
  };

  const handleRowChange = (e, id) => {
    const { name, value } = e.target;
    setRows(rows.map((r) => (r.id === id ? { ...r, [name]: value } : r)));
  };

  const handleSubmit = () => {
    const data = JSON.parse(localStorage.getItem("nutritionPrograms")) || {};

    if (!data[userId]) data[userId] = {};
    data[userId][weekId] = rows;

    localStorage.setItem("nutritionPrograms", JSON.stringify(data));
    navigate(`/admin/select-nutrition-week/${userId}`);
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col relative p-4 md:p-15">
      <main
        dir="rtl"
        className="flex-1 border-r-2 border-l-2 border-t-2 border-b-0
             border-[#055B5C] rounded-t-[30px] md:rounded-tl-[70px]
             bg-white text-right p-4 md:p-6 relative min-h-screen"
      >
        {/* دکمه بازگشت به انتخاب هفته */}
        <button
          onClick={() => navigate(`/admin/select-nutrition-week/${userId}`)}
          className="absolute top-4 right-4 hover:opacity-70 transition cursor-pointer"
          title="بازگشت"
        >
          <img src={assets.back} alt="بازگشت" className="w-8 h-8" />
        </button>

        <h2 className="text-center text-[#FF6600] font-bold text-xl mb-6">
          برنامه غذایی هفته
        </h2>

        {error && (
          <div className="text-[#FF6347] bg-red-50 border border-[#FF6347] rounded px-4 py-2 text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <div className="w-full rounded-lg">
          <table className="min-w-full text-sm font-bold text-[#055B5C] text-center border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-[#055B5C] text-white">
                <th>روز</th>
                <th>صبحانه</th>
                <th>میان وعده</th>
                <th>ناهار</th>
                <th>میان وعده</th>
                <th>شام</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="bg-[#EFFAF2] rounded h-10">
                  {editingId === row.id ? (
                    <>
                      {[
                        "day",
                        "breakfast",
                        "snack1",
                        "lunch",
                        "snack2",
                        "dinner",
                      ].map((field) => (
                        <td key={field}>
                          <input
                            type="text"
                            name={field}
                            value={row[field]}
                            onChange={(e) => handleRowChange(e, row.id)}
                            className="w-full border px-1 rounded text-xs h-8"
                          />
                        </td>
                      ))}
                      <td>
                        <button
                          onClick={handleSaveEdit}
                          className="bg-[#9FC6C3] hover:bg-[#7eb2ac] text-white text-xs px-2 py-1 rounded cursor-pointer"
                        >
                          ذخیره
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{row.day}</td>
                      <td>{row.breakfast}</td>
                      <td>{row.snack1}</td>
                      <td>{row.lunch}</td>
                      <td>{row.snack2}</td>
                      <td>{row.dinner}</td>
                      <td className="flex justify-center gap-1 py-1">
                        <button
                          onClick={() => handleEdit(row.id)}
                          className="bg-[#FEEDDB] hover:bg-[#fcd8a4] text-[#055B5C] text-xs px-2 py-1 rounded cursor-pointer"
                        >
                          ویرایش
                        </button>
                        <button
                          onClick={() => handleDelete(row.id)}
                          className="bg-[#EFFAF2] hover:bg-red-100 text-[#FF6347] text-xs px-2 py-1 rounded cursor-pointer"
                        >
                          حذف
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}

              <tr className="bg-[#D1E7D8] rounded h-10">
                {[
                  "day",
                  "breakfast",
                  "snack1",
                  "lunch",
                  "snack2",
                  "dinner",
                ].map((field) => (
                  <td key={field}>
                    <input
                      type="text"
                      name={field}
                      value={newRow[field]}
                      onChange={(e) =>
                        setNewRow({ ...newRow, [field]: e.target.value })
                      }
                      className="w-full border px-1 rounded text-xs h-8"
                      placeholder={
                        field === "day"
                          ? "مثلاً شنبه"
                          : field === "breakfast"
                          ? "مثلاً املت"
                          : field === "snack1"
                          ? "مثلاً موز"
                          : field === "lunch"
                          ? "مثلاً مرغ"
                          : field === "snack2"
                          ? "مثلاً بادام"
                          : "مثلاً کباب"
                      }
                    />
                  </td>
                ))}

                <td>
                  <button
                    onClick={handleAddRow}
                    title="افزودن"
                    className="bg-[#055B5C] text-white w-8 h-8 rounded-full flex items-center justify-center text-lg hover:bg-[#033f40] cursor-pointer mx-auto"
                  >
                    +
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={handleSubmit}
            className="bg-[#FEEDDB] hover:bg-[#fcd8a4] text-[#055B5C] font-bold py-1 px-6 rounded-full border border-[#055B5C] cursor-pointer"
          >
            ثبت نهایی
          </button>
        </div>
      </main>
    </div>
  );
}

export default NutritionProgramPage;
