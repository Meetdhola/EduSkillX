import React, { createContext, useState } from 'react';

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
  const [userData, setUserData] = useState({
    fullname: '',
    email: '',
    password: '',
  });

  const value = {
    userData,
    setUserData
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
