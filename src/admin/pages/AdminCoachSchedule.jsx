import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../../assets/assets";

function AdminCoachSchedule() {
  const navigate = useNavigate();
  const { coachId } = useParams();

  const [rows, setRows] = useState(() => {
    const saved = localStorage.getItem(`coachSchedule_${coachId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [newRow, setNewRow] = useState({
    courseType: "عمومی",
    classType: "بدنسازی",
    day: "",
    startTime: "10:00",
    endTime: "11:00",
    status: "",
    coachId: String(coachId),
  });

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const courseTypes = ["VIP", "عمومی", "خصوصی"];
  const times = Array.from({ length: 48 }, (_, i) => {
    const hour = String(Math.floor(i / 2)).padStart(2, "0");
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour}:${minute}`;
  });

  useEffect(() => {
    localStorage.setItem(`coachSchedule_${coachId}`, JSON.stringify(rows));
  }, [rows, coachId]);

  const handleAddRow = () => {
    const { courseType, classType, day, startTime, endTime, status } = newRow;

    if (
      !courseType ||
      !classType ||
      !day ||
      !startTime ||
      !endTime ||
      status === ""
    ) {
      setError(
        "تمام فیلدها (نوع دوره، نوع کلاس، روز، ساعت و ظرفیت) الزامی است"
      );
      return;
    }

    const newItem = {
      id: Date.now(),
      coachId: String(coachId),
      courseType,
      classType,
      day,
      time: `${startTime}-${endTime}`,
      status: Number(status),
    };

    setRows([...rows, newItem]);
    setNewRow({
      courseType: "عمومی",
      classType: "بدنسازی",
      day: "",
      startTime: "10:00",
      endTime: "11:00",
      status: "",
      coachId: String(coachId),
    });

    setError("");
  };

  const handleDelete = (id) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const handleEdit = (id) => setEditingId(id);

  const handleSaveEdit = () => setEditingId(null);

  const handleChange = (e, id) => {
    const { name, value } = e.target;
    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id !== id) return row;
        let updated = { ...row, coachId: String(coachId) };
        if (name === "status") {
          updated.status = Number(value);
        } else if (name === "startTime" || name === "endTime") {
          const [start, end] = row.time.split("-");
          updated.time = `${name === "startTime" ? value : start}-${
            name === "endTime" ? value : end
          }`;
        } else {
          updated[name] = value;
        }
        return updated;
      })
    );
  };

  const handleNewRowChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prev) => ({
      ...prev,
      [name]: name === "status" ? value.replace(/\D/g, "") : value,
      coachId: String(coachId),
    }));
  };

  const handleSubmit = () => {
    navigate("/admin/coaches");
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col relative p-4 md:p-15">
      <main
        dir="rtl"
        className="flex-1 border-l-2 border-r-2 border-t-2 border-[#055B5C] rounded-t-[30px] md:rounded-tl-[70px] bg-white text-right p-4 relative min-h-screen"
      >
        <button
          onClick={handleSubmit}
          className="absolute top-4 right-4 hover:opacity-70 transition"
          title="بازگشت"
        >
          <img
            src={assets.back}
            alt="بازگشت"
            className="w-6 h-6 sm:w-8 sm:h-8"
          />
        </button>
        <h2 className="text-center text-[#FF6600] font-bold text-xl mb-6">
          برنامه زمان‌بندی مربیان
        </h2>

        {error && (
          <div className="text-[#FF6347] bg-red-50 border border-[#FF6347] rounded px-4 py-2 text-sm mb-4 text-center">
            {error}
          </div>
        )}

        {/* Desktop Table */}
        <div className="overflow-x-auto hidden sm:block rounded-lg">
          <table className="min-w-full text-sm font-bold text-[#055B5C] text-center border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-[#055B5C] text-white">
                <th className="px-2">نوع دوره</th>
                <th className="px-2">نوع کلاس</th>
                <th className="px-2">روز</th>
                <th className="px-2">ساعت</th>
                <th className="px-2">ظرفیت</th>
                <th className="px-2">عملیات</th>
              </tr>
            </thead>
            <tbody className="[&>tr>td]:px-2 [&>tr>td]:py-1">
              {rows.map((row) => (
                <tr key={row.id} className="bg-[#EFFAF2] rounded">
                  {editingId === row.id ? (
                    <>
                      <td>
                        <select
                          name="courseType"
                          value={row.courseType}
                          onChange={(e) => handleChange(e, row.id)}
                          className="w-full border rounded h-8"
                        >
                          {courseTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          name="classType"
                          value={row.classType}
                          onChange={(e) => handleChange(e, row.id)}
                          className="w-full border rounded h-8"
                        >
                          <option value="بدنسازی">بدنسازی</option>
                        </select>
                      </td>
                      <td>
                        <input
                          name="day"
                          value={row.day}
                          onChange={(e) => handleChange(e, row.id)}
                          className="w-full border rounded h-8"
                        />
                      </td>
                      <td className="flex">
                        <select
                          name="startTime"
                          value={row.time.split("-")[0]}
                          onChange={(e) => handleChange(e, row.id)}
                          className="w-1/2 border rounded-l h-8"
                        >
                          {times.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                        <select
                          name="endTime"
                          value={row.time.split("-")[1]}
                          onChange={(e) => handleChange(e, row.id)}
                          className="w-1/2 border rounded-r h-8"
                        >
                          {times.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          name="status"
                          type="number"
                          value={row.status}
                          onChange={(e) => handleChange(e, row.id)}
                          className="w-full border rounded h-8"
                        />
                      </td>
                      <td>
                        <button
                          onClick={handleSaveEdit}
                          className="bg-[#9FC6C3] text-white px-3 py-1 rounded hover:bg-[#7eb2ac]"
                        >
                          ذخیره
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{row.courseType}</td>
                      <td>{row.classType}</td>
                      <td>{row.day}</td>
                      <td>{row.time}</td>
                      <td>{`ظرفیت: ${row.status} نفر`}</td>
                      <td className="flex justify-center gap-1">
                        <button
                          onClick={() => handleEdit(row.id)}
                          className="bg-[#FEEDDB] text-[#055B5C] px-3 py-1 rounded hover:bg-[#fcd8a4]"
                        >
                          ویرایش
                        </button>
                        <button
                          onClick={() => handleDelete(row.id)}
                          className="bg-red-100 text-[#FF6347] px-3 py-1 rounded hover:bg-red-200"
                        >
                          حذف
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}

              {/* افزودن کلاس جدید */}
              <tr className="bg-[#D1E7D8]">
                <td>
                  <select
                    name="courseType"
                    value={newRow.courseType}
                    onChange={handleNewRowChange}
                    className="w-full border rounded h-8"
                  >
                    {courseTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    name="classType"
                    value={newRow.classType}
                    onChange={handleNewRowChange}
                    className="w-full border rounded h-8"
                  >
                    <option value="بدنسازی">بدنسازی</option>
                  </select>
                </td>
                <td>
                  <input
                    name="day"
                    value={newRow.day}
                    onChange={handleNewRowChange}
                    placeholder="روز"
                    className="w-full border rounded h-8"
                  />
                </td>
                <td className="flex">
                  <select
                    name="startTime"
                    value={newRow.startTime}
                    onChange={handleNewRowChange}
                    className="w-1/2 border rounded-l h-8"
                  >
                    {times.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <select
                    name="endTime"
                    value={newRow.endTime}
                    onChange={handleNewRowChange}
                    className="w-1/2 border rounded-r h-8"
                  >
                    {times.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    name="status"
                    value={newRow.status}
                    onChange={handleNewRowChange}
                    placeholder="ظرفیت"
                    className="w-full border rounded h-8"
                  />
                </td>
                <td>
                  <button
                    onClick={handleAddRow}
                    className="bg-[#055B5C] text-white px-3 py-1 rounded hover:bg-[#033f40]"
                  >
                    ذخیره
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="sm:hidden mt-6 w-full flex flex-col gap-4">
          {rows.map((row) => (
            <div
              key={row.id}
              className="bg-[#EFFAF2] rounded-lg p-4 shadow border border-[#D1E7D8]"
            >
              {editingId === row.id ? (
                <div className="flex flex-col gap-2">
                  <select
                    name="courseType"
                    value={row.courseType}
                    onChange={(e) => handleChange(e, row.id)}
                    className="border rounded p-2 text-sm"
                  >
                    {courseTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <select
                    name="classType"
                    value={row.classType}
                    onChange={(e) => handleChange(e, row.id)}
                    className="border rounded p-2 text-sm"
                  >
                    <option value="بدنسازی">بدنسازی</option>
                  </select>

                  <input
                    name="day"
                    value={row.day}
                    onChange={(e) => handleChange(e, row.id)}
                    className="border rounded p-2 text-sm"
                  />
                  <div className="flex flex-wrap gap-2">
                    <select
                      name="startTime"
                      value={row.time.split("-")[0]}
                      onChange={(e) => handleChange(e, row.id)}
                      className="flex-1 border rounded p-2 text-sm"
                    >
                      {times.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <select
                      name="endTime"
                      value={row.time.split("-")[1]}
                      onChange={(e) => handleChange(e, row.id)}
                      className="flex-1 border rounded p-2 text-sm"
                    >
                      {times.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    name="status"
                    value={row.status}
                    onChange={(e) => handleChange(e, row.id)}
                    className="border rounded p-2 text-sm"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="bg-[#055B5C] text-white px-3 py-1 rounded text-xs"
                    >
                      ذخیره
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-200 text-[#055B5C] px-3 py-1 rounded text-xs"
                    >
                      انصراف
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#055B5C] font-bold text-sm">
                      {row.day} - {row.time}
                    </span>
                    <span className="text-xs text-[#666]">
                      {row.courseType}
                    </span>
                  </div>
                  <div className="text-sm text-[#055B5C] mb-2">
                    <p>نوع کلاس: {row.classType}</p>
                    <p>ظرفیت: {row.status} نفر</p>
                  </div>
                  <div className="flex gap-2 mt-2 justify-end">
                    <button
                      onClick={() => handleEdit(row.id)}
                      className="bg-[#FEEDDB] text-[#055B5C] px-3 py-1 rounded hover:bg-[#fcd8a4] text-xs"
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="bg-red-100 text-[#FF6347] px-3 py-1 rounded hover:bg-red-200 text-xs"
                    >
                      حذف
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          {/* فرم افزودن */}
          <div className="sm:hidden mt-6 bg-[#D1E7D8] p-4 rounded-lg">
            <h4 className="text-[#055B5C] font-bold text-center mb-4">
              افزودن کلاس
            </h4>
            <div className="flex flex-col gap-3">
              <select
                name="courseType"
                value={newRow.courseType}
                onChange={handleNewRowChange}
                className="border rounded p-2 text-sm"
              >
                {courseTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <select
                name="classType"
                value={newRow.classType}
                onChange={handleNewRowChange}
                className="border rounded p-2 text-sm"
              >
                <option value="بدنسازی">بدنسازی</option>
              </select>

              <input
                name="day"
                value={newRow.day}
                onChange={handleNewRowChange}
                placeholder="روز"
                className="border rounded p-2 text-sm"
              />
              <div className="flex flex-wrap gap-2">
                <select
                  name="startTime"
                  value={newRow.startTime}
                  onChange={handleNewRowChange}
                  className="flex-1 border rounded p-2 text-sm"
                >
                  {times.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <select
                  name="endTime"
                  value={newRow.endTime}
                  onChange={handleNewRowChange}
                  className="flex-1 border rounded p-2 text-sm"
                >
                  {times.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <input
                name="status"
                value={newRow.status}
                onChange={handleNewRowChange}
                placeholder="ظرفیت"
                className="border rounded p-2 text-sm"
              />
              <button
                onClick={handleAddRow}
                className="bg-[#055B5C] text-white px-3 py-2 rounded text-sm hover:bg-[#033f40]"
              >
                ذخیره کلاس جدید
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminCoachSchedule;
