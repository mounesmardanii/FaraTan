import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // دسترسی به context

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser(); // گرفتن وضعیت کاربر

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false); // بستن منو بعد از کلیک
  };

  return (
    <header className="relative w-full py-4 px-[20px] md:px-[50px] lg:px-[100px] bg-white">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3 md:gap-10">

          {/* دکمه ورود یا ورود به پنل ادمین */}
          {user?.role === 'admin' ? (
            <button
              onClick={() => navigate('/admin')}
              className="bg-[#FF6600] text-white px-4 py-2 text-[14px] rounded-full md:px-6 md:py-2 md:text-[16px] hover:bg-[#cc5200] transition-all cursor-pointer"
            >
              ورود به پنل ادمین
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-[#055B5C] text-white px-4 py-2 text-[14px] rounded-full md:px-6 md:py-2 md:text-[16px] hover:bg-[#044041] transition-all cursor-pointer"
            >
              ورود/ثبت‌نام
            </button>
          )}

          {/* منوی دسکتاپ */}
          <nav className="hidden md:flex gap-10 text-[#055B5C] font-extrabold text-[18px]">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#FF6600] transition-colors duration-300"
            >
              ارتباط با ما
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#FF6600] transition-colors duration-300"
            >
              درباره ما
            </a>
            <a
              onClick={() => handleNavigate('/start-training')}
              className="hover:text-[#FF6600] transition-colors duration-300 cursor-pointer"
            >
              شروع بدنسازی
            </a>
            <a
              onClick={() => handleNavigate('/')}
              className="hover:text-[#FF6600] transition-colors duration-300 cursor-pointer"
            >
              خانه
            </a>
          </nav>

          {/* دکمه منوی موبایل */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              <img src={assets.menu} alt="menu icon" className="w-8 h-8 cursor-pointer" />
            </button>
          </div>
        </div>

        {/* لوگو */}
        <div className="text-[#FF6600] font-extrabold text-[18px] md:text-[28px] text-center cursor-context-menu">
          باشگاه فراتن
        </div>
      </div>

      {/* منوی موبایل */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute top-full left-0 w-full flex justify-center md:hidden bg-white py-3 border-b-[3px] border-[#FF6600] rounded-b-full z-50"
          >
            <nav className="flex gap-10 text-[#055B5C] font-extrabold text-[16px]">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  setMenuOpen(false);
                }}
                className="hover:text-[#FF6600] transition-colors duration-300"
              >
                ارتباط با ما
              </a>
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  setMenuOpen(false);
                }}
                className="hover:text-[#FF6600] transition-colors duration-300"
              >
                درباره ما
              </a>
              <a
                onClick={() => handleNavigate('/start-training')}
                className="hover:text-[#FF6600] transition-colors duration-300 cursor-pointer"
              >
                شروع بدنسازی
              </a>
              <a
                onClick={() => handleNavigate('/')}
                className="hover:text-[#FF6600] transition-colors duration-300 cursor-pointer"
              >
                خانه
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
