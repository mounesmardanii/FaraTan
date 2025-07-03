import React from "react";
import { useNavigate } from "react-router-dom";
import ProfileTable from "../components/Profile/ProfileTable";
import { assets } from "../assets/assets";

const UserDashboard = () => {
  const navigate = useNavigate();

  const navItems = [
    { label: "پرداخت ها", icon: assets.payment1, path: "/payments" },
    { label: "برنامه تغذیه", icon: assets.apple, path: "/nutrition" },
    { label: "رزرو ها", icon: assets.reservation, path: "/reservations" },
    { label: "برنامه ورزشی", icon: assets.plan, path: "/workout" },
  ];

  return (
    <div className="flex flex-col items-center p-4 sm:p-6 md:p-8 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {navItems.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center border rounded-lg px-4 py-6 cursor-pointer hover:shadow-md transition"
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

      <ProfileTable />
    </div>
  );
};

export default UserDashboard;
