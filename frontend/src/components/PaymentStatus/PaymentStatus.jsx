import React, { useState, useEffect, useMemo } from "react";
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
import { motion } from "framer-motion";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { purchaseApi } from "../../lib/purchase";
import { api } from "../../lib/api";
import { purchaseFromServer, METHOD_MAP, toYMD } from "../../lib/helpers";

const METHOD_LABELS = { CASH: "نقدی", CARD: "کارتخوان", POS: "کارتخوان", GATEWAY: "درگاه" };
const planTypeFromName = (name = "") => {
  const base = String(name).replace(/\d+/g, "").trim();
  const n = base.toLowerCase();
  if (/vip/.test(n) || /وی.?آی.?پی/.test(base)) return "VIP";
  if (/خصوص/.test(base) || /private/.test(n)) return "خصوصی";
  if (/عموم/.test(base) || /general/.test(n)) return "عمومی";
  return base || "پلن";
};

const faNum = (v) => new Intl.NumberFormat("fa-IR").format(Number(v || 0));

const planLabel = (pl) => {
  const type = planTypeFromName(pl?.name);
  const sc = faNum(pl?.session_count ?? 0);
  return `${sc} جلسه | ${type}`;
};


const fa2en = (s) =>
  String(s ?? "")
    .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));

const CANCELED_KEY = "paymentCanceledIds";
const loadCanceledIds = () => {
  try { return JSON.parse(localStorage.getItem(CANCELED_KEY) || "[]"); }
  catch { return []; }
};
const saveCanceledIds = (arr) => {
  try { localStorage.setItem(CANCELED_KEY, JSON.stringify(arr)); } catch { }
};



const isCanceled = (s) => /cancel/i.test(s || "") || s === "باطل‌شده";

