import React from "react";
import { motion } from "framer-motion";
import { usePurchases } from "../../context/PurchaseContext";
import { useNavigate } from "react-router-dom";

const PurchasePreviewModal = ({ isOpen, onClose, data, onConfirmed }) => {
  const navigate = useNavigate();
  const { addPurchase } = usePurchases();

  if (!isOpen || !data) return null;

  const handleConfirm = () => {
    addPurchase(data);
    if (onConfirmed) onConfirmed();
    onClose();
    navigate("/my-purchases");
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#FFF1E3] border border-[#FFD9A0] rounded-4xl p-6 w-[90%] max-w-sm text-center shadow-xl"
      >
        <h2 className="text-lg font-extrabold mb-4 text-[#FF6600]">
          تأیید اطلاعات خرید
        </h2>

        <ul className="text-right text-sm space-y-2 mb-4 text-[#256250] leading-6">
          <li>
            <strong>نام خریدار:</strong> {data.buyerName}
          </li>
          <li>
            <strong>نوع دوره:</strong> {data.duration}
          </li>
          <li>
            <strong>مربی:</strong> {data.coach}
          </li>
          <li>
            <strong>تعداد جلسات:</strong> {data.sessions} جلسه
          </li>
          <li>
            <strong>قیمت:</strong> {data.price}
          </li>
          <li>
            <strong>تاریخ خرید:</strong> {data.date}
          </li>
        </ul>

        <button
          onClick={handleConfirm}
          className="bg-[#256250] text-white font-bold py-2 px-4 rounded-xl w-full hover:bg-[#1f4f45] mb-3"
        >
          پرداخت و ثبت خرید
        </button>

        <button
          onClick={onClose}
          className="text-sm text-[#FF6600] font-semibold hover:text-red-500"
        >
          بستن
        </button>
      </motion.div>
    </div>
  );
};

export default PurchasePreviewModal;
