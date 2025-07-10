import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    visible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 bg-[#FF6600] text-white p-3 rounded-full shadow-lg hover:bg-[#e65c00] transition duration-300 cursor-pointer"
      >
        <FaArrowUp className="w-4 h-4" />
      </button>
    )
  );
};

export default ScrollToTopButton;
