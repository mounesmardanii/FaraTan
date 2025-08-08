import React, { useState, useEffect, useCallback } from 'react';
import AdminHeader from '../AdminHeader';
import AdminSidebar from '../AdminSidebar';
import { motion } from 'framer-motion';
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiSearch, FiSave, FiCalendar, FiUsers, FiList } from "react-icons/fi";

const STATUS_OPTIONS = [
  { value: "present", label: "حاضر", color: "bg-[#EAF4EF] text-[#055B5C]" },
  { value: "absent", label: "غایب", color: "bg-[#FFE8E8] text-[#D33A3A]" },
];

const initialUsers = [
  { id: 1, name: "کاربر اول", position: "توسعه دهنده فرانت‌اند" },
  { id: 2, name: "کاربر دوم", position: "توسعه دهنده بک‌اند" },
  { id: 3, name: "کاربر سوم", position: "طراح UI/UX" },
  { id: 4, name: "کاربر چهارم", position: "مدیر پروژه" },
  { id: 5, name: "کاربر پنجم", position: "تحلیلگر داده" },
];

const AttendanceManagement = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new DateObject({ calendar: persian }));
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [attendance, setAttendance] = useState({});
  const [viewMode, setViewMode] = useState("daily");
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const data = localStorage.getItem("attendanceRecords");
        if (data) {
          setAttendanceRecords(JSON.parse(data));
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("خطا در بارگذاری داده‌های ذخیره شده");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (isLoading) return;

    try {
      localStorage.setItem("attendanceRecords", JSON.stringify(attendanceRecords));
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("خطا در ذخیره داده‌ها");
    }
  }, [attendanceRecords, isLoading]);

  // Format date to string
  const formatDate = useCallback((dateObj) => {
    if (!dateObj) return "";
    if (typeof dateObj === "string") return dateObj;
    return dateObj.format("YYYY-MM-DD");
  }, []);

  // Load attendance for selected date
  useEffect(() => {
    if (isLoading) return;

    const dateKey = formatDate(selectedDate);
    if (attendanceRecords[dateKey]) {
      setAttendance(attendanceRecords[dateKey]);
    } else {
      const emptyAttendance = {};
      users.forEach((user) => {
        emptyAttendance[user.id] = "";
      });
      setAttendance(emptyAttendance);
    }
  }, [selectedDate, attendanceRecords, users, isLoading, formatDate]);

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setUsers(initialUsers);
    } else {
      const filtered = initialUsers.filter(
        (user) =>
          user.name.includes(searchTerm) ||
          user.position.includes(searchTerm)
      );
      setUsers(filtered);
    }
  }, [searchTerm]);

  const handleStatusChange = (userId, status) => {
    setAttendance((prev) => ({ ...prev, [userId]: status }));
  };

  const handleSave = () => {
    const dateKey = formatDate(selectedDate);

    if (!dateKey) {
      toast.warning("لطفاً یک تاریخ معتبر انتخاب کنید");
      return;
    }

    // Validate if all users have status
    const hasEmptyStatus = users.some(user => !attendance[user.id]);
    if (hasEmptyStatus) {
      toast.warning("لطفاً وضعیت تمام کاربران را مشخص کنید");
      return;
    }

    setAttendanceRecords((prev) => ({ ...prev, [dateKey]: attendance }));
    toast.success(`حضور و غیاب برای تاریخ ${dateKey} با موفقیت ذخیره شد`);
  };

  const savedDates = Object.keys(attendanceRecords).sort((a, b) => (a < b ? 1 : -1));
  const selectedDateString = formatDate(selectedDate);

  // Calculate statistics for overview mode
  const calculateStatistics = () => {
    const stats = {};
    users.forEach((user) => {
      stats[user.id] = {
        name: user.name,
        present: 0,
        absent: 0,
        total: 0,
      };
    });

    Object.entries(attendanceRecords).forEach(([date, records]) => {
      Object.entries(records).forEach(([userId, status]) => {
        if (stats[userId]) {
          stats[userId][status]++;
          stats[userId].total++;
        }
      });
    });

    return stats;
  };

  const statistics = calculateStatistics();

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col text-right">
      <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 mt-4">
        <aside className="hidden md:flex mt-3 w-64 z-30 border-t-[3px] border-r-[3px] border-[#055B5C] rounded-tr-[75px]">
          <AdminSidebar />
        </aside>

        <motion.aside
          initial={{ x: '-100%' }}
          animate={{ x: sidebarOpen ? 0 : '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed md:hidden top-[4rem] left-0 z-50 w-[275px] h-[calc(100vh-4rem)] bg-[#D1E7D8] border-t-[3px] border-r-[3px] border-[#055B5C] rounded-tr-[75px] p-6 overflow-y-auto mt-13"
        >
          <AdminSidebar />
        </motion.aside>

        {sidebarOpen && (
          <div
            className="fixed md:hidden inset-0 top-[4rem] z-40 bg-black/50 mt-13.5"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <main dir="rtl" className="flex-1 p-4 md:p-8 z-10 border-t-[3px] border-l-[3px] border-[#FF7A00] rounded-tl-[75px] bg-white md:ml-10 mt-3 ml-10">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-[#055B5C] font-bold text-xl md:text-2xl text-center mb-6"
          >
            سیستم مدیریت حضور و غیاب
          </motion.h2>

          <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-[#d3e8db]">
            {/* Header */}
            <div className="bg-[#055B5C] p-6 text-white">
              <h1 className="text-2xl md:text-3xl font-bold">سیستم مدیریت حضور و غیاب</h1>
              <p className="mt-2 opacity-90">ثبت و مدیریت وضعیت حضور کاربران</p>
            </div>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row">
              {/* Left Panel - Form */}
              <div className="flex-1 p-6 border-r border-[#d3e8db]">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-center mb-6 gap-4 text-center md:text-right">
                  <div className="flex items-center justify-center space-x-4 space-x-reverse md:justify-start w-full md:w-auto">
                    <button
                      onClick={() => setViewMode("daily")}
                      className={`px-4 py-2 rounded-lg ${viewMode === "daily" ? "bg-[#FF7A00] text-white" : "bg-[#d3e8db] text-[#055B5C]"}`}
                    >
                      <div className="flex items-center gap-2">
                        <FiCalendar />
                        <span>حالت روزانه</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setViewMode("overview")}
                      className={`px-4 py-2 rounded-lg ${viewMode === "overview" ? "bg-[#FF7A00] text-white" : "bg-[#d3e8db] text-[#055B5C]"}`}
                    >
                      <div className="flex items-center gap-2">
                        <FiList />
                        <span>نمایش کلی</span>
                      </div>
                    </button>
                  </div>

                  <span className="w-full md:w-auto block md:inline-block text-[#055B5C]">برای لیست جدید تاریخ جدید وارد کنید</span>

                  {viewMode === "daily" && (
                    <div className="w-full md:w-auto">
                      <DatePicker
                        calendar={persian}
                        locale={persian_fa}
                        value={selectedDate}
                        onChange={setSelectedDate}
                        format="YYYY/MM/DD"
                        calendarPosition="bottom-right"
                        className="border border-[#9FC6C3] p-2 rounded-lg shadow-sm w-full text-[20px]"
                        inputClass="border border-[#9FC6C3] p-1 rounded-lg text-lg font-semibold text-right"
                        calendarClassName="shadow-lg rounded-lg font-sans"
                        calendarTodayClassName="bg-[#d3e8db] text-[#055B5C] font-bold rounded-full"
                        placeholder="تاریخ را وارد کنید"
                      />
                    </div>
                  )}
                </div>

                {/* Search Box */}
                <div className="relative mb-6">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  </div>
                  <input
                    type="text"
                    placeholder="جستجوی کاربر..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex items-center border-2 border-[#9FC6C3] rounded-full px-3 py-1 md:px-4 md:py-2 w-full max-w-[80%] md:max-w-sm mx-auto"
                  />
                </div>

                {viewMode === "daily" ? (
                  <>
                    {/* Mobile View (Cards) */}
                    <div className="block md:hidden space-y-4">
                      {users.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">کاربری یافت نشد</div>
                      ) : (
                        users.map((user) => (
                          <div key={user.id} className="bg-white p-4 rounded-lg shadow border border-[#d3e8db]">
                            <div className="font-medium text-[#055B5C] mb-2">{user.name}</div>
                            <div className="flex flex-wrap gap-2 justify-end">
                              {STATUS_OPTIONS.map((option) => (
                                <label
                                  key={option.value}
                                  className={`inline-flex items-center px-3 py-2 rounded-full cursor-pointer transition ${attendance[user.id] === option.value
                                    ? `${option.color} ring-2 ring-offset-2 ring-[#FF7A00]`
                                    : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                                >
                                  <input
                                    type="radio"
                                    name={`attendance-${user.id}`}
                                    value={option.value}
                                    checked={attendance[user.id] === option.value}
                                    onChange={() => handleStatusChange(user.id, option.value)}
                                    className="hidden"
                                  />
                                  <span className="text-sm font-medium">{option.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Desktop View (Table) */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-right border-collapse">
                        <thead className="bg-[#d3e8db]">
                          <tr>
                            <th className="p-4 font-semibold text-[#055B5C]">نام کاربر</th>
                            <th className="p-4 font-semibold text-[#055B5C]">وضعیت حضور</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.length === 0 ? (
                            <tr>
                              <td colSpan="2" className="p-4 text-center text-gray-500">
                                کاربری یافت نشد
                              </td>
                            </tr>
                          ) : (
                            users.map((user, idx) => (
                              <tr
                                key={user.id}
                                className={idx % 2 === 0 ? "bg-white" : "bg-[#EAF4EF]"}
                              >
                                <td className="p-4 font-medium text-[#055B5C]">{user.name}</td>
                                <td className="p-4">
                                  <div className="flex flex-wrap gap-2 justify-end">
                                    {STATUS_OPTIONS.map((option) => (
                                      <label
                                        key={option.value}
                                        className={`inline-flex items-center px-3 py-2 rounded-full cursor-pointer transition ${attendance[user.id] === option.value
                                          ? `${option.color} ring-2 ring-offset-2 ring-[#FF7A00]`
                                          : "bg-gray-100 hover:bg-gray-200"
                                          }`}
                                      >
                                        <input
                                          type="radio"
                                          name={`attendance-${user.id}`}
                                          value={option.value}
                                          checked={attendance[user.id] === option.value}
                                          onChange={() => handleStatusChange(user.id, option.value)}
                                          className="hidden"
                                        />
                                        <span className="text-sm font-medium">{option.label}</span>
                                      </label>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="mt-6 w-full md:w-auto bg-[#FF7A00] hover:bg-[#e56d00] transition text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center justify-center gap-2"
                    >
                      <FiSave />
                      <span>ذخیره حضور و غیاب</span>
                    </button>
                  </>
                ) : (
                  <>
                    {/* Mobile View (Cards) - Right Aligned */}
                    <div className="block md:hidden space-y-3 text-right">
                      {users.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-lg">کاربری یافت نشد</div>
                      ) : (
                        users.map((user) => {
                          const stat = statistics[user.id] || {};
                          const presencePercent = stat.total > 0
                            ? Math.round((stat.present / stat.total) * 100)
                            : null;

                          return (
                            <div key={user.id} className="bg-white p-4 rounded-lg shadow-md border border-[#d3e8db] text-right">
                              <div className="font-bold text-[#055B5C] text-lg mb-3 text-right">{user.name}</div>
                              <div className="grid grid-cols-2 gap-2 text-base text-right">
                                <div className="flex justify-between items-center text-right">
                                  <span className="font-medium text-gray-600 text-right">حاضر:</span>
                                  <span className="text-[#055B5C] font-bold text-right">{stat.present || 0}</span>
                                </div>
                                <div className="flex justify-between items-center text-right">
                                  <span className="font-medium text-gray-600 text-right">غایب:</span>
                                  <span className="text-[#D33A3A] font-bold text-right">{stat.absent || 0}</span>
                                </div>
                                <div className="col-span-2 pt-2 border-t border-[#d3e8db] text-right">
                                  <div className="flex justify-between items-center text-right">
                                    <span className="font-medium text-gray-600 text-right">درصد حضور:</span>
                                    {presencePercent !== null ? (
                                      <span className="font-bold text-[#055B5C] text-right">{presencePercent}%</span>
                                    ) : (
                                      <span className="text-gray-400 text-right">-</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Desktop View (Table) - Right Aligned */}
                    <div className="hidden md:block overflow-x-auto text-right">
                      <table className="w-full text-right border-collapse">
                        <thead className="bg-[#d3e8db] text-right">
                          <tr className="text-right">
                            <th className="p-4 font-bold text-[#055B5C] text-lg text-right">نام کاربر</th>
                            <th className="p-4 font-bold text-[#055B5C] text-lg text-right">حاضر</th>
                            <th className="p-4 font-bold text-[#055B5C] text-lg text-right">غایب</th>
                            <th className="p-4 font-bold text-[#055B5C] text-lg text-right">درصد حضور</th>
                          </tr>
                        </thead>
                        <tbody className="text-right">
                          {users.map((user, idx) => {
                            const stat = statistics[user.id] || {};
                            const presencePercent = stat.total > 0
                              ? Math.round((stat.present / stat.total) * 100)
                              : null;

                            return (
                              <tr key={user.id} className={`${idx % 2 === 0 ? "bg-white" : "bg-[#EAF4EF]"} text-right`}>
                                <td className="p-4 font-bold text-[#055B5C] text-lg text-right">{user.name}</td>
                                <td className="p-4 text-[#055B5C] font-bold text-lg text-right">{stat.present || 0}</td>
                                <td className="p-4 text-[#D33A3A] font-bold text-lg text-right">{stat.absent || 0}</td>
                                <td className="p-4 font-bold text-lg text-right">
                                  {presencePercent !== null ? (
                                    <span className="text-[#055B5C] text-right">{presencePercent}%</span>
                                  ) : (
                                    <span className="text-gray-400 text-right">-</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>

              {/* Right Panel - History */}
              <div className="w-full md:w-80 p-6 bg-[#EAF4EF]">
                <h3 className="flex items-center justify-center font-bold text-lg mb-4 text-[#055B5C] gap-2">
                  <FiUsers />
                  <span>تاریخ‌های ثبت شده</span>
                </h3>

                {/* DatePicker for admin to select date quickly */}
                <div className="mb-4 flex items-center justify-center">
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
                    inputClass="border border-[#9FC6C3] p-1 rounded-lg text-lg font-semibold text-right"
                    calendarClassName="shadow-lg rounded-lg font-sans"
                    calendarTodayClassName="bg-[#d3e8db] text-[#055B5C] font-bold rounded-full"
                  />
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {savedDates.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">هیچ تاریخی ثبت نشده است</div>
                  ) : (
                    savedDates.map((date) => {
                      const isSelected = selectedDateString === date && viewMode === "daily";

                      return (
                        <div
                          key={date}
                          className={`flex items-center justify-between rounded-lg border px-4 py-3 cursor-pointer transition
                          ${isSelected ? "bg-[#d3e8db] text-[#055B5C]" : "bg-white text-gray-900"}
                          hover:bg-[#d3e8db]"`}
                          onClick={() => {
                            setSelectedDate(new DateObject({
                              calendar: persian,
                              locale: persian_fa,
                              date: date,
                            }));
                            setViewMode("daily");
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <span>{date}</span>
                            <span className="bg-[#055B5C] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm select-none">
                              {Object.keys(attendanceRecords[date] || {}).length}
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`آیا از حذف حضور و غیاب تاریخ ${date} اطمینان دارید؟`)) {
                                setAttendanceRecords((prev) => {
                                  const newRecords = { ...prev };
                                  delete newRecords[date];
                                  return newRecords;
                                });

                                if (selectedDateString === date) {
                                  setAttendance({});
                                }

                                toast.success(`حضور و غیاب تاریخ ${date} حذف شد`);
                              }
                            }}
                            className="text-[#FF7A00] hover:text-[#e06c00] text-lg font-bold cursor-pointer"
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        rtl={true}
        pauseOnFocusLoss={false}
      />
    </div>
  );
};

export default AttendanceManagement;