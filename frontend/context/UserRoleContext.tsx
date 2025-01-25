import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserRoleContextType {
  userRole: number;
  setUserRole: (role: number) => void;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState(-1);

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole doit être utilisé dans un UserRoleProvider');
  }
  return context;
};
