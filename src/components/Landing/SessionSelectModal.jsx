import React from "react";
import { motion } from "framer-motion";

const SessionSelectModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const options = [20, 16, 12, 8];

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#FFF1E3] border border-[#FFD9A0] rounded-4xl p-6 w-[90%] max-w-sm text-center shadow-xl"
      >
        <h2 className="text-lg font-extrabold mb-4 text-[#FF6600] tracking-tight">
          چند جلسه در ماه می‌خواهید؟
        </h2>
        <div
          className={`grid ${
            options.length <= 4 ? "grid-cols-4" : "grid-cols-2"
          } gap-2 mb-4`}
        >
          {options.map((count) => (
            <button
              key={count}
              onClick={() => onSelect(count)}
              className="bg-[#FEEDDB] border border-[#FFD9A0] hover:bg-[#FFE5CC] text-[#256250] font-bold py-2 px-4 rounded-xl transition duration-200 cursor-pointer"
            >
              {count} جلسه
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="text-sm text-[#FF6600] font-semibold hover:text-red-500 transition duration-150 cursor-pointer"
        >
          بستن
        </button>
      </motion.div>
    </div>
  );
};

export default SessionSelectModal;
