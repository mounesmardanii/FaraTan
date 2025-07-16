import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { assets } from '../../assets/assets';

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { icon: assets.home, label: 'داشبورد', path: '/admin' },
    { icon: assets.user, label: 'کاربران', path: '/admin/users' },
    { icon: assets.text, label: 'مربی ها', path: '/admin/coaches' },

    // تغییر آیکون دوره ها به gym
    { icon: assets.gym, label: 'دوره ها', path: '/admin/courses' },

    { icon: assets.wardrobe, label: 'کمد ها', path: '/admin/wardrobes' },
    { icon: assets.payment, label: 'پرداخت ها', path: '/admin/payments' },
  ];


  return (
    <div className="bg-[#D1E7D8] w-full h-full flex flex-col gap-3 items-start p-4 rounded-tr-[75px]">
      {items.map((item, i) => {
        const isActive = location.pathname === item.path;

        return (
          <button
            key={i}
            onClick={() => navigate(item.path)}
            className={`flex flex-row items-center gap-5 w-full px-3 py-2 rounded-full transition mt-5
              ${isActive
                ? 'bg-white text-[#055B5C] font-semibold cursor-pointer'
                : 'text-[#055B5C] hover:bg-[#DDEEE2]'
              }
            `}
          >
            <img src={item.icon} alt="" className="w-6 h-6" />
            <span
              className={`text-[15px] font-extrabold cursor-pointer ${!isActive ? 'bg-[#9FC6C3] px-3 py-1 rounded-full' : ''
                }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default AdminSidebar;
