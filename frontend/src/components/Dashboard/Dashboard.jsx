import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import AdminSidebar from "../AdminSidebar";
import AdminHeader from "../AdminHeader";
import { api } from "../../lib/api";

import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";

const FA_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];

const detectType = (name = "") => {
  const n = String(name).toLowerCase();
  if (/vip/.test(n) || /وی.?آی.?پی/.test(name)) return "VIP";
  if (/خصوص/.test(name) || /private/.test(n)) return "خصوصی";
  if (/عموم/.test(name) || /general/.test(n)) return "عمومی";
  return "سایر";
};

const FA_WEEKDAYS = ["شنبه","یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنج‌شنبه","جمعه"];

function normalizeWeeklyAttendanceFromAPI(data) {
  const arr = Array.isArray(data) ? data : [];

  const out = arr.map((x, i) => {
    const dayRaw = x.day || x.weekday || x.label || x.date || FA_WEEKDAYS[i % 7];
    const valRaw = x.attendance ?? x.count ?? x.users ?? x.value ?? 0;

    let day = String(dayRaw).trim();
    const mapAlt = {
      "sat":"شنبه","saturday":"شنبه",
      "sun":"یکشنبه","sunday":"یکشنبه",
      "mon":"دوشنبه","monday":"دوشنبه",
      "tue":"سه‌شنبه","tuesday":"سه‌شنبه",
      "wed":"چهارشنبه","wednesday":"چهارشنبه",
      "thu":"پنج‌شنبه","thursday":"پنج‌شنبه",
      "fri":"جمعه","friday":"جمعه",
    };
    const key = day.toLowerCase();
    if (mapAlt[key]) day = mapAlt[key];

    return { day, attendance: Number(valRaw) || 0 };
  });

  const order = Object.fromEntries(FA_WEEKDAYS.map((d, idx) => [d, idx]));
  out.sort((a, b) => (order[a.day] ?? 99) - (order[b.day] ?? 99));

  const merged = [];
  const seen = new Map();
  for (const r of out) {
    if (!FA_WEEKDAYS.includes(r.day)) continue;
    const prev = seen.get(r.day) ?? 0;
    seen.set(r.day, prev + (Number.isFinite(r.attendance) ? r.attendance : 0));
  }
  for (const d of FA_WEEKDAYS) {
    if (seen.has(d)) merged.push({ day: d, attendance: seen.get(d) });
  }
  return merged;
}


function normalizeGrowthFromAPI(data) {
  const arr = Array.isArray(data) ? data : [];
  const out = arr.map((x, i) => {
    const monthRaw =
      x.month ?? x.month_num ?? x.monthNumber ?? x.date ?? x.label ?? (i + 1);
    const valueRaw =
      x.users ?? x.count ?? x.member_count ?? x.total ?? x.value ?? 0;

    let monthIndex = NaN;
    if (typeof monthRaw === "number") monthIndex = monthRaw;
    if (Number.isNaN(monthIndex) && typeof monthRaw === "string") {
      const m = parseInt(monthRaw.split(/[-/]/)[1], 10);
      if (!Number.isNaN(m)) monthIndex = m;
    }

    let monthLabel;
    if (!Number.isNaN(monthIndex) && monthIndex >= 1 && monthIndex <= 12) {
      monthLabel = FA_MONTHS[monthIndex - 1];
    } else if (typeof monthRaw === "string" && monthRaw.trim()) {
      monthLabel = monthRaw;
    } else {
      monthLabel = `M${i + 1}`;
    }

    return {
      monthIndex: !Number.isNaN(monthIndex) ? monthIndex : i + 1,
      month: monthLabel,
      users: Number(valueRaw),
    };
  });

  out.sort((a, b) => a.monthIndex - b.monthIndex);

  const sum = out.reduce((s, r) => s + (Number.isFinite(r.users) ? r.users : 0), 0);
  return sum > 0 ? out.map(({ month, users }) => ({ month, users })) : [];
}

function buildGrowthFromMembers(members) {
  const currentJalaliYear = new DateObject({ calendar: persian }).year;
  const countsByMonth = Array(13).fill(0); 

  const candidates = [
    "created_at", "createdAt", "joined_at", "joinedAt",
    "registration_date", "registrationDate", "registered_at", "registeredAt",
    "created", "date", "created_on", "createdOn"
  ];

  for (const m of Array.isArray(members) ? members : []) {
    let ts = null;
    for (const key of candidates) {
      if (m && m[key]) { ts = m[key]; break; }
    }
    if (!ts) continue;

    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) continue;

    const p = new DateObject({ date: d, calendar: persian });
    if (p.year !== currentJalaliYear) continue;

    const monthNum = p.month?.number ?? 0;
    if (monthNum >= 1 && monthNum <= 12) countsByMonth[monthNum] += 1;
  }

  return Array.from({ length: 12 }, (_, i) => ({
    month: FA_MONTHS[i],
    users: countsByMonth[i + 1] || 0,
  }));
}

