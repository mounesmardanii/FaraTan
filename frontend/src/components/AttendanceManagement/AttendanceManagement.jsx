import React, { useState, useEffect, useCallback } from "react";
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
import { motion } from "framer-motion";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiSave, FiCalendar, FiUsers, FiList, FiPlus, FiX } from "react-icons/fi";
import { api } from "../../lib/api";

const STATUS_OPTIONS = [
  { value: "present", label: "حاضر", color: "bg-[#EAF4EF] text-[#055B5C]" },
  { value: "absent", label: "غایب", color: "bg-[#FFE8E8] text-[#D33A3A]" },
];

const AttendanceManagement = () => {
  const [allUsers, setAllUsers] = useState([]); 
  const [selectedUsers, setSelectedUsers] = useState([]); 
  const [addingId, setAddingId] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new DateObject({ calendar: persian }));
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [attendance, setAttendance] = useState({});

  const [viewMode, setViewMode] = useState("daily");
  const [isLoading, setIsLoading] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const formatDate = useCallback((dateObj) => {
    if (!dateObj) return "";
    if (typeof dateObj === "string") return dateObj;
    return dateObj.format("YYYY-MM-DD");
  }, []);

  const selectedDateKey = formatDate(selectedDate);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api("/api/v1/members/");
        const list = (Array.isArray(data) ? data : []).map((m) => {
          const full =
            (m.full_name && String(m.full_name).trim()) ||
            [m.first_name, m.last_name].filter(Boolean).join(" ").trim() ||
            m.username ||
            `کاربر ${m.id}`;
          return { id: String(m.id), name: full };
        });
        setAllUsers(list);
      } catch (e) {
        toast.error("خطا در دریافت لیست کاربران");
      }
    })();
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("attendanceRecords");
      if (raw) setAttendanceRecords(JSON.parse(raw));
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    try {
      localStorage.setItem("attendanceRecords", JSON.stringify(attendanceRecords));
    } catch {
      toast.error("خطا در ذخیره داده‌ها");
    }
  }, [attendanceRecords, isLoading]);

  useEffect(() => {
    if (isLoading) return;

    const dateKey = selectedDateKey;
    const rec = attendanceRecords[dateKey] || {};

    setAttendance(rec);

    const ids = Object.keys(rec);
    if (ids.length) {
      const present = ids
        .map((id) => {
          const u = allUsers.find((x) => String(x.id) === String(id));
          return u ? { ...u } : null;
        })
        .filter(Boolean);
      setSelectedUsers(present);
    } else {
      setSelectedUsers([]);
    }
  }, [selectedDateKey, attendanceRecords, allUsers, isLoading]);

  const availableUsers = allUsers
    .filter(
      (u) => !selectedUsers.some((s) => String(s.id) === String(u.id))
    )
    .filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddUser = () => {
    if (!addingId) return;
    const user = allUsers.find((u) => String(u.id) === String(addingId));
    if (!user) {
      toast.warning("کاربر یافت نشد");
      return;
    }
    if (selectedUsers.some((u) => String(u.id) === String(addingId))) {
      toast.info("این کاربر قبلاً اضافه شده است");
      return;
    }

    setSelectedUsers((list) => [...list, user]);
    setAttendance((prev) => ({
      ...prev,
      [String(addingId)]: prev[String(addingId)] || { status: "", alias: "" },
    }));
    setAddingId("");
  };

  const handleRemoveUser = (id) => {
    setSelectedUsers((list) => list.filter((u) => String(u.id) !== String(id)));
    setAttendance((prev) => {
      const copy = { ...prev };
      delete copy[String(id)];
      return copy;
    });
  };

  const handleStatusChange = (userId, status) => {
    const key = String(userId);
    setAttendance((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), status },
    }));
  };

  const handleAliasChange = (userId, alias) => {
    const key = String(userId);
    setAttendance((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), alias },
    }));
  };

  const handleSave = () => {
    const dateKey = selectedDateKey;
    if (!dateKey) {
      toast.warning("لطفاً یک تاریخ معتبر انتخاب کنید");
      return;
    }
    if (selectedUsers.length === 0) {
      toast.warning("هیچ کاربری اضافه نشده است");
      return;
    }
    const missing = selectedUsers.filter((u) => !attendance[String(u.id)]?.status);
    if (missing.length) {
      toast.warning("وضعیت همه کاربران اضافه‌شده را مشخص کنید");
      return;
    }

    const toSave = {};
    selectedUsers.forEach((u) => {
      toSave[String(u.id)] = attendance[String(u.id)];
    });

    setAttendanceRecords((prev) => ({ ...prev, [dateKey]: toSave }));
    toast.success(`حضور و غیاب ${dateKey} ذخیره شد`);
  };

  const savedDates = Object.keys(attendanceRecords).sort((a, b) => (a < b ? 1 : -1));

  useEffect(() => {
    if (!sidebarOpen) return;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    return () => {
      const y = parseInt(document.body.style.top || "0") * -1;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, y);
    };
  }, [sidebarOpen]);

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col text-right">
      <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 mt-4">
        <aside className="hidden md:flex mt-3 w-64 z-30 border-t-[3px] border-r-[3px] border-[#055B5C] rounded-tr-[75px]">
          <AdminSidebar />
        </aside>

        <motion.aside
          initial={{ x: "-100%" }}
          animate={{ x: sidebarOpen ? 0 : "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed md:hidden left-0 top-29 h-[calc(100vh-5rem)] z-50 w-[275px]
             bg-[#D1E7D8] border-r-[3px] border-[#055B5C] rounded-tr-[75px]
             p-6 overflow-y-auto"
        >
          <AdminSidebar />
        </motion.aside>


        {sidebarOpen && (
          <button
            type="button"
            className="fixed md:hidden left-0 right-0 top-[7.4rem] bottom-0 z-40 bg-black/50 overscroll-none touch-none"
            onClick={() => setSidebarOpen(false)}
            aria-label="بستن منو"
          />
        )}

        <main
          dir="rtl"
          className="flex-1 p-4 md:p-8 z-10 border-t-[3px] border-l-[3px] border-[#FF7A00] rounded-tl-[75px] bg-white md:ml-10 mt-3 ml-10"
        >
          <motion.h2
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-[#055B5C] font-bold text-lg md:text-xl text-center mb-5"
          >
            سیستم مدیریت حضور و غیاب
          </motion.h2>

          <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-[#d3e8db]">
            <div className="bg-[#055B5C] p-5 text-white">
              <h1 className="text-xl md:text-2xl font-bold">سیستم مدیریت حضور و غیاب</h1>
              <p className="mt-1 opacity-90 text-sm">ثبت و مدیریت وضعیت حضور کاربران</p>
            </div>

            <div className="flex flex-col md:flex-row">
              <div className="flex-1 p-5 border-r border-[#d3e8db]">
                <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode("daily")}
                      className={`px-3 py-2 rounded-lg text-sm cursor-pointer ${viewMode === "daily" ? "bg-[#FF7A00] text-white" : "bg-[#d3e8db] text-[#055B5C]"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <FiCalendar />
                        <span>حالت روزانه</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setViewMode("overview")}
                      className={`px-3 py-2 rounded-lg text-sm cursor-pointer ${viewMode === "overview" ? "bg-[#FF7A00] text-white" : "bg-[#d3e8db] text-[#055B5C]"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <FiList />
                        <span>نمایش کلی</span>
                      </div>
                    </button>
                  </div>

                  <span className="text-[#055B5C] text-sm">برای لیست جدید تاریخ جدید وارد کنید</span>

                  {viewMode === "daily" && (
                    <div>
                      <DatePicker
                        calendar={persian}
                        locale={persian_fa}
                        value={selectedDate}
                        onChange={setSelectedDate}
                        format="YYYY/MM/DD"
                        calendarPosition="bottom-right"
                        className="border border-[#9FC6C3] p-2 rounded-lg shadow-sm"
                        inputClass="border border-[#9FC6C3] p-1 rounded-lg text-sm font-semibold text-right"
                        calendarClassName="shadow-lg rounded-lg font-sans"
                        calendarTodayClassName="bg-[#d3e8db] text-[#055B5C] font-bold rounded-full"
                        placeholder="تاریخ را وارد کنید"
                      />
                    </div>
                  )}
                </div>

                {viewMode === "daily" && (
                  <div className="mb-5">
                    <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">

                      <div className="flex items-center gap-2 w-full sm:w-1/2">
                        <select
                          value={addingId}
                          onChange={(e) => setAddingId(e.target.value)}
                          className="flex-1 border-2 border-[#9FC6C3] rounded-full px-3 py-2 text-sm"
                        >
                          <option value="">انتخاب کاربر…</option>
                          {availableUsers.map((u) => (
                            <option key={u.id} value={String(u.id)}>
                              {u.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={handleAddUser}
                          className="px-3 py-2 rounded-lg bg-[#FF7A00] text-white text-sm cursor-pointer flex items-center gap-2"
                        >
                          <FiPlus />
                          افزودن
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {viewMode === "daily" ? (
                  <>
                    <div className="block md:hidden space-y-4">
                      {selectedUsers.length === 0 ? (
                        <div className="p-3 text-center text-gray-500 text-sm">هنوز کاربری اضافه نشده است</div>
                      ) : (
                        selectedUsers.map((user) => {
                          const rec = attendance[String(user.id)] || {};
                          return (
                            <div key={user.id} className="bg-white p-4 rounded-lg shadow border border-[#d3e8db]">
                              <div className="flex items-center justify-between mb-2">
                                <div className="font-semibold text-[#055B5C] text-sm">{user.name}</div>
                                <button
                                  onClick={() => handleRemoveUser(user.id)}
                                  className="text-[#FF7A00] hover:text-[#e56d00] text-base cursor-pointer"
                                  aria-label="حذف کاربر"
                                >
                                  <FiX />
                                </button>
                              </div>

                              <div className="flex flex-wrap gap-2 justify-end">
                                {STATUS_OPTIONS.map((opt) => (
                                  <label
                                    key={opt.value}
                                    className={`inline-flex items-center px-3 py-2 rounded-full cursor-pointer text-xs transition ${rec.status === opt.value
                                        ? `${opt.color} ring-2 ring-offset-2 ring-[#FF7A00]`
                                        : "bg-gray-100 hover:bg-gray-200"
                                      }`}
                                  >
                                    <input
                                      type="radio"
                                      name={`att-${user.id}`}
                                      value={opt.value}
                                      checked={rec.status === opt.value}
                                      onChange={() => handleStatusChange(user.id, opt.value)}
                                      className="hidden"
                                    />
                                    <span>{opt.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-right border-collapse table-fixed">
                        <thead className="bg-[#d3e8db]">
                          <tr>
                            <th className="p-3 font-semibold text-[#055B5C] text-sm w-1/3">نام کاربر</th>
                            <th className="p-3 font-semibold text-[#055B5C] text-sm w-1/10">وضعیت حضور</th>
                            <th className="p-3 w-1/6"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedUsers.length === 0 ? (
                            <tr>
                              <td colSpan={3} className="p-4 text-center text-gray-500 text-sm">
                                هنوز کاربری اضافه نشده است
                              </td>
                            </tr>
                          ) : (
                            selectedUsers.map((user, idx) => {
                              const rec = attendance[String(user.id)] || {};
                              return (
                                <tr
                                  key={user.id}
                                  className={idx % 2 === 0 ? "bg-white" : "bg-[#EAF4EF]"}
                                >
                                  <td className="p-3 text-[#055B5C] text-sm align-middle">{user.name}</td>
                                  <td className="p-3 align-middle">
                                    <div className="flex flex-wrap gap-2 justify-end">
                                      {STATUS_OPTIONS.map((opt) => (
                                        <label
                                          key={opt.value}
                                          className={`inline-flex items-center px-3 py-2 rounded-full cursor-pointer text-xs transition ${rec.status === opt.value
                                              ? `${opt.color} ring-2 ring-offset-2 ring-[#FF7A00]`
                                              : "bg-gray-100 hover:bg-gray-200"
                                            }`}
                                        >
                                          <input
                                            type="radio"
                                            name={`att-${user.id}`}
                                            value={opt.value}
                                            checked={rec.status === opt.value}
                                            onChange={() => handleStatusChange(user.id, opt.value)}
                                            className="hidden"
                                          />
                                          <span>{opt.label}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="p-3 text-left align-middle">
                                    <button
                                      onClick={() => handleRemoveUser(user.id)}
                                      className="text-[#FF7A00] hover:text-[#e56d00] text-sm cursor-pointer"
                                    >
                                      حذف
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>


                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="mt-5 w-full md:w-auto bg-[#FF7A00] hover:bg-[#e56d00] transition text-white font-bold py-2.5 px-5 rounded-lg shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
                    >
                      <FiSave />
                      <span>ذخیره / به روز رسانی </span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-sm text-gray-600">در این حالت، خلاصه از روی رکوردهای ذخیره‌شده ساخته می‌شود.</div>
                    <div className="hidden md:block overflow-x-auto mt-4">
                      <table className="w-full text-right border-collapse">
                        <thead className="bg-[#d3e8db]">
                          <tr>
                            <th className="p-3 font-semibold text-[#055B5C] text-sm">نام کاربر</th>
                            <th className="p-3 font-semibold text-[#055B5C] text-sm">حاضر</th>
                            <th className="p-3 font-semibold text-[#055B5C] text-sm">غایب</th>
                            <th className="p-3 font-semibold text-[#055B5C] text-sm">درصد حضور</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allUsers.map((user, idx) => {
                            let present = 0;
                            let absent = 0;
                            Object.values(attendanceRecords).forEach((byUser) => {
                              const rec = byUser[String(user.id)];
                              if (rec?.status === "present") present++;
                              if (rec?.status === "absent") absent++;
                            });
                            const total = present + absent;
                            const pct = total ? Math.round((present / total) * 100) : null;

                            return (
                              <tr key={user.id} className={idx % 2 === 0 ? "bg-white" : "bg-[#EAF4EF]"}>
                                <td className="p-3 text-[#055B5C] text-sm">{user.name}</td>
                                <td className="p-3 text-[#055B5C] font-bold text-sm">{present}</td>
                                <td className="p-3 text-[#D33A3A] font-bold text-sm">{absent}</td>
                                <td className="p-3 font-bold text-sm">{pct !== null ? `${pct}%` : "-"}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="block md:hidden space-y-3 mt-4">
                      {allUsers.map((user) => {
                        let present = 0;
                        let absent = 0;
                        Object.values(attendanceRecords).forEach((byUser) => {
                          const rec = byUser[String(user.id)];
                          if (rec?.status === "present") present++;
                          if (rec?.status === "absent") absent++;
                        });
                        const total = present + absent;
                        const pct = total ? Math.round((present / total) * 100) : null;

                        return (
                          <div key={user.id} className="bg-white p-4 rounded-lg shadow-md border border-[#d3e8db]">
                            <div className="font-bold text-[#055B5C] text-sm mb-2">{user.name}</div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-600">حاضر:</span>
                                <span className="text-[#055B5C] font-bold">{present}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">غایب:</span>
                                <span className="text-[#D33A3A] font-bold">{absent}</span>
                              </div>
                              <div className="col-span-2 pt-2 border-t border-[#d3e8db]">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">درصد حضور:</span>
                                  <span className="font-bold">{pct !== null ? `${pct}%` : "-"}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <div className="w-full md:w-80 p-6 bg-[#EAF4EF]">
                <h3 className="flex items-center justify-center font-bold text-base mb-4 text-[#055B5C] gap-2">
                  <FiUsers />
                  <span>تاریخ‌های ثبت شده</span>
                </h3>

                <div className="mb-4">
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    value={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      setViewMode("daily");
                    }}
                    format="YYYY/MM/DD"
                    calendarPosition="bottom-right"
                    className="border border-[#9FC6C3] p-2 rounded-lg shadow-sm w-full"
                    inputClassName="border border-[#9FC6C3] p-1 rounded-lg text-sm font-semibold text-right"
                    inputClass="border border-[#9FC6C3] p-1 rounded-lg text-sm font-semibold text-right"
                    calendarClassName="shadow-lg rounded-lg font-sans"
                    calendarTodayClassName="bg-[#d3e8db] text-[#055B5C] font-bold rounded-full"
                  />
                </div>

                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                  {savedDates.length === 0 ? (
                    <div className="text-center py-6 text-gray-400 text-sm">هیچ تاریخی ثبت نشده است</div>
                  ) : (
                    savedDates.map((date) => {
                      const isSelected = selectedDateKey === date && viewMode === "daily";
                      const count = Object.keys(attendanceRecords[date] || {}).length;
                      return (
                        <div
                          key={date}
                          className={`flex items-center justify-between rounded-lg border px-3 py-2 cursor-pointer transition text-sm
                            ${isSelected ? "bg-[#d3e8db] text-[#055B5C]" : "bg-white text-gray-900"}
                            hover:bg-[#d3e8db]`}
                          onClick={() => {
                            setSelectedDate(
                              new DateObject({
                                calendar: persian,
                                locale: persian_fa,
                                date,
                              })
                            );
                            setViewMode("daily");
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <span>{date}</span>
                            <span className="bg-[#055B5C] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs select-none">
                              {count}
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`حذف حضور و غیاب تاریخ ${date}؟`)) {
                                setAttendanceRecords((prev) => {
                                  const next = { ...prev };
                                  delete next[date];
                                  return next;
                                });
                                if (selectedDateKey === date) {
                                  setAttendance({});
                                  setSelectedUsers([]);
                                }
                                toast.success(`حضور و غیاب ${date} حذف شد`);
                              }
                            }}
                            className="text-[#FF7A00] hover:text-[#e06c00] text-base font-bold cursor-pointer"
                            aria-label={`حذف حضور و غیاب تاریخ ${date}`}
                          >
                            ×
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <ToastContainer position="top-right" autoClose={4000} rtl pauseOnFocusLoss={false} />
    </div>
  );
};

export default AttendanceManagement;
