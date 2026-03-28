"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/app/lib/auth-context";
import SearchBar from "./SearchBar";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { user, isSignedIn, signOut, setShowSignIn } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/cars", label: "Cars" },
    { href: "/news", label: "News" },
    { href: "/compare", label: "Compare" },
    { href: "/quiz", label: "Advisor" },
    { href: "/my-list", label: "My List" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#141414]"
          : "bg-gradient-to-b from-black/70 to-transparent"
      }`}
    >
      <div className="flex items-center h-[68px] px-4 md:px-8 lg:px-[60px]">
        {/* Netflix-style Logo */}
        <Link href="/" className="mr-5 lg:mr-[25px] flex-shrink-0">
          <svg viewBox="0 0 120 34" className="h-[25px] lg:h-[28px] fill-[#e50914]">
            <text
              x="0"
              y="28"
              style={{
                fontSize: "32px",
                fontWeight: 900,
                fontFamily: "Arial Black, Impact, sans-serif",
                letterSpacing: "-0.5px",
              }}
            >
              AUTOFLIX
            </text>
          </svg>
        </Link>

        {/* Desktop Nav - Netflix uses light weight text */}
        <nav className="hidden lg:flex items-center gap-[18px]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] text-[#e5e5e5] hover:text-[#b3b3b3] transition-colors duration-400"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Browse dropdown */}
        <div className="lg:hidden relative ml-2">
          <button
            className="text-[14px] font-medium text-white flex items-center gap-1"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            Browse
            <svg
              className={`w-[16px] h-[16px] transition-transform ${mobileNavOpen ? "rotate-180" : ""}`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </button>
          {mobileNavOpen && (
            <div className="absolute top-full left-0 mt-2 w-[200px] bg-[#000]/95 border border-[#404040] py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-5 py-2.5 text-[13px] text-[#e5e5e5] hover:bg-[#333] text-center"
                  onClick={() => setMobileNavOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-[15px]">
          {/* Search */}
          <SearchBar />

          {/* Kids - Netflix has this */}
          <Link href="/quiz" className="hidden md:block text-[14px] text-[#e5e5e5] hover:text-[#b3b3b3]">
            Advisor
          </Link>

          {/* Bell */}
          <button className="hidden md:flex items-center text-white hover:text-[#b3b3b3] transition relative">
            <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </button>

          {/* Profile / Sign In */}
          {isSignedIn && user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-1.5"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-[32px] h-[32px] rounded-[4px]"
                />
                <svg
                  className={`w-[16px] h-[16px] text-white transition-transform ${profileOpen ? "rotate-180" : ""}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-[48px] w-[230px] bg-[#000]/95 border border-[#404040] py-0 animate-fade-in">
                  <div className="px-[10px] py-[10px] flex items-center gap-[10px] border-b border-[#404040]">
                    <img src={user.avatar} alt="" className="w-[32px] h-[32px] rounded-[4px]" />
                    <div className="overflow-hidden">
                      <p className="text-[13px] text-white font-medium truncate">{user.name}</p>
                      <p className="text-[11px] text-[#808080] truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link href="/my-list" className="block px-[10px] py-[8px] text-[13px] text-[#b3b3b3] hover:underline" onClick={() => setProfileOpen(false)}>
                    My List
                  </Link>
                  <Link href="/copilot" className="block px-[10px] py-[8px] text-[13px] text-[#b3b3b3] hover:underline" onClick={() => setProfileOpen(false)}>
                    AI Copilot
                  </Link>
                  <div className="border-t border-[#404040]">
                    <button
                      onClick={() => { signOut(); setProfileOpen(false); }}
                      className="w-full text-center px-[10px] py-[10px] text-[13px] text-[#b3b3b3] hover:underline"
                    >
                      Sign out of AutoFlix
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowSignIn(true)}
              className="bg-[#e50914] text-white text-[14px] font-medium px-[16px] py-[5px] rounded-[3px] hover:bg-[#f6121d] transition"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
