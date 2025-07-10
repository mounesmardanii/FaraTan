import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

function AdminCoachSchedule() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([
    {
      id: 1,
      courseType: "عمومی",
      classType: "بدنسازی",
      day: "شنبه",
      time: "10:00-11:00",
      status: "ظرفیت دارد",
    },
  ]);

  const [newRow, setNewRow] = useState({
    courseType: "عمومی",
    classType: "",
    day: "",
    startTime: "10:00",
    endTime: "11:00",
    status: "ظرفیت دارد",
  });

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // گزینه‌های نوع دوره
  const courseTypes = ["VIP", "عمومی", "خصوصی"];

  // آرایه ساعت‌ها (هر 30 دقیقه)
  const times = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2).toString().padStart(2, "0");
    const minute = (i % 2 === 0 ? "00" : "30");
    return `${hour}:${minute}`;
  });

  const handleAddRow = () => {
    const isValid = newRow.courseType && newRow.classType && newRow.day && newRow.startTime && newRow.endTime;
    if (!isValid) {
      setError("تمام فیلدها (نوع دوره، نوع کلاس، روز، و ساعت) الزامی است.");
      return;
    }
    const newItem = {
      id: Date.now(),
      courseType: newRow.courseType,
      classType: newRow.classType,
      day: newRow.day,
      time: `${newRow.startTime}-${newRow.endTime}`,
      status: newRow.status,
    };
    setRows([...rows, newItem]);
    setNewRow({
      courseType: "عمومی",
      classType: "",
      day: "",
      startTime: "10:00",
      endTime: "11:00",
      status: "ظرفیت دارد",
    });
    setError("");
  };

  const handleDelete = (id) => {
    setRows(rows.filter((r) => r.id !== id));
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
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              [name]: name === "startTime" || name === "endTime" ? value : value,
              time: name === "startTime" || name === "endTime"
                ? `${prev.find((r) => r.id === id).startTime || "10:00"}-${prev.find((r) => r.id === id).endTime || "11:00"}`
                : r.time,
            }
          : r
      )
    );
  };

  const handleNewRowChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prev) => ({
      ...prev,
      [name]: value,
      time: `${prev.startTime || "10:00"}-${prev.endTime || "11:00"}`,
    }));
  };

  const handleSubmit = () => {
    navigate("/admin/coaches");
  };

  return (
    <div className="max-h-screen bg-white font-sans flex flex-col relative p-4 md:p-15">
      <main
        dir="rtl"
        className="flex-1 border-r-2 border-l-2 border-t-2 border-b-0 border-[#055B5C] rounded-t-[30px] md:rounded-tl-[70px] bg-white text-right p-4 md:p-6 relative min-h-screen"
      >
        <button
          onClick={() => navigate("/admin/coaches")}
          className="absolute top-4 right-4 hover:opacity-70 transition cursor-pointer"
          title="بازگشت"
        >
          <img src={assets.back} alt="بازگشت" className="w-8 h-8" />
        </button>

        <h2 className="text-center text-[#FF6600] font-bold text-xl mb-6">
          برنامه زمان‌بندی مربیان
        </h2>

        {error && (
          <div className="text-[#FF6347] bg-red-50 border border-[#FF6347] rounded px-4 py-2 text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <div className="w-full max-h-[400px] overflow-y-auto rounded-lg scrollbar-thin scrollbar-thumb-[#D1E7D8] scrollbar-track-[#EFFAF2]">
          <table className="min-w-full text-sm font-bold text-[#055B5C] text-center border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-[#055B5C] text-white">
                <th>نوع دوره</th>
                <th>نوع کلاس</th>
                <th>روز</th>
                <th>ساعت</th>
                <th>وضعیت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="bg-[#EFFAF2] rounded h-10">
                  {editingId === row.id ? (
                    <>
                      <td>
                        <select
                          name="courseType"
                          value={row.courseType}
                          onChange={(e) => handleChange(e, row.id)}
                          className="w-full border px-1 rounded text-xs h-8 bg-white text-[#055B5C] font-semibold"
                        >
                          {courseTypes.map((type) => (
                            <option key={type} value={type} className="bg-white hover:bg-[#D1E7D8]">
                              {type}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          name="classType"
                          value={row.classType}
                          onChange={(e) => handleChange(e, row.id)}
                          className="w-full border px-1 rounded text-xs h-8"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="day"
                          value={row.day}
                          onChange={(e) => handleChange(e, row.id)}
                          className="w-full border px-1 rounded text-xs h-8"
                        />
                      </td>
                      <td className="flex flex-row items-start w-full">
                        <select
                          name="startTime"
                          value={row.time.split("-")[0] || "10:00"}
                          onChange={(e) => handleChange(e, row.id)}
                          className="w-5/12 border px-1 rounded-l py-1 text-xs h-8 bg-white text-[#055B5C] font-semibold"
                        >
                          {times.map((time) => (
                            <option key={time} value={time} className="bg-white hover:bg-[#D1E7D8]">
                              {time}
                            </option>
                          ))}
                        </select>
                        <span className="w-2/12 text-center text-[#055B5C] py-1">-</span>
                        <select
                          name="endTime"
                          value={row.time.split("-")[1] || "11:00"}
                          onChange={(e) => handleChange(e, row.id)}
                          className="w-5/12 border px-1 rounded-r py-1 text-xs h-8 bg-white text-[#055B5C] font-semibold"
                        >
                          {times.map((time) => (
                            <option key={time} value={time} className="bg-white hover:bg-[#D1E7D8]">
                              {time}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          name="status"
                          value={row.status}
                          onChange={(e) => handleChange(e, row.id)}
                          className="w-full border px-1 rounded text-xs h-8 bg-white text-[#055B5C] font-semibold"
                        >
                          <option value="ظرفیت دارد" className="bg-white hover:bg-[#D1E7D8]">ظرفیت دارد</option>
                          <option value="تکمیل شده" className="bg-white hover:bg-[#D1E7D8]">تکمیل شده</option>
                        </select>
                      </td>
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
                      <td>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          row.courseType === 'VIP' ? 'bg-yellow-100 text-yellow-800' :
                          row.courseType === 'خصوصی' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {row.courseType}
                        </span>
                      </td>
                      <td>{row.classType}</td>
                      <td>{row.day}</td>
                      <td>{row.time}</td>
                      <td>{row.status}</td>
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
                <td>
                  <select
                    name="courseType"
                    value={newRow.courseType}
                    onChange={handleNewRowChange}
                    className="w-full border px-1 rounded text-xs h-8 bg-white text-[#055B5C] font-semibold"
                  >
                    {courseTypes.map((type) => (
                      <option key={type} value={type} className="bg-white hover:bg-[#D1E7D8]">
                        {type}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    name="classType"
                    value={newRow.classType}
                    onChange={handleNewRowChange}
                    placeholder="نوع کلاس"
                    className="w-full border px-1 rounded text-xs h-8"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="day"
                    value={newRow.day}
                    onChange={handleNewRowChange}
                    placeholder="روز"
                    className="w-full border px-1 rounded text-xs h-8"
                  />
                </td>
                <td className="flex flex-row items-start w-full">
                  <select
                    name="startTime"
                    value={newRow.startTime}
                    onChange={handleNewRowChange}
                    className="w-5/12 border px-1 rounded-l rounded-r py-1 text-xs h-8 bg-white text-[#055B5C] font-semibold mt-1"
                  >
                    {times.map((time) => (
                      <option key={time} value={time} className="bg-white hover:bg-[#D1E7D8]">
                        {time}
                      </option>
                    ))}
                  </select>
                  <span className="w-2/12 text-center text-[#055B5C] py-1">-</span>
                  <select
                    name="endTime"
                    value={newRow.endTime}
                    onChange={handleNewRowChange}
                    className="w-5/12 border px-1 rounded-r rounded-l py-1 text-xs h-8 bg-white text-[#055B5C] font-semibold mt-1"
                  >
                    {times.map((time) => (
                      <option key={time} value={time} className="bg-white hover:bg-[#D1E7D8]">
                        {time}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    name="status"
                    value={newRow.status}
                    onChange={handleNewRowChange}
                    className="w-full border px-1 rounded text-xs h-8 bg-white text-[#055B5C] font-semibold"
                  >
                    <option value="ظرفیت دارد" className="bg-white hover:bg-[#D1E7D8]">ظرفیت دارد</option>
                    <option value="تکمیل شده" className="bg-white hover:bg-[#D1E7D8]">تکمیل شده</option>
                  </select>
                </td>
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

export default AdminCoachSchedule;