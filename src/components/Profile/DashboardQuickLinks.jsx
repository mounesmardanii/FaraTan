// src/components/Profile/DashboardQuickLinks.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const DashboardQuickLinks = () => {
  const navigate = useNavigate();

  const navItems = [
    { label: "پرداخت ها", icon: assets.card, path: "/payments" },
    { label: "برنامه تغذیه", icon: assets.apple, path: "/nutrition" },
    { label: "رزرو ها", icon: assets.clock, path: "/reservations" },
    { label: "برنامه ورزشی", icon: assets.heart, path: "/workout" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 w-full justify-center">
      {navItems.map((item, index) => (
        <div
          key={index}
          onClick={() => navigate(item.path)}
          className="flex flex-col items-center justify-center border border-[#256250] rounded-lg px-4 py-6 cursor-pointer hover:shadow-md transition w-full"
        >
          <img
            src={item.icon}
            alt={item.label}
            className="w-12 h-12 sm:w-14 sm:h-14 mb-2"
          />
          <p className="text-sm font-bold">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardQuickLinks;
