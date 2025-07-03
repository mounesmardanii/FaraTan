import React, { createContext, useContext, useState } from "react";

// مقدار پیش‌فرض
const defaultUser = null;

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(defaultUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);