"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/lib/types";
import {
  getSession,
  setSession,
  clearSession,
  getAdmins,
  setInitialized,
  isInitialized,
  setAdmins,
} from "@/lib/storage";
import {
  seedAdmins,
  seedRooms,
  seedStudents,
  seedPayments,
  defaultSettings,
} from "@/lib/seed-data";
import { setRooms, setStudents, setPayments, setSettings } from "@/lib/storage";
import { MASTER_ADMIN } from "@/lib/constants";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize data on first load
  useEffect(() => {
    if (!isInitialized()) {
      // Initialize seed data
      setRooms(seedRooms);
      setStudents(seedStudents);
      setPayments(seedPayments);
      setAdmins(seedAdmins);
      setSettings(defaultSettings);
      setInitialized();
    }

    // Check for existing session
    const session = getSession();
    if (session) {
      setUser(session);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    // Check against master admin
    if (
      username === MASTER_ADMIN.username &&
      password === MASTER_ADMIN.password
    ) {
      const newUser: User = {
        username,
        role: "admin",
        loginTime: new Date().toISOString(),
      };
      setSession(newUser);
      setUser(newUser);
      return;
    }

    // Check against other admins
    const admins = getAdmins();
    for (const admin of Object.values(admins)) {
      if (admin.username === username && admin.password === password) {
        const newUser: User = {
          username,
          role: "admin",
          loginTime: new Date().toISOString(),
        };
        setSession(newUser);
        setUser(newUser);
        return;
      }
    }

    throw new Error("Invalid credentials");
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