const PaymentStatus = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem("usersList");
    try { return saved ? JSON.parse(saved) : []; } catch { return []; }
  });

  const [plans, setPlans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [canceledLocal, setCanceledLocal] = useState(loadCanceledIds);

  const [newPayment, setNewPayment] = useState({
    memberId: "",
    planId: "",
    sessions: "",
    amount: "",
    method: "",
    date: "", 
  });
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [{ data: plansData }, { data: membersData }] = await Promise.all([
          api("/api/v1/plan/all-plans"),
          api("/api/v1/members/"),
        ]);

        const plansArr = Array.isArray(plansData) ? plansData : [];
        setPlans(plansArr);

        const normalizedMembers = (Array.isArray(membersData) ? membersData : []).map((m) => {
          const parts = (m.full_name || "").trim().split(/\s+/);
          return { id: m.id, name: parts[0] || "", lastName: parts.slice(1).join(" ") || "" };
        });
        if (normalizedMembers.length) setMembers(normalizedMembers);

        const { data } = await purchaseApi.listAll();
        const base = (Array.isArray(data) ? data : []).map((p) =>
          purchaseFromServer(p, normalizedMembers, plansArr)
        );
        const merged = base.map((p) =>
          canceledLocal.includes(p.id) ? { ...p, status: "Canceled (local)" } : p
        );
        setPayments(merged);
      } catch {
        toast.error("خطا در دریافت داده‌ها");
      }
    })();
  }, []);

  useEffect(() => {
    setPayments((prev) =>
      prev
        .map((p) =>
          purchaseFromServer(
            {
              id: p.id,
              member_id: p.memberId,
              plan_id: p.planId,
              session_count: p.sessions,
              amount: p.amount,
              payment_method: p.method,
              paid_at: p.paidAt || null,
              status: p.status,
            },
            members,
            plans
          )
        )
        .map((p) => (canceledLocal.includes(p.id) ? { ...p, status: "Canceled (local)" } : p))
    );
  }, [members, plans, canceledLocal]);

  const onPlanChange = (planId) => {
    setNewPayment((s) => {
      const plan = plans.find((p) => p.id === planId);
      return {
        ...s,
        planId,
        sessions: plan ? String(plan.session_count ?? "") : s.sessions,
        amount: plan ? String(plan.price ?? "") : s.amount,
      };
    });
  };

  const resetForm = () => {
    setNewPayment({
      memberId: "",
      planId: "",
      sessions: "",
      amount: "",
      method: "",
      date: "",
    });
    setShowAlert(false);
  };

  const handleAdd = async () => {
    const { memberId, planId, sessions, amount, method, date } = newPayment;

    const sessionsNum = Number(fa2en(sessions));
    const amountNum = Number(fa2en(amount));
    if (!memberId || !planId || !sessionsNum || !amountNum || !method) {
      setShowAlert(true);
      return;
    }
    setShowAlert(false);

    const paid_at =
      date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : toYMD(new Date());

    try {
      const payload = {
        member_id: memberId,
        plan_id: planId,
        session_count: sessionsNum,
        amount: amountNum,
        payment_method: METHOD_MAP[method] ?? method,
        paid_at, 
      };

      const { data } = await purchaseApi.createManual(payload);
      const ui = purchaseFromServer(data, members, plans);
      setPayments((list) => [ui, ...list]);
      toast.success("پرداخت با موفقیت ثبت شد");
      resetForm();
    } catch (e) {
      toast.error(`خطا در ثبت پرداخت: ${e instanceof Error ? e.message : "نامشخص"}`);
    }
  };

  const cancelLocally = (id) => {
    setCanceledLocal((prev) => {
      const next = Array.from(new Set([...prev, id]));
      saveCanceledIds(next);
      return next;
    });
    setPayments((list) => list.map((p) => (p.id === id ? { ...p, status: "Canceled (local)" } : p)));
  };

  const tryCancelOnServer = async (id) => {
    try { return await purchaseApi.updateManual(id, { status: "Cancelled" }); } catch { }
    try { return await purchaseApi.updateManual(id, { status: "Canceled" }); } catch { }
    try { return await purchaseApi.hardDelete(id); } catch (e) { throw e; }
  };

  const handleInvalidate = async (id) => {
    try {
      const { status } = await tryCancelOnServer(id);
      cancelLocally(id);
      if ([200, 204].includes(status)) toast.success("پرداخت با موفقیت باطل شد");
      else toast.warn(`لغو در سرور با status=${status}، اما در UI باطل شد`);
    } catch {
      cancelLocally(id);
      toast.error("سرور خطا داد؛ پرداخت به‌صورت محلی باطل شد");
    }
  };

  const filtered = useMemo(() => {
    return payments
      .map((p) => (canceledLocal.includes(p.id) ? { ...p, status: "Canceled (local)" } : p))
      .filter((p) => (p.memberName || "").toLowerCase().includes(search.toLowerCase()));
  }, [payments, search, canceledLocal]);

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const total = filtered
    .filter((p) => !isCanceled(p.status))
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);


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
          className={`flex-1 p-4 md:p-8 relative z-10 border-t-[3px] border-l-[3px] border-[#FF7A00] rounded-tl-[75px] bg-white flex flex-col gap-6 text-right mt-3 ml-10 md:ml-10 ${sidebarOpen ? 'pointer-events-none select-none' : ''}`}
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
                      <th className="p-2">پلن</th>
                      <th className="p-2">تعداد جلسات</th>
                      <th className="p-2">تاریخ پرداخت</th>
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
                        className={
                          isCanceled(p.status)
                            ? "bg-gray-200 text-gray-500 line-through"
                            : "bg-[#EAF4EF] hover:bg-[#D1E7D8]"
                        }
                      >
                        <td className="p-2">{p.memberName}</td>
                        <td className="p-2">{p.planName}</td>
                        <td className="p-2">{p.sessions}</td>
                        <td className="p-2">{p.paidAt ? p.paidAt.slice(0, 10) : "-"}</td>
                        <td className="p-2">{Number(p.amount || 0).toLocaleString()}</td>
                        <td className="p-2">{METHOD_LABELS[p.method] || p.method || "-"}</td>
                        <td className="p-2">{p.status || "-"}</td>
                        <td className="p-2">
                          {!isCanceled(p.status) && (
                            <button
                              className="text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                              onClick={() => handleInvalidate(p.id)}
                            >
                              باطل کردن
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    ))}

                    <tr className="bg-[#EAF4EF]">
                      <td className="p-2">
                        <select
                          className="w-full px-2 py-1 border rounded text-xs text-right"
                          value={newPayment.memberId}
                          onChange={(e) => setNewPayment({ ...newPayment, memberId: e.target.value })}
                        >
                          <option value="">انتخاب عضو</option>
                          {members.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name} {u.lastName}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2">
                        <select
                          className="w-full px-2 py-1 border rounded text-xs text-right"
                          value={newPayment.planId}
                          onChange={(e) => onPlanChange(e.target.value)}
                          title="عدد = تعداد جلسه"
                        >
                          <option value="">انتخاب پلن (تعداد جلسه نمایش داده می‌شود)</option>
                          {plans.map((pl) => (
                            <option key={pl.id} value={pl.id}>
                              {planLabel(pl)}
                            </option>
                          ))}
                        </select>


                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="1"
                          className="w-full px-2 py-1 border rounded text-xs text-right"
                          placeholder="تعداد جلسات"
                          value={newPayment.sessions}
                          onChange={(e) => setNewPayment({ ...newPayment, sessions: e.target.value })}
                        />
                      </td>
                      <td className="p-2">
                        <DatePicker
                          calendar={persian}
                          locale={persian_fa}
                          inputClass="w-full px-2 py-1 border rounded text-xs text-right"
                          value={newPayment.date}
                          onChange={(d) =>
                            setNewPayment({ ...newPayment, date: d?.format("YYYY-MM-DD") || "" })
                          }
                          calendarPosition="bottom-right"
                          placeholder="تاریخ (اختیاری)"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="0"
                          className="w-full px-2 py-1 border rounded text-xs text-right"
                          placeholder="مبلغ (ریال)"
                          value={newPayment.amount}
                          onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                        />
                      </td>
                      <td className="p-2">
                        <select
                          className="w-full px-2 py-1 border rounded text-xs text-right"
                          value={newPayment.method}
                          onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
                        >
                          <option value="">روش پرداخت</option>
                          <option value="کارتخوان">کارتخوان</option>
                          <option value="نقدی">نقدی</option>
                        </select>
                      </td>
                      <td className="p-2">—</td>
                      <td className="p-2">
                        <button
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 cursor-pointer"
                          onClick={handleAdd}
                        >
                          افزودن
                        </button>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={8} className="px-1 py-2 font-bold text-center">
                        جمع کل (غیر باطل):{" "}
                        <span className="text-green-700">{total.toLocaleString()} ریال</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="md:hidden mt-4 text-sm text-[#055B5C]">

                <div className="rounded-xl p-3 mb-3 shadow bg-[#D1E7D8]">
                  <div className="grid grid-cols-1 gap-2">
                    <select
                      className={`w-full px-2 py-2 border rounded text-xs text-right ${showAlert && !newPayment.memberId ? 'border-red-400' : ''}`}
                      value={newPayment.memberId}
                      onChange={(e) => setNewPayment({ ...newPayment, memberId: e.target.value })}
                    >
                      <option value="">انتخاب عضو</option>
                      {members.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} {u.lastName}
                        </option>
                      ))}
                    </select>

                    <select
                      className={`w-full px-2 py-2 border rounded text-xs text-right ${showAlert && !newPayment.planId ? 'border-red-400' : ''}`}
                      value={newPayment.planId}
                      onChange={(e) => onPlanChange(e.target.value)}
                      title="عدد نمایش‌داده‌شده = تعداد جلسه"
                    >
                      <option value="">انتخاب پلن (تعداد جلسه نمایش داده می‌شود)</option>
                      {plans.map((pl) => (
                        <option key={pl.id} value={pl.id}>
                          {planLabel(pl)}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min="1"
                      className={`w-full px-2 py-2 border rounded text-xs text-right ${showAlert && !newPayment.sessions ? 'border-red-400' : ''}`}
                      placeholder="تعداد جلسات"
                      value={newPayment.sessions}
                      onChange={(e) => setNewPayment({ ...newPayment, sessions: e.target.value })}
                    />

                    <DatePicker
                      calendar={persian}
                      locale={persian_fa}
                      inputClass="w-full px-2 py-2 border rounded text-xs text-right"
                      value={newPayment.date}
                      onChange={(d) =>
                        setNewPayment({ ...newPayment, date: d?.format("YYYY-MM-DD") || "" })
                      }
                      calendarPosition="bottom-right"
                      placeholder="تاریخ (اختیاری)"
                    />

                    <input
                      type="number"
                      min="0"
                      className={`w-full px-2 py-2 border rounded text-xs text-right ${showAlert && !newPayment.amount ? 'border-red-400' : ''}`}
                      placeholder="مبلغ (ریال)"
                      value={newPayment.amount}
                      onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                    />

                    <select
                      className={`w-full px-2 py-2 border rounded text-xs text-right ${showAlert && !newPayment.method ? 'border-red-400' : ''}`}
                      value={newPayment.method}
                      onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
                    >
                      <option value="">روش پرداخت</option>
                      <option value="کارتخوان">کارتخوان</option>
                      <option value="نقدی">نقدی</option>
                    </select>

                    <div className="flex items-center gap-2">
                      <button
                        className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-xs hover:bg-green-700 cursor-pointer"
                        onClick={handleAdd}
                      >
                        افزودن
                      </button>
                      <button
                        className="px-3 py-2 rounded text-xs bg-gray-200 hover:bg-gray-300"
                        onClick={resetForm}
                      >
                        لغو
                      </button>
                    </div>
                  </div>
                </div>

                {filtered.map((p) => (
                  <div
                    key={p.id}
                    className={
                      "rounded-xl p-3 mb-3 shadow " +
                      (isCanceled(p.status) ? "bg-gray-200 text-gray-500 line-through" : "bg-[#EAF4EF]")
                    }
                  >
                    <div className="flex justify-between mb-1"><b>نام:</b><span>{p.memberName}</span></div>
                    <div className="flex justify-between mb-1"><b>پلن:</b><span>{p.planName}</span></div>
                    <div className="flex justify-between mb-1"><b>جلسات:</b><span>{p.sessions}</span></div>
                    <div className="flex justify-between mb-1"><b>تاریخ:</b><span>{p.paidAt?.slice(0, 10) || "-"}</span></div>
                    <div className="flex justify-between mb-1"><b>مبلغ:</b><span>{Number(p.amount || 0).toLocaleString()}</span></div>
                    <div className="flex justify-between mb-2"><b>روش:</b><span>{METHOD_LABELS[p.method] || p.method || "-"}</span></div>
                    {!isCanceled(p.status) && (
                      <button
                        className="w-full bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                        onClick={() => handleInvalidate(p.id)}
                      >
                        باطل کردن
                      </button>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </motion.div>
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default PaymentStatus;
