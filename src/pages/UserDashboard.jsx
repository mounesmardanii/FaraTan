import React from "react";
import { useNavigate } from "react-router-dom";
import ProfileTable from "../components/Profile/ProfileTable";
import { assets } from "../assets/assets";

const UserDashboard = () => {
  const navigate = useNavigate();

  const navItems = [
    { label: "پرداخت ها", icon: assets.payment1, path: "/my-purchases" },
    { label: "برنامه تغذیه", icon: assets.apple, path: "/nutrition" },
    { label: "رزرو ها", icon: assets.reservation, path: "/my-reservations" },
    { label: "برنامه ورزشی", icon: assets.plan, path: "/sports-program" },
  ];

  return (
    <div className="flex flex-col items-center p-4 sm:p-6 md:p-8 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-4 mt-4 w-full">
        {navItems.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center border-[0.5px] border-[#055B5C] rounded-lg px-4 py-3 sm:px-5 sm:py-4 tablet:border-[0.5px] cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out bg-white w-full"
          >
            <img
              src={item.icon || "https://via.placeholder.com/40"}
              alt={item.label}
              className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 mb-2 transition-transform duration-300 tablet:w-6 tablet:h-6 max-w-full object-contain"
              onError={(e) =>
                console.error(
                  `Failed to load image for ${item.label}: ${e.target.src}`
                )
              }
            />
            <p className="text-xs sm:text-sm tablet:text-[10px] font-bold text-[#055B5C]">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      <ProfileTable />
    </div>
  );
};

export default UserDashboard;
