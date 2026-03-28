"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isSignedIn: boolean;
  signIn: (name: string, email: string) => void;
  signOut: () => void;
  showSignIn: boolean;
  setShowSignIn: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isSignedIn: false,
  signIn: () => {},
  signOut: () => {},
  showSignIn: false,
  setShowSignIn: () => {},
});

function generateAvatar(name: string): string {
  const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  const colors = ["#e50914", "#b81d24", "#221f1f", "#f5f5f1", "#564d4d"];
  const bg = colors[name.length % colors.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" rx="8" fill="${bg}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Helvetica Neue,Helvetica,Arial" font-size="28" font-weight="700">${initials}</text></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("autoflix_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  const signIn = useCallback((name: string, email: string) => {
    const newUser: AuthUser = {
      id: crypto.randomUUID(),
      name,
      email,
      avatar: generateAvatar(name),
    };
    setUser(newUser);
    localStorage.setItem("autoflix_user", JSON.stringify(newUser));
    setShowSignIn(false);
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem("autoflix_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isSignedIn: !!user, signIn, signOut, showSignIn, setShowSignIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
