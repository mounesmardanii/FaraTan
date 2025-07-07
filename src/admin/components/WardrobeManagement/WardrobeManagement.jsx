import React, { useState, useEffect } from 'react';
import AdminHeader from '../AdminHeader';
import AdminSidebar from '../AdminSidebar';
import { motion } from 'framer-motion';
import lock from '../../../assets/lock1.png';
import unlock from '../../../assets/lock2.png';
import repair from '../../../assets/repair.png';

const WardrobeManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wardrobes, setWardrobes] = useState([]);
  const [selectedWardrobe, setSelectedWardrobe] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [formData, setFormData] = useState({ name: '', phone: '', date: '' });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const dummy = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      status: ['locked', 'unlocked', 'repair'][Math.floor(Math.random() * 3)],
      name: 'مونس مردانی',
      phone: '09116868904',
      date: '1404/02/15',
    }));
    setWardrobes(dummy);
  }, []);

  const getIcon = (status) => {
    switch (status) {
      case 'locked': return lock;
      case 'unlocked': return unlock;
      case 'repair': return repair;
      default: return lock;
    }
  };

  const handleWardrobeClick = (e, wardrobe) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setModalPosition({ top: rect.top + window.scrollY, left: rect.left + window.scrollX });
    setSelectedWardrobe(wardrobe);
    setFormData({ name: wardrobe.name, phone: wardrobe.phone, date: wardrobe.date });
  };

  const handleStatusChange = (newStatus) => {
    let updatedWardrobe = { ...selectedWardrobe, status: newStatus };

    if (newStatus === 'locked') {
      updatedWardrobe = { ...updatedWardrobe, ...formData };
    } else {
      updatedWardrobe = { ...updatedWardrobe, name: '', phone: '', date: '' };
    }

    setWardrobes((prev) =>
      prev.map((w) => (w.id === selectedWardrobe.id ? updatedWardrobe : w))
    );
    setSelectedWardrobe(null);
  };

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
            className="text-orange-600 font-bold text-xl md:text-2xl text-center mb-6"
          >
            وضعیت کمد های باشگاه
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative bg-[#EAF4EF] p-6 sm:p-8 md:p-10 rounded-[60px] border-2 border-[#055B5C] w-fit mx-auto"
          >
            <div className="grid grid-cols-5 gap-3 sm:gap-4 md:gap-5">
              {wardrobes.map((wardrobe, index) => (
                <motion.div
                  key={wardrobe.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02, duration: 0.2 }}
                  onClick={(e) => handleWardrobeClick(e, wardrobe)}
                  className="relative w-[60px] sm:w-[70px] md:w-[80px] h-[60px] sm:h-[70px] md:h-[80px] border border-[#055B5C] rounded-[20px] bg-white flex flex-col items-center justify-center cursor-pointer hover:shadow-sm transition"
                >
                  <img src={getIcon(wardrobe.status)} alt={wardrobe.status} className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                  <span className="mt-1 text-[#055B5C] font-semibold text-xs md:text-sm">{wardrobe.id}</span>

                  {isMobile && selectedWardrobe?.id === wardrobe.id && (
                    <div className="absolute top-full mt-1 w-44 bg-[#FFEFE0] z-50 border border-[#FF7A00] rounded-lg shadow-md p-2 text-xs text-right">
                      <button
                        className="absolute top-1 left-2 text-red-500 text-base font-bold cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedWardrobe(null);
                        }}
                      >
                        ×
                      </button>
                      <p className="mb-1">شماره کمد: {wardrobe.id}</p>
                      <p className="mb-1">وضعیت: {
                        wardrobe.status === 'repair' ? 'در حال تعمیر' :
                          wardrobe.status === 'locked' ? 'پر است' : 'خالی است'
                      }</p>
                      {wardrobe.status === 'locked' && (
                        <>
                          <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border rounded p-1 mb-1" placeholder="نام" />
                          <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full border rounded p-1 mb-1" placeholder="موبایل" />
                          <input type="text" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full border rounded p-1 mb-1" placeholder="تاریخ" />
                        </>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {['unlocked', 'locked', 'repair'].map((status) => (
                          <button key={status} onClick={() => handleStatusChange(status)} className="px-2 py-1 border border-[#FF7A00] rounded cursor-pointer hover:bg-orange-100">
                            {status === 'unlocked' ? 'خالی' : status === 'locked' ? 'پر' : 'تعمیر'}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {!isMobile && selectedWardrobe && (
            <div className="absolute z-50" style={{ top: modalPosition.top, left: modalPosition.left }}>
              <div className="bg-[#FFEFE0] rounded-xl p-4 w-64 sm:w-72 relative shadow-lg border border-[#FF7A00]">
                <button className="absolute top-2 left-2 text-red-500 text-xl font-bold cursor-pointer" onClick={() => setSelectedWardrobe(null)}>×</button>
                <div className="text-right text-[#055B5C] text-sm leading-6 font-medium">
                  <p>شماره کمد: {selectedWardrobe.id}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <img src={getIcon(selectedWardrobe.status)} alt="status" className="w-4 h-4" />
                    <span className={selectedWardrobe.status === 'repair' ? 'text-orange-500' : selectedWardrobe.status === 'locked' ? 'text-red-600' : 'text-green-600'}>
                      وضعیت: {selectedWardrobe.status === 'repair' ? 'در حال تعمیر' : selectedWardrobe.status === 'locked' ? 'پر است' : 'خالی است'}
                    </span>
                  </div>
                  {selectedWardrobe.status === 'locked' && (
                    <>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-2 w-full border rounded p-1 text-sm" placeholder="نام کاربر" />
                      <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="mt-1 w-full border rounded p-1 text-sm" placeholder="شماره تماس" />
                      <input type="text" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="mt-1 w-full border rounded p-1 text-sm" placeholder="تاریخ اختصاص" />
                    </>
                  )}
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {['unlocked', 'locked', 'repair'].map((status) => (
                      <button key={status} onClick={() => handleStatusChange(status)} className="px-2 py-1 text-xs border border-[#FF7A00] rounded cursor-pointer hover:bg-orange-100">
                        تغییر به {status === 'unlocked' ? 'خالی' : status === 'locked' ? 'پر' : 'تعمیر'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default WardrobeManagement;
