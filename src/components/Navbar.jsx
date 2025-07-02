import React, { useState } from "react";
import { assets } from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <header className="relative w-full py-4 px-[20px] md:px-[50px] lg:px-[100px] bg-white">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3 md:gap-10">
          <button
            onClick={handleLoginClick}
            className="bg-[#055B5C] text-white px-4 py-2 text-[14px] rounded-full md:px-6 md:py-2 md:text-[16px] flex items-center justify-center transition-all duration-300 hover:bg-[#044041] hover:scale-105 cursor-pointer"
          >
            <span className="relative -top-[2px]">ورود/ثبت‌نام</span>
          </button>

          <nav className="hidden md:flex gap-10 text-[#055B5C] font-extrabold text-[18px]">
            <a
              href="#footer"
              className="hover:text-[#FF6600] transition-colors duration-300"
            >
              ارتباط با ما
            </a>
            <a
              href="#about"
              className="hover:text-[#FF6600] transition-colors duration-300"
            >
              درباره ما
            </a>
            <a
              onClick={() => navigate("/start-training")}
              className="hover:text-[#FF6600] transition-colors duration-300 cursor-pointer"
            >
              شروع بدنسازی
            </a>

            <a
              href="/"
              className="hover:text-[#FF6600] transition-colors duration-300"
            >
              خانه
            </a>
          </nav>

          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              <img
                src={assets.menu}
                alt="menu icon"
                className="w-8 h-8 cursor-pointer"
              />
            </button>
          </div>
        </div>

        <div className="text-[#FF6600] font-extrabold text-[18px] md:text-[28px] text-center cursor-context-menu">
          باشگاه فراتن
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-full left-0 w-full flex justify-center md:hidden bg-white py-3 border-b-[3px] border-[#FF6600] rounded-b-full z-50"
          >
            <nav className="flex gap-10 text-[#055B5C] font-extrabold text-[16px]">
              <a
                href="#contact"
                className="hover:text-[#FF6600] transition-colors duration-300"
              >
                ارتباط با ما
              </a>
              <a
                href="#about"
                className="hover:text-[#FF6600] transition-colors duration-300"
              >
                درباره ما
              </a>
              <a
                onClick={() => navigate("/start-training")}
                className="hover:text-[#FF6600] transition-colors duration-300 cursor-pointer"
              >
                شروع بدنسازی
              </a>

              <a
                href="#home"
                className="hover:text-[#FF6600] transition-colors duration-300"
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
