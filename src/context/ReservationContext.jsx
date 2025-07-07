import React, { createContext, useContext, useState, useEffect } from "react";

const ReservationContext = createContext();
export const useReservations = () => useContext(ReservationContext);

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState(() => {
    const saved = localStorage.getItem("reservations");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("reservations", JSON.stringify(reservations));
  }, [reservations]);

  const reserveClass = (classItem) => {
    const exists = reservations.some((r) => r.id === classItem.id);
    if (!exists) {
      setReservations((prev) => [...prev, classItem]);
    }
  };

  const cancelReservation = (classId) => {
    setReservations((prev) => prev.filter((r) => r.id !== classId));
  };

  return (
    <ReservationContext.Provider
      value={{ reservations, reserveClass, cancelReservation }}
    >
      {children}
    </ReservationContext.Provider>
  );
};
