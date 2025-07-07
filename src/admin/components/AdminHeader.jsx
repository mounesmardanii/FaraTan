import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

function AdminHeader({ onMenuClick }) {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white flex justify-between items-center px-4 md:px-10 py-3 relative z-50">
      <div className="md:hidden">
        <button onClick={onMenuClick} aria-label="Toggle menu" className="p-2">
          <img src={assets.menu} alt="menu" className="w-12 h-12 cursor-pointer" />
        </button>
      </div>

      <div className="hidden md:block absolute top-0 left-0">
        <div className="w-[270px] h-[70px] bg-[#055B5C] rounded-br-full flex items-center justify-center">
          <span className="text-white font-bold text-lg md:text-xl">باشگاه فراتن</span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="bg-[#055B5C] text-white text-sm md:text-base px-6 py-2 md:px-8 md:py-3 rounded-full hover:opacity-90 transition cursor-pointer whitespace-nowrap"
        >
          بازگشت به خانه
        </button>
        <img
          src={assets.account}
          alt="پروفایل"
          className="w-12 h-12 rounded-full border border-orange-500 p-1.5 cursor-pointer"
        />
      </div>
    </header>
  );
}

export default AdminHeader;
