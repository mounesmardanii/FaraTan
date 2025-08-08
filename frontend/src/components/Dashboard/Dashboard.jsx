import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import AdminSidebar from '../AdminSidebar';
import AdminHeader from '../AdminHeader';

function Dashboard() {
  const [stats] = useState({
    activeUsers: 130,
    monthlyRevenue: '20,280,000',
    activeCoaches: 30,
  });


  const [courses] = useState([
    { title: 'دوره عمومی', count: 25 },
    { title: ' VIP دوره', count: 10 },
    { title: 'دوره خصوصی', count: 15 },
  ]);

  const todayClasses = [
    {
      title: 'بدنسازی',
      startTime: '8:00',
      endTime: '10:00',
      coach: 'رضا احمدی',
      status: 'شروع شده',
    },
    {
      title: 'یوگا',
      startTime: '10:30',
      endTime: '12:00',
      coach: 'سارا کریمی',
      status: 'منتظر شروع',
    },
    {
      title: 'پیلاتس',
      startTime: '14:00',
      endTime: '15:30',
      coach: 'مریم نظری',
      status: 'پایان یافته',
    },
  ];

  const growthData = [
    { month: 'فروردین', users: 50 },
    { month: 'اردیبهشت', users: 75 },
    { month: 'خرداد', users: 100 },
    { month: 'تیر', users: 90 },
    { month: 'مرداد', users: 120 },
  ];

  const attendanceData = [
    { day: 'شنبه', attendance: 40 },
    { day: 'یکشنبه', attendance: 25 },
    { day: 'دوشنبه', attendance: 30 },
    { day: 'سه‌شنبه', attendance: 20 },
    { day: 'چهارشنبه', attendance: 25 },
    { day: 'پنج‌شنبه', attendance: 15 },
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // کامپوننت کلاس‌های امروز
  function TodayClasses() {
    const sortedClasses = [...todayClasses].sort((a, b) => {
      const timeToMinutes = (time) => {
        const [h, m = '0'] = time.split(':');
        return parseInt(h) * 60 + parseInt(m);
      };
      return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
    });

    return (
      <div className="bg-[#EAF4EF] rounded-xl p-6 shadow">
        <h3 className="text-center font-bold text-[#FF7A00] mb-4">کلاس‌های امروز</h3>

        {/* جدول فقط روی صفحه‌های متوسط و بزرگ */}
        <table className="min-w-full text-[#055B5C] text-center border-collapse hidden md:table">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 px-4">وضعیت</th>
              <th className="py-2 px-4">مربی</th>
              <th className="py-2 px-4">زمان پایان</th>
              <th className="py-2 px-4">زمان شروع</th>
              <th className="py-2 px-4">نام کلاس</th>
            </tr>
          </thead>
          <tbody>
            {sortedClasses.map((cls, i) => (
              <tr
                key={i}
                className={`border-b border-gray-200 ${i % 2 === 0 ? 'bg-[#d3e8db]' : 'bg-[#e9f2ea]'
                  }`}
              >
                <td
                  className={`py-2 px-4 font-semibold ${cls.status === 'شروع شده'
                      ? 'text-green-600'
                      : cls.status === 'منتظر شروع'
                        ? 'text-orange-600'
                        : 'text-gray-500'
                    }`}
                >
                  {cls.status}
                </td>
                <td className="py-2 px-4">{cls.coach}</td>
                <td className="py-2 px-4">{cls.endTime}</td>
                <td className="py-2 px-4">{cls.startTime}</td>
                <td className="py-2 px-4">{cls.title}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* کارت‌ها فقط روی صفحه‌های کوچک */}
        <div className="flex flex-col gap-4 md:hidden">
          {sortedClasses.map((cls, i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow">
              <p>
                <span className="font-semibold">وضعیت:</span>{' '}
                <span
                  className={
                    cls.status === 'شروع شده'
                      ? 'text-green-600'
                      : cls.status === 'منتظر شروع'
                        ? 'text-orange-600'
                        : 'text-gray-500'
                  }
                >
                  {cls.status}
                </span>
              </p>
              <p><span className="font-semibold">مربی:</span> {cls.coach}</p>
              <p><span className="font-semibold">زمان پایان:</span> {cls.endTime}</p>
              <p><span className="font-semibold">زمان شروع:</span> {cls.startTime}</p>
              <p className="font-bold text-[#055B5C] text-lg">{cls.title}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-white font-sans flex flex-col relative">

      <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 relative mt-4">

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

        {sidebarOpen && (
          <div
            className="fixed md:hidden inset-0 top-[4rem] z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main
          className={`flex-1 p-8 md:p-10 relative z-10 overflow-y-auto border-t-[3px] border-l-[3px] border-[#FF7A00] rounded-tl-[75px] bg-white flex flex-col gap-6 text-right mt-3 ml-10
            ${sidebarOpen ? 'pointer-events-none select-none' : ''}
          `}
        >
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            {[{ label: 'تعداد کاربران فعال', value: stats.activeUsers },
            { label: 'درآمد این ماه', value: stats.monthlyRevenue },
            { label: 'تعداد مربیان فعال', value: stats.activeCoaches },
            ].map((item, i) => (
              <motion.div key={i} className="bg-[#EAF4EF] rounded-xl shadow p-5 flex flex-col items-center justify-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
              >
                <p className="text-orange-600 font-bold text-sm mb-1">{item.label}</p>
                <p className="text-2xl font-extrabold text-[#055B5C]">{item.value}</p>
              </motion.div>

            ))}
          </motion.div>

          <motion.div className=" bg-[#EAF4EF] rounded-xl shadow p-6"
            initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.8 }}
          >
            <p className="text-orange-600 font-bold text-sm mb-3 text-center">انواع دوره‌ها</p>
            <div className="flex justify-around text-[#055B5C] font-bold">
              {courses.map((c, i) => (
                <motion.div key={i} className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + i * 0.2, duration: 0.5 }}
                >
                  <p>{c.title}</p>
                  <p dir="rtl">{c.count} نفر</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div className="bg-[#EAF4EF] rounded-xl shadow p-6 h-[220px]"
              initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 1.5 }}
            >
              <p className="text-orange-600 font-bold text-sm mb-3 text-center">نمودار رشد کاربران (واحد: نفر)</p>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#FF7A00" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div className="bg-[#EAF4EF] rounded-xl shadow p-6 h-[220px]"
              initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 1.7 }}
            >
              <p className="text-orange-600 font-bold text-sm mb-3 text-center">نمودار حضور هفتگی (واحد: نفر)</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="attendance" fill="#FF7A00" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <motion.div className="bg-[#EAF4EF] rounded-xl shadow p-6"
            initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 2.3 }}
          >
            <TodayClasses />
          </motion.div>

        </main>
      </div>
    </div>
  );
}

export default Dashboard;
