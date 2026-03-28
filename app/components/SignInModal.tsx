"use client";

import { useState } from "react";
import { useAuth } from "@/app/lib/auth-context";

export default function SignInModal() {
  const { showSignIn, setShowSignIn, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState<"email" | "name">("email");

  if (!showSignIn) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step === "email") {
      if (!email.trim() || !email.includes("@")) return;
      setStep("name");
    } else {
      if (!name.trim()) return;
      signIn(email.trim(), name.trim());
      setEmail("");
      setName("");
      setStep("email");
    }
  }

  function handleClose() {
    setShowSignIn(false);
    setEmail("");
    setName("");
    setStep("email");
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center modal-overlay"
      onClick={handleClose}
    >
      <div
        className="relative bg-[#000000]/75 rounded-md w-full max-w-[450px] mx-4 p-16 animate-fade-in"
        style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white transition"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h1 className="text-[32px] font-bold text-white mb-7">Sign In</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {step === "email" ? (
            <>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  autoFocus
                  className="w-full bg-[#333] text-white rounded-[4px] px-4 py-4 text-base border border-[#333] focus:border-white/50 transition placeholder-[#8c8c8c]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#e50914] text-white rounded-[4px] py-3 text-base font-bold hover:bg-[#f40612] transition mt-2"
              >
                Next
              </button>
            </>
          ) : (
            <>
              <p className="text-[#737373] text-sm mb-1">
                Signing in as <span className="text-white">{email}</span>
              </p>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your display name"
                  autoFocus
                  className="w-full bg-[#333] text-white rounded-[4px] px-4 py-4 text-base border border-[#333] focus:border-white/50 transition placeholder-[#8c8c8c]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#e50914] text-white rounded-[4px] py-3 text-base font-bold hover:bg-[#f40612] transition mt-2"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setStep("email")}
                className="text-[#737373] hover:text-white text-sm transition text-left"
              >
                Back
              </button>
            </>
          )}
        </form>

        <div className="mt-12">
          <p className="text-[#737373] text-base">
            New to AutoFlix?{" "}
            <span className="text-white hover:underline cursor-pointer">
              Sign up now
            </span>
            .
          </p>
        </div>

        <p className="text-[#8c8c8c] text-[13px] mt-3 leading-relaxed">
          This page is protected by Google reCAPTCHA to ensure you&apos;re not a
          bot.
        </p>
      </div>
    </div>
  );
}