function Dashboard() {
  const [stats, setStats] = useState({
    activeUsers: 0,
    monthlyRevenue: 0,
    activeCoaches: 1,
  });

  const [growthData, setGrowthData] = useState(
    FA_MONTHS.slice(0, 5).map(m => ({ month: m, users: 0 }))
  );

  const [courseTypeStats, setCourseTypeStats] = useState([
    { title: "عمومی", count: 0 },
    { title: "خصوصی", count: 0 },
    { title: "VIP", count: 0 },
  ]);

const [attendanceData, setAttendanceData] = useState([]);




  useEffect(() => {
    (async () => {
      let membersForGrowth = [];
      try {
        const { data: membersList } = await api("/api/v1/members/");
        membersForGrowth = Array.isArray(membersList) ? membersList : [];
        const activeCount = membersForGrowth.length; 
        setStats(s => ({ ...s, activeUsers: activeCount }));
      } catch { }

      try {
        const { data } = await api("/api/v1/admins/revenue-this-month");
        setStats(s => ({ ...s, monthlyRevenue: Number(data || 0) }));
      } catch { }

      let chart = [];
      try {
        const { data } = await api("/api/v1/admins/member-growth");
        chart = normalizeGrowthFromAPI(data);
      } catch { }

      if (!chart.length) {
        try {
          const source = membersForGrowth.length
            ? membersForGrowth
            : (await api("/api/v1/members/")).data;
          chart = buildGrowthFromMembers(source);
        } catch {
          chart = [];
        }
      }
      if (chart.length) setGrowthData(chart);

      try {
        const [plansRes, purchasesRes] = await Promise.all([
          api("/api/v1/plan/all-plans"),
          api("/api/v1/purchase/purchase-table"),
        ]);

        const plans = Array.isArray(plansRes.data) ? plansRes.data : [];
        const purchases = Array.isArray(purchasesRes.data) ? purchasesRes.data : [];
        const planNameById = Object.fromEntries(plans.map(p => [p.id, p.name || ""]));

        const counts = { "عمومی": 0, "خصوصی": 0, "VIP": 0, "سایر": 0 };
        for (const pur of purchases) {
          const status = String(pur.status || "").toLowerCase();
          if (status !== "paid") continue;
          const type = detectType(planNameById[pur.plan_id] || "");
          counts[type] = (counts[type] ?? 0) + 1;
        }
        setCourseTypeStats([
          { title: "عمومی", count: counts["عمومی"] },
          { title: "خصوصی", count: counts["خصوصی"] },
          { title: "VIP", count: counts["VIP"] },
        ]);
      } catch {
        setCourseTypeStats([
          { title: "عمومی", count: 0 },
          { title: "خصوصی", count: 0 },
          { title: "VIP", count: 0 },
        ]);
      }
    })();
  }, []);


  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          className={`flex-1 p-8 md:p-10 relative z-10 overflow-y-auto border-t-[3px] border-l-[3px] border-[#FF7A00] rounded-tl-[75px] bg-white flex flex-col gap-6 text-right mt-3 ml-10 ${sidebarOpen ? "pointer-events-none select-none" : ""
            }`}
        >
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            {[
              { label: "تعداد کاربران فعال", value: stats.activeUsers.toLocaleString("fa-IR") }, 
              { label: "درآمد این ماه", value: stats.monthlyRevenue.toLocaleString("fa-IR") },
              { label: "تعداد مربیان فعال", value: stats.activeCoaches },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-[#EAF4EF] rounded-xl shadow p-5 flex flex-col items-center justify-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
              >
                <p className="text-orange-600 font-bold text-sm mb-1">{item.label}</p>
                <p className="text-2xl font-extrabold text-[#055B5C]">{item.value}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="bg-[#EAF4EF] rounded-xl shadow p-6"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.8 }}
          >
            <p className="text-orange-600 font-bold text-sm mb-3 text-center">
              انواع دوره‌ها
            </p>
            <div className="flex flex-wrap items-stretch justify-around gap-4 text-[#055B5C] font-bold">
              {courseTypeStats.map((c, i) => (
                <motion.div
                  key={`${c.title}-${i}`}
                  className="text-center min-w-[120px]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + i * 0.15, duration: 0.4 }}
                >
                  <p className="mb-1">{c.title}</p>
                  <p dir="rtl">{Number(c.count).toLocaleString("fa-IR")} خرید</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              className="bg-[#EAF4EF] rounded-xl shadow p-6 h-[220px]"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: 1.5 }}
            >
              <p className="text-orange-600 font-bold text-sm mb-3 text-center">
                نمودار رشد کاربران (واحد: نفر)
              </p>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#FF7A00" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              className="bg-[#EAF4EF] rounded-xl shadow p-6 h-[220px]"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: 1.7 }}
            >
              <p className="text-orange-600 font-bold text-sm mb-3 text-center">
                نمودار حضور هفتگی (واحد: نفر)
              </p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="attendance" fill="#FF7A00" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
