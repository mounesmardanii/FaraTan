import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

function PrivateCoursePage() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newRow, setNewRow] = useState({
    capacity: "",
    sessions: "",
    price: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("privateCourses")) || [];
    setRows(data);
  }, []);

  const handleAddRow = () => {
    const isValid = Object.values(newRow).every((val) => val.trim() !== "");
    if (!isValid) {
      setError("لطفاً همه فیلدها را کامل وارد کنید.");
      return;
    }

    const newItem = { id: Date.now(), ...newRow };
    const updatedRows = [...rows, newItem];
    setRows(updatedRows);
    localStorage.setItem("privateCourses", JSON.stringify(updatedRows));
    setNewRow({ capacity: "", sessions: "", price: "" });
    setError("");
  };

  const handleDelete = (id) => {
    const updated = rows.filter((r) => r.id !== id);
    setRows(updated);
    localStorage.setItem("privateCourses", JSON.stringify(updated));
  };

  const handleEdit = (id) => setEditingId(id);

  const handleSaveEdit = () => {
    setEditingId(null);
    localStorage.setItem("privateCourses", JSON.stringify(rows));
  };

  const handleRowChange = (e, id) => {
    const { name, value } = e.target;
    setRows(rows.map((r) => (r.id === id ? { ...r, [name]: value } : r)));
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col relative p-4 md:p-15">
      <main
        dir="rtl"
        className="flex-1 border-r-2 border-l-2 border-t-2 border-[#055B5C] 
        rounded-t-[30px] md:rounded-tl-[70px]
        bg-white text-right p-4 md:p-6 relative min-h-screen"
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 hover:opacity-70 transition cursor-pointer"
          title="بازگشت"
        >
          <img src={assets.back} alt="بازگشت" className="w-8 h-8" />
        </button>

        <h2 className="text-center text-[#FF6600] font-bold text-xl mb-6">
          دوره‌های خصوصی
        </h2>

        {error && (
          <div className="text-[#FF6347] bg-red-50 border border-[#FF6347] rounded px-4 py-2 text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <div className="w-full h-full">
          <div className="w-full h-full rounded-lg">
            <table className="min-w-full text-sm font-bold text-[#055B5C] text-center border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-[#055B5C] text-white">
                  <th>ظرفیت</th>
                  <th>تعداد جلسه</th>
                  <th>قیمت</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="bg-[#EFFAF2] rounded h-10">
                    {editingId === row.id ? (
                      <>
                        {["capacity", "sessions", "price"].map((field) => (
                          <td key={field}>
                            <input
                              type="number"
                              name={field}
                              value={row[field]}
                              onChange={(e) => handleRowChange(e, row.id)}
                              className="w-full border px-1 rounded text-xs h-8"
                              min="1"
                              step="1"
                              placeholder="عدد وارد کنید"
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
                        <td>{row.capacity}</td>
                        <td>{row.sessions}</td>
                        <td>{row.price} ریال</td>
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
                  {["capacity", "sessions", "price"].map((field) => (
                    <td key={field}>
                      <input
                        type="number"
                        name={field}
                        value={newRow[field]}
                        onChange={(e) =>
                          setNewRow({ ...newRow, [field]: e.target.value })
                        }
                        className="w-full border px-1 rounded text-xs h-8"
                        placeholder="عدد وارد کنید"
                        min="1"
                        step="1"
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
        </div>
      </main>
    </div>
  );
}

export default PrivateCoursePage;
