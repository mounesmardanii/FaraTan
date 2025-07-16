import React, { useState } from 'react';
import AdminHeader from '../AdminHeader';
import AdminSidebar from '../AdminSidebar';
import { motion } from 'framer-motion';

const PaymentStatus = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [newPayment, setNewPayment] = useState({
    name: '',
    courseType: '',
    sessions: '',
    coach: '',
    date: '',
    amount: '',
    method: '',
    status: ''
  });

  const [payments, setPayments] = useState([
    { id: 1, name: 'مونس مردانی', courseType: 'VIP', sessions: 10, coach: 'خانم الف', date: '1 آذر', amount: 150, method: 'آنلاین', status: 'پرداخت شده' },
    { id: 2, name: 'ملاحت مردانی', courseType: 'عمومی', sessions: 8, coach: 'خانم ب', date: '5 آذر', amount: 200, method: 'کارتخوان', status: 'پرداخت شده' },
    { id: 3, name: 'غزل نادری', courseType: 'خصوصی', sessions: 5, coach: 'خانم ج', date: '', amount: 0, method: '', status: 'پرداخت نشده' },
    { id: 4, name: 'نگین شاکری', courseType: 'VIP', sessions: 12, coach: 'خانم د', date: '10 آذر', amount: 400, method: 'نقدی', status: 'پرداخت شده' }
  ]);

  const handleDelete = (id) => {
    setPayments(prev => prev.filter(p => p.id !== id));
  };

  const handleAdd = () => {
    if (!newPayment.name || !newPayment.amount) return;
    setPayments([...payments, { ...newPayment, id: Date.now() }]);
    setNewPayment({ name: '', courseType: '', sessions: '', coach: '', date: '', amount: '', method: '', status: '' });
  };

  const handleEdit = (id) => {
    const toEdit = payments.find(p => p.id === id);
    setNewPayment(toEdit);
    setEditId(id);
  };

  const handleUpdate = () => {
    setPayments(payments.map(p => (p.id === editId ? { ...newPayment, id: editId } : p)));
    setNewPayment({ name: '', courseType: '', sessions: '', coach: '', date: '', amount: '', method: '', status: '' });
    setEditId(null);
  };

  const filtered = payments.filter(p => p.name.includes(search));

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

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

        <main
          dir="rtl"
          className="flex-1 p-4 md:p-8 relative z-10 border-t-[3px] border-l-[3px] border-[#FF6600] rounded-tl-[75px] flex flex-col gap-6 text-right mt-3 ml-10 md:ml-10"
        >
          <motion.input
            type="text"
            placeholder="نام را وارد کنید..."
            className="border-2 border-[#9FC6C3] rounded-full px-2 py-1 text-[11px] sm:px-3 sm:py-2 sm:text-[13px] md:text-sm w-full max-w-[80%] sm:max-w-[75%] md:max-w-sm mx-auto text-right text-[#055B5C] focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          />
          <motion.h2
            className="text-center text-[#FF6600] font-bold text-lg md:text-xl"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            وضعیت پرداخت‌ها
          </motion.h2>

          <motion.div
            className="bg-[#D1E7D8] rounded-xl shadow p-3 sm:p-4 w-full max-w-[98%] mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="w-full">
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-xs md:text-sm text-[#055B5C] text-center font-semibold">
                  <thead>
                    <tr className="bg-[#9FC6C3] text-white">
                      <th className="p-2">نام عضو</th>
                      <th className="p-2">نوع دوره</th>
                      <th className="p-2">تعداد جلسات</th>
                      <th className="p-2">مربی</th>
                      <th className="p-2">تاریخ خرید</th>
                      <th className="p-2">مبلغ</th>
                      <th className="p-2">روش پرداخت</th>
                      <th className="p-2">وضعیت</th>
                      <th className="p-2">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p, i) => (
                      <motion.tr
                        key={p.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="bg-[#EAF4EF] border-b hover:bg-[#D1E7D8]"
                      >
                        <td className="p-2">{p.name}</td>
                        <td className="p-2">{p.courseType}</td>
                        <td className="p-2">{p.sessions}</td>
                        <td className="p-2">{p.coach}</td>
                        <td className="p-2">{p.date || '-'}</td>
                        <td className="p-2">{p.amount}</td>
                        <td className="p-2">{p.method || '-'}</td>
                        <td className="p-2">{p.status || '-'}</td>
                        <td className="p-2 flex justify-center gap-1">
                          <button
                            className="text-sm bg-[#FF6600] text-white px-2 py-1 rounded hover:bg-[#e65c00] transition cursor-pointer"
                            onClick={() => handleEdit(p.id)}
                          >
                            ویرایش
                          </button>
                          <button
                            className="text-sm bg-[#9FC6C3] text-[#055B5C] px-2 py-1 rounded hover:bg-[#85bab4] transition cursor-pointer"
                            onClick={() => handleDelete(p.id)}
                          >
                            حذف
                          </button>
                        </td>
                      </motion.tr>
                    ))}

                    {/* Add/Edit Row */}
                    <tr className="bg-[#EAF4EF]">
                      {['name', 'courseType', 'sessions', 'coach', 'date', 'amount', 'method', 'status'].map((key) => (
                        <td key={key} className="p-2">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border rounded text-xs text-right"
                            placeholder={key}
                            value={newPayment[key]}
                            onChange={(e) => setNewPayment({ ...newPayment, [key]: e.target.value })}
                          />
                        </td>
                      ))}
                      <td className="p-2">
                        <button
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 cursor-pointer"
                          onClick={editId ? handleUpdate : handleAdd}
                        >
                          {editId ? 'ذخیره' : 'افزودن'}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* موبایل */}
              <div className="md:hidden flex flex-col gap-4">
                {filtered.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-[#EAF4EF] p-3 rounded-xl shadow text-sm text-[#055B5C]"
                  >
                    <div className="flex justify-between mb-1"><span className="font-bold">نام:</span><span>{p.name}</span></div>
                    <div className="flex justify-between mb-1"><span className="font-bold">نوع دوره:</span><span>{p.courseType}</span></div>
                    <div className="flex justify-between mb-1"><span className="font-bold">تعداد جلسات:</span><span>{p.sessions}</span></div>
                    <div className="flex justify-between mb-1"><span className="font-bold">مربی:</span><span>{p.coach}</span></div>
                    <div className="flex justify-between mb-1"><span className="font-bold">تاریخ خرید:</span><span>{p.date || '-'}</span></div>
                    <div className="flex justify-between mb-1"><span className="font-bold">مبلغ:</span><span>{p.amount}</span></div>
                    <div className="flex justify-between mb-1"><span className="font-bold">روش:</span><span>{p.method || '-'}</span></div>
                    <div className="flex justify-between mb-3"><span className="font-bold">وضعیت:</span><span>{p.status || '-'}</span></div>
                    <div className="flex gap-2 justify-end">
                      <button className="bg-[#FF6600] text-white px-2 py-1 rounded text-xs hover:bg-[#e65c00] transition cursor-pointer" onClick={() => handleEdit(p.id)}>ویرایش</button>
                      <button className="bg-[#9FC6C3] text-[#055B5C] px-2 py-1 rounded text-xs hover:bg-[#85bab4] transition cursor-pointer" onClick={() => handleDelete(p.id)}>حذف</button>
                    </div>
                  </motion.div>
                ))}

                <div className="bg-[#D1E7D8] p-3 rounded-xl shadow text-sm">
                  {['name', 'courseType', 'sessions', 'coach', 'date', 'amount', 'method', 'status'].map((key) => (
                    <div key={key} className="mb-2">
                      <input
                        type="text"
                        className="w-full px-2 py-1 border rounded text-xs text-right"
                        placeholder={key}
                        value={newPayment[key]}
                        onChange={(e) => setNewPayment({ ...newPayment, [key]: e.target.value })}
                      />
                    </div>
                  ))}
                  <div className="text-left">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 cursor-pointer"
                      onClick={editId ? handleUpdate : handleAdd}
                    >
                      {editId ? 'ذخیره' : 'افزودن'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default PaymentStatus;
