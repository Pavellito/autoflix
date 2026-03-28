"use client";

import { useState } from "react";
import { useAuth } from "@/app/lib/auth-context";

export default function SignInModal() {
  const { showSignIn, setShowSignIn, signIn } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  if (!showSignIn) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && email.trim()) {
      setStep(2);
    } else if (step === 2 && name.trim()) {
      signIn(name.trim(), email.trim());
      setStep(1);
      setEmail("");
      setName("");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] modal-overlay flex items-center justify-center p-4"
      onClick={() => { setShowSignIn(false); setStep(1); }}
    >
      <div
        className="w-full max-w-[450px] bg-[#000000]/90 rounded-md p-16 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-[32px] font-bold text-white mb-7">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              required
              className="w-full px-5 py-4 rounded bg-[#333] text-white text-base border border-[#333] focus:border-white/40 focus:outline-none placeholder:text-[#8c8c8c]"
            />
          ) : (
            <input
              type="text"
              placeholder="Your display name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
              className="w-full px-5 py-4 rounded bg-[#333] text-white text-base border border-[#333] focus:border-white/40 focus:outline-none placeholder:text-[#8c8c8c]"
            />
          )}

          <button
            type="submit"
            className="w-full py-3 rounded bg-[#e50914] text-white text-base font-bold hover:bg-[#f6121d] transition-colors"
          >
            {step === 1 ? "Next" : "Sign In"}
          </button>
        </form>

        {step === 1 && (
          <p className="text-[#737373] text-[13px] mt-4">
            New to AutoFlix?{" "}
            <span className="text-white cursor-pointer hover:underline">Sign up now</span>.
          </p>
        )}
        {step === 2 && (
          <button
            onClick={() => setStep(1)}
            className="text-[#737373] text-[13px] mt-4 hover:underline"
          >
            &larr; Back to email
          </button>
        )}

        <p className="text-[#8c8c8c] text-[13px] mt-4 leading-relaxed">
          This page is protected by Google reCAPTCHA to ensure you&apos;re not a bot.
        </p>
      </div>
    </div>
  );
}
