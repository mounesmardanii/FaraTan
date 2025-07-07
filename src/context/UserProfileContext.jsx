import React, { createContext, useContext, useEffect, useState } from "react";

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
  const defaultData = {
    name: "یگانه محمدی",
    age: 28,
    phone: "09123456789",
    medicalCondition: "بدون مشکل خاص",
    dietHistory: "2 ماه رژیم کتو",
    exerciseHistory: "1 سال بدنسازی",
    physical: {
      height: 160,
      weight: 65,
      waist: 65,
      arm: 65,
      chest: 65,
      hip: 65,
    },
  };

  const [userProfile, setUserProfile] = useState(defaultData);

  useEffect(() => {
    const saved = localStorage.getItem("userInfo");
    if (saved) {
      setUserProfile(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("userInfo", JSON.stringify(userProfile));
  }, [userProfile]);

  const updateUserInfo = (info) => {
    setUserProfile((prev) => ({ ...prev, ...info }));
  };

  const updatePhysicalData = (physicalData) => {
    setUserProfile((prev) => ({
      ...prev,
      physical: { ...prev.physical, ...physicalData },
    }));
  };

  return (
    <UserProfileContext.Provider
      value={{ userProfile, updateUserInfo, updatePhysicalData }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => useContext(UserProfileContext);
