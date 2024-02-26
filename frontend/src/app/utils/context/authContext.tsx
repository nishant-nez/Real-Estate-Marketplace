"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { parseCookies, destroyCookie } from "nookies";
import { BACKEND } from "../constants";
axios.defaults.withCredentials = true;

interface User {
  id: number;
  name: string;
  email: string;
  phone: number | null;
  role: number;
  avatar: string;
  date: Date;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND}/user/login/`,
        {
          email: email,
          password: password,
        },
        { withCredentials: true }
      );
      if (response.statusText === "Created") {
        const user = await axios.get(`${BACKEND}/user/`);
        if (user.statusText === "OK") {
          setUser(response.data);
          setIsLoggedIn(true);
        }
      }
    } catch (error) {
      console.log("error logging in: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const response = await axios.post(`${BACKEND}/user/logout/`, {}, { withCredentials: true });
    setIsLoggedIn(false);
    if (response.statusText === "OK") setIsLoggedIn(false);
    // destroyCookie(null, "jwt");
    // destroyCookie(null, "role");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { role } = parseCookies();
        if (role) {
          const response = await axios.get(`${BACKEND}/user/`, { withCredentials: true });
          if (response.statusText === "OK") {
            setUser(response.data);
            setIsLoggedIn(true);
          }
        }
      } catch (error) {
        console.log("Error while trying to get the authenticated user: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("loggedin", isLoggedIn);
  }, [isLoggedIn]);

  return <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, logout }}>{children}</AuthContext.Provider>;
};
