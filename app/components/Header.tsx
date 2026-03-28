"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/app/lib/auth-context";
import SearchBar from "./SearchBar";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const { user, isSignedIn, signOut, setShowSignIn } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/cars", label: "Cars" },
    { href: "/news", label: "News" },
    { href: "/compare", label: "Compare" },
    { href: "/copilot", label: "AI Copilot" },
    { href: "/my-list", label: "My List" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[#141414]" : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
      }`}
    >
      <div className="flex items-center px-[4%] h-[68px]">
        {/* Logo */}
        <Link href="/" className="mr-6 flex-shrink-0">
          <span className="text-[#e50914] text-[28px] font-black tracking-tight" style={{ fontFamily: "Arial Black, sans-serif" }}>
            AUTOFLIX
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] text-[#e5e5e5] hover:text-[#b3b3b3] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Browse Dropdown */}
        <div className="relative lg:hidden ml-2">
          <button
            onClick={() => setBrowseOpen(!browseOpen)}
            className="flex items-center gap-1 text-[14px] text-white font-medium"
          >
            Browse
            <svg className={`w-4 h-4 transition-transform ${browseOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {browseOpen && (
            <div className="absolute top-full left-0 mt-2 bg-[#141414]/95 border border-white/10 rounded py-2 min-w-[200px]">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setBrowseOpen(false)}
                  className="block px-5 py-2 text-[13px] text-[#e5e5e5] hover:bg-white/5"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-auto">
          <SearchBar />

          {isSignedIn && user ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded avatar-ring"
                />
                <svg
                  className={`w-4 h-4 text-white transition-transform ${profileOpen ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-[220px] bg-[#000000]/95 border border-white/15 rounded py-2">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-[14px] text-white font-medium">{user.name}</p>
                    <p className="text-[12px] text-[#737373]">{user.email}</p>
                  </div>
                  <Link href="/my-list" className="block px-4 py-2 text-[13px] text-[#e5e5e5] hover:underline" onClick={() => setProfileOpen(false)}>
                    My List
                  </Link>
                  <button
                    onClick={() => { signOut(); setProfileOpen(false); }}
                    className="w-full text-left px-4 py-2 text-[13px] text-[#e5e5e5] hover:underline border-t border-white/10"
                  >
                    Sign out of AutoFlix
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowSignIn(true)}
              className="bg-[#e50914] text-white text-[14px] font-medium px-4 py-1.5 rounded hover:bg-[#f6121d] transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
