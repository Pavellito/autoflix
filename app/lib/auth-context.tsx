"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;
  signIn: (email: string, name: string) => void;
  signOut: () => void;
  showSignIn: boolean;
  setShowSignIn: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isSignedIn: false,
  signIn: () => {},
  signOut: () => {},
  showSignIn: false,
  setShowSignIn: () => {},
});

const AVATAR_COLORS = [
  "#e50914", "#b81d24", "#221f1f", "#f5f5f1",
  "#0071eb", "#46d369", "#e87c03", "#b9090b",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function generateAvatar(name: string): string {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const color = getAvatarColor(name);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" rx="4" fill="${color}"/><text x="40" y="40" text-anchor="middle" dominant-baseline="central" fill="white" font-family="Helvetica,Arial,sans-serif" font-size="28" font-weight="bold">${initials}</text></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("autoflix_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("autoflix_user");
      }
    }
  }, []);

  const signIn = useCallback((email: string, name: string) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
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
    <AuthContext.Provider
      value={{
        user,
        isSignedIn: !!user,
        signIn,
        signOut,
        showSignIn,
        setShowSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
