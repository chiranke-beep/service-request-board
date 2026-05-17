'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type User = { id: string; name: string; email: string };
type AuthCtx = {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx>({ user: null, token: null, login: () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem('fixdesk_auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user);
      setToken(parsed.token);
    }
  }, []);

  function login(token: string, user: User) {
    localStorage.setItem('fixdesk_auth', JSON.stringify({ token, user }));
    setToken(token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem('fixdesk_auth');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
