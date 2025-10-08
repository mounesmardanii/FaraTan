import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminHeader from '../AdminHeader';
import AdminSidebar from '../AdminSidebar';
import { assets } from '../../assets/assets';
import UserTable from './UserTable';
import { api } from '../../lib/api';
import { fromServer, toServer } from '../../lib/helpers';

const PLAN_META_KEY = 'memberPlanMeta';
const loadMeta = () => {
  try {
    const m = JSON.parse(localStorage.getItem(PLAN_META_KEY) || '{}');
    return m && typeof m === 'object' ? m : {};
  } catch { return {}; }
};
const saveMeta = (m) => { try { localStorage.setItem(PLAN_META_KEY, JSON.stringify(m)); } catch { } };

function AdminUsers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [addingNew, setAddingNew] = useState(false);

  const [formData, setFormData] = useState({
    name: '', lastName: '', phone: '', birthDate: '',
    medicalCondition: '', sportGoal: '',
    courseType: 'عمومی', sessionCount: '',
    avatar: assets.woman4,
  });

  const [planMeta, setPlanMeta] = useState(loadMeta);

  const [plans, setPlans] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api('/api/v1/plan/all-plans');
        setPlans(Array.isArray(data) ? data : []);
      } catch (e) { console.warn('خطا در دریافت پلن‌ها:', e); }
    })();
  }, []);
  const normalizeType = (name = '') => {
    const n = String(name).trim().replace(/\s*\d+\s*$/, ''); 
    if (/vip/i.test(n) || /وی.?آی.?پی/.test(n)) return 'VIP';
    if (/خصوص/.test(n)) return 'خصوصی';
    if (/عموم/.test(n)) return 'عمومی';
    return n || 'عمومی';
  };


  const courseTypes = useMemo(() => {
    const types = new Set();
    for (const p of plans) types.add(normalizeType(p?.name || ''));
    const order = ['VIP', 'خصوصی', 'عمومی'];
    return [...types].filter(Boolean)
      .sort((a, b) => (order.indexOf(a) + 999) - (order.indexOf(b) + 999));
  }, [plans]);

  const sessionOptions = useMemo(() => {
    const counts = new Set();
    for (const p of plans) {
      if (normalizeType(p?.name || '') === formData.courseType) {
        counts.add(Number(p.session_count));
      }
    }
    return [...counts]
      .filter((n) => Number.isFinite(n))
      .sort((a, b) => a - b)
      .map((n) => ({ value: String(n), label: `${n} جلسه` }));
  }, [plans, formData.courseType]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api('/api/v1/members/');
        const base = (Array.isArray(data) ? data : []).map(fromServer);
        const merged = base.map(u => ({ ...u, ...(planMeta[u.id] || {}) }));
        setUsers(merged);
        localStorage.setItem('usersList', JSON.stringify(merged));
      } catch (e) {
        toast.error(`خطا در دریافت کاربران: ${e instanceof Error ? e.message : e}`);
        const saved = JSON.parse(localStorage.getItem('usersList') || '[]');
        if (saved.length) setUsers(saved);
      }
    })();
  }, []); 


  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      (user.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, users]);

  const resetForm = () => {
    setEditIndex(null);
    setAddingNew(false);
    setFormData({
      name: '', lastName: '', phone: '', birthDate: '',
      medicalCondition: '', sportGoal: '',
      courseType: courseTypes[0] || 'عمومی',
      sessionCount: '',
      avatar: assets.woman4,
    });
  };

  const isUuid = (v) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(v || ''));

  const handleEdit = (user) => {
    const meta = planMeta[user.id] || {};
    setEditIndex(user.id);
    setFormData(prev => ({
      ...prev, ...user,
      courseType: meta.courseType || user.courseType || courseTypes[0] || 'عمومی',
      sessionCount: meta.sessionCount || user.sessionCount || '',
    }));
  };

  const handleSaveEdit = async () => {
    if (!formData?.id || !isUuid(formData.id)) { toast.error('شناسه‌ی نامعتبر است.'); return; }
    if (!formData.name?.trim() || !formData.phone?.trim()) { toast.error('نام و شماره تلفن اجباری است'); return; }

    try {
      const payload = toServer(formData);
      const { data } = await api(`/api/v1/members/update-info/${formData.id}`, {
        method: 'PUT', body: JSON.stringify(payload),
      });

      const meta = {
        ...planMeta,
        [formData.id]: { courseType: formData.courseType, sessionCount: formData.sessionCount },
      };
      setPlanMeta(meta); saveMeta(meta);

      const ui = { ...fromServer(data), ...meta[formData.id] };
      const updated = users.map(u => u.id === ui.id ? ui : u);
      setUsers(updated);
      localStorage.setItem('usersList', JSON.stringify(updated));

      resetForm();
      toast.success('کاربر با موفقیت به‌روزرسانی شد');
    } catch (e) {
      toast.error(`خطا در به‌روزرسانی کاربر: ${e instanceof Error ? e.message : e}`);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!isUuid(id)) { toast.error('شناسه‌ی نامعتبر است.'); return; }
    try {
      const { status } = await api(`/api/v1/members/members/${id}`, { method: 'DELETE' });
      if (status === 200 || status === 204) {
        const updated = users.filter(u => u.id !== id);
        setUsers(updated);
        localStorage.setItem('usersList', JSON.stringify(updated));
        const next = { ...planMeta }; delete next[id]; setPlanMeta(next); saveMeta(next);
        resetForm();
        toast.success('کاربر با موفقیت حذف شد');
      } else {
        toast.error(`حذف ناموفق (status ${status})`);
      }
    } catch (e) {
      toast.error(`خطا در حذف کاربر: ${e instanceof Error ? e.message : e}`);
    }
  };

  const handleAddUser = async () => {
    if (!formData.name?.trim() || !formData.phone?.trim()) { toast.error('نام و شماره تلفن اجباری است'); return; }
    if (users.some(u => (u.phone || '') === (formData.phone || ''))) { toast.error('این شماره تلفن قبلاً ثبت شده است'); return; }

    try {
      const payload = toServer(formData);
      const res = await api('/api/v1/members/register', { method: 'POST', body: JSON.stringify(payload) });

      if (res?.data && res.data.id && res.data.full_name) {
        const id = res.data.id;

        const meta = {
          ...planMeta,
          [id]: { courseType: formData.courseType, sessionCount: formData.sessionCount },
        };
        setPlanMeta(meta); saveMeta(meta);

        const added = { ...fromServer(res.data), ...meta[id] };
        const updated = [...users, added];
        setUsers(updated);
        localStorage.setItem('usersList', JSON.stringify(updated));
      } else {
        const fresh = await api('/api/v1/members/');
        const base = (Array.isArray(fresh.data) ? fresh.data : []).map(fromServer);
        const merged = base.map(u => ({ ...u, ...(planMeta[u.id] || {}) }));
        setUsers(merged);
        localStorage.setItem('usersList', JSON.stringify(merged));
      }

      resetForm();
      toast.success('کاربر با موفقیت اضافه شد');
    } catch (e) {
      toast.error(`خطا در افزودن کاربر: ${e instanceof Error ? e.message : e}`);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

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
          <motion.div
            className="flex items-center border-2 border-[#9FC6C3] rounded-full px-3 py-1 md:px-4 md:py-2 w-full max-w-[80%] md:max-w-sm mx-auto"
            initial="hidden" animate="visible" variants={fadeIn}
          >
            <input
              type="text" placeholder="نام را وارد کنید..."
              className="flex-1 outline-none bg-transparent text-right text-[10px] md:text-xs text-[#055B5C]"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>

          <motion.h2 className="text-center text-orange-600 font-bold text-base" initial="hidden" animate="visible" variants={fadeIn}>
            لیست اعضای باشگاه
          </motion.h2>

          <UserTable
            users={filteredUsers}
            formData={formData}
            setFormData={setFormData}
            handleEdit={handleEdit}
            handleSaveEdit={handleSaveEdit}
            handleDeleteUser={handleDeleteUser}
            handleAddUser={handleAddUser}
            resetForm={resetForm}
            editIndex={editIndex}
            addingNew={addingNew}
            setAddingNew={setAddingNew}
            courseTypes={courseTypes}
            sessionOptions={sessionOptions}
            onCourseTypeChange={(val) => setFormData(f => ({ ...f, courseType: val, sessionCount: '' }))}
            onSessionChange={(val) => setFormData(f => ({ ...f, sessionCount: val }))}
          />
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default AdminUsers;
