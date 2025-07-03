import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { assets } from "../assets/assets";

function Navbar() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
    setShowDropdown(false);
  };

  const handleLoginClick = () => {
    navigate("/login");
    setMenuOpen(false);
    setShowDropdown(false);
  };

  return (
    <header className="relative w-full py-4 px-[20px] md:px-[50px] lg:px-[100px] bg-white">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3 md:gap-10">
          <div className="relative">
            {!user ? (
              <button
                onClick={handleLoginClick}
                className="bg-[#055B5C] text-white px-4 py-2 text-[14px] rounded-full md:px-6 md:py-2 md:text-[16px] flex items-center justify-center transition-all duration-300 hover:bg-[#044041] hover:scale-105 cursor-pointer"
              >
                ورود / ثبت‌نام
              </button>
            ) : (
              <div>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="bg-[#055B5C] text-white px-4 py-2 text-[14px] rounded-full md:px-6 md:py-2 md:text-[16px] flex items-center justify-center transition-all duration-300 hover:bg-[#044041] hover:scale-105 cursor-pointer"
                >
                  {user.name || "پروفایل"}
                </button>

                {showDropdown && (
                  <div className="absolute top-full left-0 bg-white rounded-md shadow-md mt-2 py-2 w-48 text-right z-50">
                    {user.role === "admin" ? (
                      <>
                        <button
                          onClick={() => handleNavigate("/admin")}
                          className="block w-full text-right px-4 py-2 text-[#055B5C] hover:bg-gray-100"
                        >
                          ورود به پنل ادمین
                        </button>
                        <button
                          onClick={() => handleNavigate("/profile")}
                          className="block w-full text-right px-4 py-2 text-[#055B5C] hover:bg-gray-100"
                        >
                          پروفایل من
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleNavigate("/profile")}
                          className="block w-full text-right px-4 py-2 text-[#055B5C] hover:bg-gray-100"
                        >
                          پروفایل من
                        </button>
                        <button
                          onClick={() => handleNavigate("/my-reservations")}
                          className="block w-full text-right px-4 py-2 text-[#055B5C] hover:bg-gray-100"
                        >
                          رزروهای من
                        </button>
                        <button
                          onClick={() => handleNavigate("/my-purchases")}
                          className="block w-full text-right px-4 py-2 text-[#055B5C] hover:bg-gray-100"
                        >
                          خریدهای من
                        </button>
                      </>
                    )}
                    <button
                      onClick={logout}
                      className="block w-full text-right px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      خروج
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <nav className="hidden md:flex gap-10 text-[#055B5C] font-extrabold text-[18px]">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-[#FF6600] transition-colors duration-300"
            >
              ارتباط با ما
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-[#FF6600] transition-colors duration-300"
            >
              درباره ما
            </a>
            <a
              onClick={() => handleNavigate("/start-training")}
              className="hover:text-[#FF6600] transition-colors duration-300 cursor-pointer"
            >
              شروع بدنسازی
            </a>
            <a
              onClick={() => handleNavigate("/")}
              className="hover:text-[#FF6600] transition-colors duration-300 cursor-pointer"
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
            <nav className="flex flex-row gap-6 items-center text-[#055B5C] font-extrabold text-[16px]">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" });
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
                  document
                    .getElementById("about")
                    ?.scrollIntoView({ behavior: "smooth" });
                  setMenuOpen(false);
                }}
                className="hover:text-[#FF6600] transition-colors duration-300"
              >
                درباره ما
              </a>
              <a
                onClick={() => handleNavigate("/start-training")}
                className="hover:text-[#FF6600] transition-colors duration-300 cursor-pointer"
              >
                شروع بدنسازی
              </a>
              <a
                onClick={() => handleNavigate("/")}
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
