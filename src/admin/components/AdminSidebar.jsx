// AdminSidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { assets } from '../../assets/assets';

function AdminSidebar({ isOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { icon: assets.home, label: 'داشبورد', path: '/admin' },
    { icon: assets.user, label: 'کاربران', path: '/admin/users' },
    { icon: assets.sport, label: 'ورزش‌ها', path: '/admin/fitness' },
    { icon: assets.text, label: 'مربی ها', path: '/admin/coaches' },
    { icon: assets.wardrobe, label: 'کمد ها', path: '/admin/wardrobes' },
    { icon: assets.payment, label: 'پرداخت ها', path: '/admin/payments' },
  ];

  return (
    <aside
      className={`
        bg-[#D1E7D8] md:w-[275px] min-h-full py-10 px-2 flex flex-col items-center md:items-start
        border-t-3 border-r-3 border-[#055B5C] rounded-tr-[75px]
        fixed top-[4rem] left-0 z-50 md:relative md:top-0
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}
      style={{ width: '275px' }}
    >
      <div className="flex flex-col gap-8 w-full items-start mt-3">
        {items.map((item, i) => {
          const isActive = location.pathname === item.path;
          const isDashboard = item.path === '/admin';

          return (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              className={`flex flex-row items-center gap-5 w-full px-3 py-2 rounded-full transition
                ${isActive ? 'bg-white text-[#055B5C] font-semibold cursor-pointer' : 'text-[#055B5C] hover:bg-[#DDEEE2]'}
              `}
            >
              <img src={item.icon} alt="" className="w-6 h-6" />
              <span
                className={`text-[15px] font-extrabold cursor-pointer ${
                  isDashboard ? '' : 'bg-[#9FC6C3] px-3 py-1 rounded-full'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default AdminSidebar;
