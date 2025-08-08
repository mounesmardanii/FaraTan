import React, { useState, useEffect } from "react";
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
import { motion } from "framer-motion";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const PaymentStatus = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const [newPayment, setNewPayment] = useState({
    name: "",
    courseType: "",
    sessions: "",
    date: "",
    amount: "",
    method: "",
    status: "",
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem("paymentList");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("paymentList", JSON.stringify(payments));
  }, [payments]);

  const userOptions = JSON.parse(localStorage.getItem("usersList")) || [];

  const handleAdd = () => {
    if (
      !newPayment.name ||
      !newPayment.amount ||
      !newPayment.courseType ||
      !newPayment.sessions
    ) {
      setShowAlert(true);
      return;
    }

    setShowAlert(false);

    const isPaid =
      newPayment.method === "کارتخوان" || newPayment.method === "نقدی"
        ? "پرداخت شده"
        : "پرداخت نشده";

    const updatedPayments = [
      ...payments,
      { ...newPayment, id: Date.now(), status: isPaid },
    ];

    setPayments(updatedPayments);
    resetPaymentForm();
  };

  const handleInvalidate = (id) => {
    const updated = payments.map((p) =>
      p.id === id ? { ...p, status: "باطل‌شده" } : p
    );
    setPayments(updated);
  };

  const resetPaymentForm = () => {
    setNewPayment({
      name: "",
      courseType: "",
      sessions: "",
      date: "",
      amount: "",
      method: "",
      status: "",
    });
    setEditId(null);
    setShowAlert(false);
  };

  const handleUpdate = () => {
    const isPaid =
      newPayment.method === "کارتخوان" || newPayment.method === "نقدی"
        ? "پرداخت شده"
        : "پرداخت نشده";

    const updatedPayments = payments.map((p) =>
      p.id === editId ? { ...newPayment, id: editId, status: isPaid } : p
    );

    setPayments(updatedPayments);
    resetPaymentForm();
  };

  const filtered = payments.filter((p) => p.name.includes(search));

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const placeholders = {
    name: "نام عضو",
    courseType: "نوع دوره",
    sessions: "تعداد جلسات",
    date: "تاریخ خرید",
    amount: "مبلغ",
    method: "روش پرداخت",
    status: "وضعیت",
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col relative">
      <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 relative mt-4">
        <aside className="hidden md:flex mt-3 w-64 z-30 border-t-[3px] border-r-[3px] border-[#055B5C] rounded-tr-[75px]">
          <AdminSidebar />
        </aside>

        <motion.aside
          initial={{ x: "-100%" }}
          animate={{ x: sidebarOpen ? 0 : "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
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

          {showAlert && (
            <div className="text-[#FF6347] bg-red-50 border border-[#FF6347] rounded px-4 py-2 text-sm mb-4 text-center">
              لطفاً تمام فیلدهای ضروری را پر کنید
            </div>
          )}

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
                        className={`${
                          p.status === "باطل‌شده"
                            ? "bg-gray-300 text-gray-500 line-through"
                            : "bg-[#EAF4EF] hover:bg-[#D1E7D8]"
                        } border-b`}
                      >
                        <td className="p-2">{p.name}</td>
                        <td className="p-2">{p.courseType}</td>
                        <td className="p-2">{p.sessions}</td>
                        <td className="p-2">{p.date || "-"}</td>
                        <td className="p-2">{p.amount} ریال</td>
                        <td className="p-2">{p.method || "-"}</td>
                        <td className="p-2">{p.status || "-"}</td>
                        <td className="p-2 flex justify-center gap-1">
                          {p.method === "درگاه اینترنتی" ? (
                            <span className="text-gray-400 text-xs">
                              غیرقابل ویرایش
                            </span>
                          ) : (
                            <>
                              <button
                                className="text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                onClick={() => handleInvalidate(p.id)}
                              >
                                باطل کردن
                              </button>
                            </>
                          )}
                        </td>
                      </motion.tr>
                    ))}

                    {/* Add/Edit Row */}
                    <tr className="bg-[#EAF4EF]">
                      {[
                        "name",
                        "courseType",
                        "sessions",
                        "date",
                        "amount",
                        "method",
                      ].map((key) => (
                        <td key={key} className="p-2">
                          {key === "name" ? (
                            <select
                              className="w-full px-2 py-1 border rounded text-xs text-right"
                              value={newPayment.name}
                              onChange={(e) =>
                                setNewPayment({
                                  ...newPayment,
                                  name: e.target.value,
                                })
                              }
                            >
                              <option value="">انتخاب عضو</option>
                              {userOptions.map((u) => (
                                <option
                                  key={u.id}
                                  value={`${u.name} ${u.lastName}`}
                                >
                                  {u.name} {u.lastName}
                                </option>
                              ))}
                            </select>
                          ) : key === "courseType" ? (
                            <select
                              className="w-full px-2 py-1 border rounded text-xs text-right"
                              value={newPayment.courseType}
                              onChange={(e) =>
                                setNewPayment({
                                  ...newPayment,
                                  courseType: e.target.value,
                                })
                              }
                            >
                              <option value="">نوع دوره</option>
                              <option value="عمومی">عمومی</option>
                              <option value="خصوصی">خصوصی</option>
                              <option value="VIP">VIP</option>
                            </select>
                          ) : key === "sessions" ? (
                            <input
                              type="number"
                              min="1"
                              className="w-full px-2 py-1 border rounded text-xs text-right"
                              placeholder="تعداد جلسات"
                              value={newPayment.sessions}
                              onChange={(e) =>
                                setNewPayment({
                                  ...newPayment,
                                  sessions: e.target.value,
                                })
                              }
                            />
                          ) : key === "date" ? (
                            <DatePicker
                              calendar={persian}
                              locale={persian_fa}
                              inputClass="w-full px-2 py-1 border rounded text-xs text-right"
                              value={newPayment.date}
                              onChange={(dateObject) =>
                                setNewPayment({
                                  ...newPayment,
                                  date: dateObject?.format("YYYY/MM/DD") || "",
                                })
                              }
                              calendarPosition="bottom-right"
                              placeholder="تاریخ خرید"
                            />
                          ) : key === "amount" ? (
                            <input
                              type="number"
                              min="0"
                              className="w-full px-2 py-1 border rounded text-xs text-right"
                              placeholder="مبلغ به ریال"
                              value={newPayment.amount}
                              onChange={(e) =>
                                setNewPayment({
                                  ...newPayment,
                                  amount: e.target.value,
                                })
                              }
                            />
                          ) : key === "method" ? (
                            <select
                              className="w-full px-2 py-1 border rounded text-xs text-right"
                              value={newPayment.method}
                              onChange={(e) =>
                                setNewPayment({
                                  ...newPayment,
                                  method: e.target.value,
                                })
                              }
                            >
                              <option value="">روش پرداخت</option>
                              <option value="کارتخوان">کارتخوان</option>
                              <option value="نقدی">نقدی</option>
                            </select>
                          ) : (
                            <input
                              type="text"
                              className="w-full px-2 py-1 border rounded text-xs text-right"
                              placeholder={placeholders[key] || ""}
                              value={newPayment[key]}
                              onChange={(e) =>
                                setNewPayment({
                                  ...newPayment,
                                  [key]: e.target.value,
                                })
                              }
                            />
                          )}
                        </td>
                      ))}
                      <td className="p-2">
                        <button
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 cursor-pointer"
                          onClick={editId ? handleUpdate : handleAdd}
                        >
                          {editId ? "ذخیره" : "افزودن"}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="items-center">
                      <td className="px-1 py-2 font-bold text-center">
                        جمع کل:
                      </td>
                      <td className="px-1 py-2 font-bold text-green-700 text-center">
                        {payments
                          .filter((p) => p.status !== "باطل‌شده")
                          .reduce((sum, p) => sum + Number(p.amount), 0)}{" "}
                        تومان
                      </td>
                    </tr>
                  </tfoot>
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
                    className={`bg-[#EAF4EF] p-3 rounded-xl shadow text-sm text-[#055B5C] ${
                      p.status === "باطل‌شده"
                        ? "line-through text-gray-500"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col gap-1 mb-3">
                      <div className="flex justify-between">
                        <span className="font-bold">نام:</span>
                        <span>{p.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">نوع دوره:</span>
                        <span>{p.courseType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">تعداد جلسات:</span>
                        <span>{p.sessions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">تاریخ خرید:</span>
                        <span>{p.date || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">مبلغ:</span>
                        <span>{p.amount}</span>
                      </div>
                      <div className="flex justify-between mb-3">
                        <span className="font-bold">وضعیت:</span>
                        <span>{p.status || "-"}</span>
                      </div>

                      <div className="flex justify-between gap-2">
                        {p.status !== "باطل‌شده" && (
                          <button
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition cursor-pointer w-full sm:w-auto"
                            onClick={() => handleInvalidate(p.id)}
                          >
                            باطل کردن
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* فرم افزودن یا ویرایش */}
                <div className="bg-[#D1E7D8] p-3 rounded-xl shadow text-sm">
                  {[
                    "name",
                    "courseType",
                    "sessions",
                    "date",
                    "amount",
                    "method",
                  ].map((key) => (
                    <div key={key} className="mb-2">
                      {key === "name" ? (
                        <select
                          className="w-full px-2 py-1 border rounded text-xs text-right"
                          value={newPayment.name}
                          onChange={(e) =>
                            setNewPayment({
                              ...newPayment,
                              name: e.target.value,
                            })
                          }
                        >
                          <option value="">انتخاب عضو</option>
                          {userOptions.map((u) => (
                            <option
                              key={u.id}
                              value={`${u.name} ${u.lastName}`}
                            >
                              {u.name} {u.lastName}
                            </option>
                          ))}
                        </select>
                      ) : key === "courseType" ? (
                        <select
                          className="w-full px-2 py-1 border rounded text-xs text-right"
                          value={newPayment.courseType}
                          onChange={(e) =>
                            setNewPayment({
                              ...newPayment,
                              courseType: e.target.value,
                            })
                          }
                        >
                          <option value="">نوع دوره</option>
                          <option value="عمومی">عمومی</option>
                          <option value="خصوصی">خصوصی</option>
                          <option value="VIP">VIP</option>
                        </select>
                      ) : key === "sessions" ? (
                        <input
                          type="number"
                          min="1"
                          className="w-full px-2 py-1 border rounded text-xs text-right"
                          placeholder="تعداد جلسات"
                          value={newPayment.sessions}
                          onChange={(e) =>
                            setNewPayment({
                              ...newPayment,
                              sessions: e.target.value,
                            })
                          }
                        />
                      ) : key === "date" ? (
                        <DatePicker
                          calendar={persian}
                          locale={persian_fa}
                          inputClass="w-full px-2 py-1 border rounded text-xs text-right"
                          placeholder="تاریخ خرید"
                          value={newPayment.date}
                          onChange={(date) =>
                            setNewPayment({
                              ...newPayment,
                              date: date?.format("YYYY/MM/DD") || "",
                            })
                          }
                        />
                      ) : key === "amount" ? (
                        <input
                          type="number"
                          min="0"
                          className="w-full px-2 py-1 border rounded text-xs text-right"
                          placeholder="مبلغ به ریال"
                          value={newPayment.amount}
                          onChange={(e) =>
                            setNewPayment({
                              ...newPayment,
                              amount: e.target.value,
                            })
                          }
                        />
                      ) : key === "method" ? (
                        <select
                          className="w-full px-2 py-1 border rounded text-xs text-right"
                          value={newPayment.method}
                          onChange={(e) =>
                            setNewPayment({
                              ...newPayment,
                              method: e.target.value,
                            })
                          }
                        >
                          <option value="">روش پرداخت</option>
                          <option value="کارتخوان">کارتخوان</option>
                          <option value="نقدی">نقدی</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          className="w-full px-2 py-1 border rounded text-xs text-right"
                          placeholder={placeholders[key] || ""}
                          value={newPayment[key]}
                          onChange={(e) =>
                            setNewPayment({
                              ...newPayment,
                              [key]: e.target.value,
                            })
                          }
                        />
                      )}
                    </div>
                  ))}

                  <div className="text-left">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 cursor-pointer"
                      onClick={editId ? handleUpdate : handleAdd}
                    >
                      {editId ? "ذخیره" : "افزودن"}
                    </button>
                  </div>
                </div>

                <div className="bg-white text-sm text-right font-bold text-[#055B5C] px-3 py-2 border-t border-[#9FC6C3] rounded-md shadow">
                  جمع کل پرداخت‌ها:{" "}
                  <span className="text-green-700">
                    {payments
                      .filter((p) => p.status !== "باطل‌شده")
                      .reduce((sum, p) => sum + Number(p.amount), 0)}{" "}
                    تومان
                  </span>
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