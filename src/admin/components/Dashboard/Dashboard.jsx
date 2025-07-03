import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import AdminSidebar from '../AdminSidebar';
import AdminHeader from '../AdminHeader';
import { assets } from '../../../assets/assets';

function Dashboard() {
  const [stats] = useState({
    activeUsers: 130,
    monthlyRevenue: '20,280,000',
    activeCoaches: 30,
  });

  const [weeklySchedule] = useState([
    { day: 'شنبه', time: '8-10' },
    { day: 'یکشنبه', time: '10-12' },
    { day: 'دوشنبه', time: '12-14' },
    { day: 'سه‌شنبه', time: '14-16' },
    { day: 'چهارشنبه', time: '16-18' },
    { day: 'پنج‌شنبه', time: '18-20' },
  ]);

  const [courses] = useState([
    { title: 'دوره سه‌ماهه', count: 25 },
    { title: 'دوره شش‌ماهه', count: 15 },
    { title: 'دوره یک‌ساله', count: 10 },
  ]);

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

  // وضعیت باز یا بسته بودن سایدبار در موبایل
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col relative">

      {/* هدر بدون fixed */}
      <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 relative mt-4">

        {/* دسکتاپ: سایدبار همیشه باز و بدون تغییر */}
        <aside className="hidden md:flex mt-3 w-64 z-20">
          <AdminSidebar />
        </aside>

        {/* موبایل: سایدبار کشویی */}
        <motion.aside
          initial={{ x: '-100%' }}
          animate={{ x: sidebarOpen ? 0 : '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed md:hidden top-[calc(4rem)] left-0 z-50 w-64 h-[calc(100vh-4rem)] bg-[#D1E7D8] border-r-4 border-[#055B5C] rounded-tr-[75px] p-4 overflow-y-auto shadow-lg"
          onClick={() => setSidebarOpen(false)}
        >
          <AdminSidebar />
        </motion.aside>

        {/* بک‌دراپ نیمه شفاف روی محتوای سمت راست */}
        {sidebarOpen && (
          <div
            className="fixed md:hidden inset-0 top-[4rem] bg-black bg-opacity-40 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* محتوای اصلی */}
        <main
          className={`flex-1 p-4 md:p-10 relative z-10 overflow-y-auto border-t-[3px] border-l-[3px] border-[#FF7A00] rounded-tl-[75px] bg-white flex flex-col gap-6 text-right mt-3 ml-10
            ${sidebarOpen ? 'pointer-events-none select-none' : ''}
          `}
        >

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            {[
              { label: 'تعداد کاربران فعال', value: stats.activeUsers },
              { label: 'درآمد این ماه', value: stats.monthlyRevenue },
              { label: 'تعداد مربیان فعال', value: stats.activeCoaches },
            ].map((item, i) => (
              <motion.div key={i} className="bg-[#D1E7D8] rounded-xl shadow p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
              >
                <p className="text-orange-600 font-bold text-sm mb-1">{item.label}</p>
                <p className="text-2xl font-extrabold text-[#055B5C]">{item.value}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Courses Section */}
          <motion.div
            className="bg-[#D1E7D8] rounded-xl shadow p-6"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.8 }}
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
                  <p>{c.count} نفر</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              className="bg-[#D1E7D8] rounded-xl shadow p-6 h-[220px]"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: 1.5 }}
            >
              <p className="text-orange-600 font-bold text-sm mb-3 text-center">نمودار رشد کاربران در سه ماه اخیر</p>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData} isAnimationActive={true}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#FF7A00"
                    strokeWidth={3}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              className="bg-[#D1E7D8] rounded-xl shadow p-6 h-[220px]"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: 1.7 }}
            >
              <p className="text-orange-600 font-bold text-sm mb-3 text-center">نمودار حضور غیاب هفتگی</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData} isAnimationActive={true}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="attendance"
                    fill="#FF7A00"
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                    isAnimationActive={true}
                  />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Weekly Schedule */}
          <motion.div
            className="bg-[#D1E7D8] rounded-xl shadow p-6"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 2 }}
          >
            <p className="text-orange-600 font-bold text-sm mb-4 text-center">برنامه‌ی هفتگی کلاس بدنسازی</p>

            {/* Wrapper با اسکرول افقی برای موبایل */}
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-center text-sm text-[#055B5C] font-semibold">
                <thead>
                  <tr>
                    {weeklySchedule.map((d, i) => (
                      <th key={i} className="px-4 py-2">{d.day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-[#EAF4EF]">
                  <tr>
                    {weeklySchedule.map((_, i) => (
                      <td key={i} className="px-4 py-2">بدنسازی</td>
                    ))}
                  </tr>
                  <tr>
                    {weeklySchedule.map((d, i) => (
                      <td key={i} className="px-4 py-2">{d.time}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

        </main>
      </div>
    </div>
  );
}

export default Dashboard;
