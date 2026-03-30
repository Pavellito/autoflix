"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/app/lib/auth-context";
import { useLanguage } from "@/app/lib/i18n/context";
import { LOCALE_LABELS, LOCALE_FLAGS, type Locale } from "@/app/lib/i18n/translations";
import SearchBar from "./SearchBar";
import HeaderCarNav from "./HeaderCarNav";

const LOCALES: Locale[] = ["en", "he", "ru", "ar"];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { user, isSignedIn, signOut, setShowSignIn } = useAuth();
  const { locale, setLocale, t } = useLanguage();
  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

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
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navLinks = [
    { href: "/", label: t("nav_home") },
    { href: "/cars", label: t("nav_cars") },
    { href: "/videos", label: t("nav_videos") },
    { href: "/news", label: t("nav_news") },
    { href: "/compare", label: t("nav_compare") },
    { href: "/copilot", label: t("nav_copilot") },
    { href: "/my-list", label: t("nav_my_list") },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[#141414]" : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
      }`}
    >
      <div className="flex items-center px-[4%] h-[68px]">
        {/* Logo */}
        <Link href="/" className="ltr:mr-6 rtl:ml-6 flex-shrink-0">
          <span 
            className="text-[#E50914] text-[32px] font-black tracking-tighter" 
            style={{ 
              fontFamily: 'Impact, "Arial Black", sans-serif',
              textShadow: '0 2px 4px rgba(0,0,0,0.6)',
              transform: 'scaleY(1.15)',
              display: 'inline-block'
            }}
          >
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
        <div className="relative lg:hidden ltr:ml-2 rtl:mr-2">
          <button
            onClick={() => setBrowseOpen(!browseOpen)}
            className="flex items-center gap-1 text-[14px] text-white font-medium"
          >
            {t("nav_browse")}
            <svg className={`w-4 h-4 transition-transform ${browseOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {browseOpen && (
            <div className="absolute top-full ltr:left-0 rtl:right-0 mt-2 bg-[#141414]/95 border border-white/10 rounded py-2 min-w-[200px]">
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
        <div className="flex items-center gap-3 ltr:ml-auto rtl:mr-auto">
          {/* Language Switcher */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-[13px] text-[#e5e5e5] hover:text-white transition-colors px-2 py-1 rounded border border-white/10 hover:border-white/30"
              title="Language"
            >
              <span>{LOCALE_FLAGS[locale]}</span>
              <span className="hidden sm:inline">{LOCALE_LABELS[locale]}</span>
              <svg className={`w-3 h-3 transition-transform ${langOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {langOpen && (
              <div className="absolute top-full ltr:right-0 rtl:left-0 mt-2 bg-[#000]/95 border border-white/15 rounded py-1 min-w-[160px] z-50">
                {LOCALES.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => { setLocale(loc); setLangOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-4 py-2 text-[13px] transition-colors text-start ${
                      locale === loc
                        ? "text-white bg-[#e50914]/20"
                        : "text-[#e5e5e5] hover:bg-white/5"
                    }`}
                  >
                    <span>{LOCALE_FLAGS[loc]}</span>
                    <span>{LOCALE_LABELS[loc]}</span>
                    {locale === loc && (
                      <svg className="w-3.5 h-3.5 ltr:ml-auto rtl:mr-auto text-[#e50914]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <HeaderCarNav />
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
                <div className="absolute ltr:right-0 rtl:left-0 top-full mt-2 w-[220px] bg-[#000000]/95 border border-white/15 rounded py-2">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-[14px] text-white font-medium">{user.name}</p>
                    <p className="text-[12px] text-[#737373]">{user.email}</p>
                  </div>
                  <Link href="/my-list" className="block px-4 py-2 text-[13px] text-[#e5e5e5] hover:underline" onClick={() => setProfileOpen(false)}>
                    {t("nav_my_list")}
                  </Link>
                  <button
                    onClick={() => { signOut(); setProfileOpen(false); }}
                    className="w-full text-start px-4 py-2 text-[13px] text-[#e5e5e5] hover:underline border-t border-white/10"
                  >
                    {t("nav_sign_out")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowSignIn(true)}
              className="bg-[#e50914] text-white text-[14px] font-medium px-4 py-1.5 rounded hover:bg-[#f6121d] transition-colors"
            >
              {t("nav_sign_in")}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
