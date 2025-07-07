import React, { createContext, useContext, useState, useEffect } from "react";

const PurchaseContext = createContext();

export const usePurchases = () => useContext(PurchaseContext);

export const PurchaseProvider = ({ children }) => {
  const [purchases, setPurchases] = useState(() => {
    const stored = localStorage.getItem("purchases");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("purchases", JSON.stringify(purchases));
  }, [purchases]);

  const addPurchase = (item) => {
    const exists = purchases.some(
      (p) => p.id === item.id && p.coach === item.coach
    );
    if (!exists) {
      const fullItem = {
        ...item,
        duration: item.duration || "",
        date: new Date().toLocaleDateString("fa-IR"), // ⬅ تاریخ شمسی
      };
      setPurchases((prev) => [...prev, fullItem]);
    }
  };

  const clearPurchases = () => {
    setPurchases([]);
    localStorage.removeItem("purchases");
  };

  return (
    <PurchaseContext.Provider
      value={{ purchases, addPurchase, clearPurchases }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};
