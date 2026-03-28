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
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-[#141414]" : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
      }`}
    >
      <div className="flex items-center px-4 lg:px-14 py-0 h-[68px]">
        {/* Logo */}
        <Link href="/" className="mr-6 lg:mr-10 flex-shrink-0">
          <span className="text-[#e50914] text-2xl lg:text-[28px] font-extrabold tracking-wider" style={{ fontFamily: "'Bebas Neue', 'Helvetica Neue', sans-serif" }}>
            AUTOFLIX
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-5 text-[14px]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#e5e5e5] hover:text-[#b3b3b3] transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden ml-2 text-white"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
        >
          <span className="text-[14px] font-medium text-white flex items-center gap-1">
            Browse
            <svg className={`w-4 h-4 transition-transform ${mobileNavOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>

        {/* Right side controls */}
        <div className="ml-auto flex items-center gap-4">
          <SearchBar />

          {/* Notifications bell */}
          <button className="hidden md:block text-white hover:text-[#b3b3b3] transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          {/* Profile / Sign In */}
          {isSignedIn && user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 group"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-[4px]"
                />
                <svg
                  className={`w-4 h-4 text-white transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-[220px] bg-[#000000]/90 border border-[#333] rounded-[2px] py-2 animate-fade-in">
                  <div className="px-3 py-2 flex items-center gap-3 border-b border-[#333]">
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-[4px]" />
                    <div>
                      <p className="text-white text-sm font-medium">{user.name}</p>
                      <p className="text-[#808080] text-xs">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/my-list"
                    className="block px-3 py-2 text-[13px] text-[#b3b3b3] hover:text-white transition"
                    onClick={() => setProfileOpen(false)}
                  >
                    My List
                  </Link>
                  <Link
                    href="/copilot"
                    className="block px-3 py-2 text-[13px] text-[#b3b3b3] hover:text-white transition"
                    onClick={() => setProfileOpen(false)}
                  >
                    AI Copilot
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-[13px] text-[#b3b3b3] hover:text-white transition border-t border-[#333] mt-1"
                  >
                    Sign out of AutoFlix
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowSignIn(true)}
              className="bg-[#e50914] text-white px-4 py-1.5 rounded-[4px] text-[14px] font-medium hover:bg-[#f40612] transition"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileNavOpen && (
        <div className="lg:hidden bg-[#141414]/95 border-t border-[#333] animate-fade-in">
          <nav className="flex flex-col py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-6 py-3 text-[14px] text-[#e5e5e5] hover:bg-[#333] transition"
                onClick={() => setMobileNavOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
