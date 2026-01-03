import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  fullName: string;
  email: string;
  location?: string;
  bio?: string;
  profileImage?: string;
  memberSince?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => {
    // Load user from localStorage on initial mount
    const savedUser = localStorage.getItem('globetrotter_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('globetrotter_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('globetrotter_user');
    }
  }, [user]);

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUserState({ ...user, ...updates });
    }
  };

  const logout = () => {
    setUserState(null);
    localStorage.removeItem('globetrotter_user');
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
