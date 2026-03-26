"use client";

import { useState } from "react";
import { cars } from "@/app/lib/data";
import Link from "next/link";

export default function QuizPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    region: "il",
    budget: "Medium",
    useCase: "family",
    familySize: "Small",
    mileage: "medium"
  });

  async function getRecommendations() {
    setLoading(true);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  if (results) return <QuizResults results={results} onReset={() => setResults(null)} />;

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase mb-2">
            HELP ME <span className="text-accent underline decoration-accent/30">CHOOSE</span>
          </h1>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Personalized AI Car Advisor</p>
        </header>

        <div className="bg-card-bg/60 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl overflow-hidden relative">
           {/* Step Progress */}
           <div className="flex gap-2 mb-10">
             {[1, 2, 3, 4, 5].map((s) => (
               <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${step >= s ? "bg-accent" : "bg-white/10"}`} />
             ))}
           </div>

           {step === 1 && (
             <div className="animate-in fade-in slide-in-from-right-4 duration-500">
               <h2 className="text-2xl font-bold text-white mb-6">Where are you located?</h2>
               <div className="grid grid-cols-2 gap-4">
                 {[
                   { id: "il", label: "Israel 🇮🇱" },
                   { id: "ru", label: "Russia 🇷🇺" },
                   { id: "us", label: "Global / US 🌍" },
                   { id: "ar", label: "Arabic World 🇸🇦" },
                 ].map((r) => (
                   <button
                     key={r.id}
                     onClick={() => { setFormData({ ...formData, region: r.id }); nextStep(); }}
                     className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-accent/40 text-white font-bold transition-all"
                   >
                     {r.label}
                   </button>
                 ))}
               </div>
             </div>
           )}

           {step === 2 && (
             <div className="animate-in fade-in slide-in-from-right-4 duration-500">
               <h2 className="text-2xl font-bold text-white mb-6">What is your budget?</h2>
               <div className="grid grid-cols-1 gap-4">
                 {[
                   { id: "Low", label: formData.region === 'il' ? "Budget-Friendly (Under ₪150k)" : formData.region === 'ru' ? "Budget-Friendly (Under 3M ₽)" : "Budget-Friendly (Under $35k)" },
                   { id: "Medium", label: formData.region === 'il' ? "Standard (₪150k-₪250k)" : formData.region === 'ru' ? "Standard (3M-5M ₽)" : "Standard ($35k-$55k)" },
                   { id: "High", label: formData.region === 'il' ? "Premium / Luxury (Above ₪250k)" : formData.region === 'ru' ? "Premium / Luxury (Above 5M ₽)" : "Premium / Luxury (Above $55k)" },
                 ].map((b) => (
                   <button
                     key={b.id}
                     onClick={() => { setFormData({ ...formData, budget: b.id }); nextStep(); }}
                     className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-accent/40 text-white font-bold text-left transition-all"
                   >
                     {b.label}
                   </button>
                 ))}
               </div>
               <button onClick={prevStep} className="mt-8 text-gray-500 text-xs uppercase font-bold tracking-widest hover:text-white">← Back</button>
             </div>
           )}

           {step === 3 && (
             <div className="animate-in fade-in slide-in-from-right-4 duration-500">
               <h2 className="text-2xl font-bold text-white mb-6">Primary Use Case?</h2>
               <div className="grid grid-cols-2 gap-4">
                 {[
                   { id: "family", label: "Family SUV" },
                   { id: "commute", label: "City Commute" },
                   { id: "performance", label: "Performance" },
                   { id: "adventure", label: "Adventure / Offroad" },
                 ].map((u) => (
                   <button
                     key={u.id}
                     onClick={() => { setFormData({ ...formData, useCase: u.id }); nextStep(); }}
                     className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-accent/40 text-white font-bold transition-all"
                   >
                     {u.label}
                   </button>
                 ))}
               </div>
               <button onClick={prevStep} className="mt-8 text-gray-500 text-xs uppercase font-bold tracking-widest hover:text-white">← Back</button>
             </div>
           )}

           {step === 4 && (
             <div className="animate-in fade-in slide-in-from-right-4 duration-500">
               <h2 className="text-2xl font-bold text-white mb-6">Family Size?</h2>
               <div className="grid grid-cols-1 gap-4">
                 {[
                   { id: "Single", label: "Single / Couple (2 Seats)" },
                   { id: "Small", label: "Small Family (4-5 Seats)" },
                   { id: "Large", label: "Large Family (5+ Seats)" },
                 ].map((f) => (
                   <button
                     key={f.id}
                     onClick={() => { setFormData({ ...formData, familySize: f.id }); nextStep(); }}
                     className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-accent/40 text-white font-bold transition-all"
                   >
                     {f.label}
                   </button>
                 ))}
               </div>
               <button onClick={prevStep} className="mt-8 text-gray-500 text-xs uppercase font-bold tracking-widest hover:text-white">← Back</button>
             </div>
           )}

           {step === 5 && (
             <div className="animate-in fade-in slide-in-from-right-4 duration-500">
               <h2 className="text-2xl font-bold text-white mb-6">Daily Mileage?</h2>
               <div className="grid grid-cols-1 gap-4">
                 {[
                   { id: "low", label: "Under 30km (Mostly City)" },
                   { id: "medium", label: "30-100km (Mixed)" },
                   { id: "high", label: "Above 100km (Highway Heavy)" },
                 ].map((m) => (
                   <button
                     key={m.id}
                     onClick={() => { setFormData({ ...formData, mileage: m.id }); getRecommendations(); }}
                     className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-accent/40 text-white font-bold transition-all"
                   >
                     {m.label}
                   </button>
                 ))}
               </div>
               <button onClick={prevStep} className="mt-8 text-gray-500 text-xs uppercase font-bold tracking-widest hover:text-white">← Back</button>
             </div>
           )}

           {loading && (
             <div className="absolute inset-0 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500 z-50">
               <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin mb-6" />
               <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">Analyzing Pulse...</h3>
               <p className="text-gray-500 text-sm font-medium">AutoFlix AI is matching your lifestyle against technical performance data...</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

function QuizResults({ results, onReset }: { results: any; onReset: () => void }) {
  const getRegionalPrice = (car: any) => {
    const region = results.region || "us";
    const prices: any = car.prices || {};
    return prices[region] || car.price || "Contact for Price";
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase mb-4">
            YOUR <span className="text-accent underline decoration-accent/30 decoration-4 underline-offset-8">MATCHES</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base font-bold uppercase tracking-widest max-w-2xl mx-auto">
            Our AI analyzed our database of {cars.length} vehicles. Here is the final expert recommendation tailored for {results.region.toUpperCase()}.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {results.recommendations?.map((rec: any, i: number) => {
            const car = cars.find(c => c.id === rec.carId);
            if (!car) return null;
            return (
              <div key={i} className="group flex flex-col bg-card-bg/40 backdrop-blur-3xl rounded-[2rem] border border-white/5 hover:border-accent/30 hover:bg-card-bg/60 transition-all duration-500 shadow-2xl relative overflow-hidden">
                {/* Match Score Badge */}
                <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-md border border-accent/40 px-4 py-2 rounded-full flex items-center gap-2 z-20 shadow-xl group-hover:scale-105 transition-transform">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-accent text-xs font-black uppercase tracking-widest leading-none mt-0.5">
                    {rec.score}% Match
                  </span>
                </div>

                {/* Image Section */}
                <div className="relative w-full aspect-[16/9] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                  <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <div className="absolute bottom-6 left-6 z-20">
                     <span className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] mb-1 block">
                       {car.brand}
                     </span>
                     <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none shadow-black drop-shadow-lg">
                       {car.name.replace(car.brand, "")}
                     </h3>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-grow relative">
                  <div className="absolute top-0 right-8 -translate-y-1/2 z-20 bg-accent text-white px-5 py-2 rounded-full text-sm font-black tracking-wider shadow-[0_10px_30px_rgba(229,9,20,0.4)]">
                    {getRegionalPrice(car)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8 pt-4 border-b border-white/5 pb-8">
                    <div>
                      <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest block mb-1">Range</span>
                      <span className="text-white font-medium text-sm">{car.range || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest block mb-1">Battery</span>
                      <span className="text-white font-medium text-sm">{car.battery || "N/A"}</span>
                    </div>
                  </div>

                  <div className="mb-8 flex-grow">
                    <div className="flex items-start gap-4 bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-accent text-lg">✨</span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed font-medium italic">
                        "{rec.why}"
                      </p>
                    </div>
                  </div>

                  <Link 
                    href={`/cars/${car.id}`}
                    className="w-full relative flex items-center justify-center py-4 bg-white text-black font-black uppercase text-xs tracking-[0.2em] rounded-xl hover:bg-accent hover:text-white transition-all overflow-hidden group/btn shadow-[0_5px_20px_rgba(255,255,255,0.1)]"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Explore Vehicle
                      <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-transparent p-10 rounded-[2rem] border border-accent/20 relative overflow-hidden group mb-12 flex flex-col md:flex-row items-center gap-8 shadow-[0_0_50px_rgba(229,9,20,0.1)]">
           <div className="absolute -top-32 -left-32 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
           <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center flex-shrink-0 relative z-10">
             <span className="text-3xl">💡</span>
           </div>
           <div className="relative z-10">
             <h4 className="text-xs font-black text-accent uppercase tracking-widest mb-2">AutoFlix Expert Regional Tip</h4>
             <p className="text-xl md:text-2xl text-white font-medium italic leading-tight tracking-tight">"{results.expert_tip}"</p>
           </div>
        </div>

        <div className="text-center">
          <button 
            onClick={onReset} 
            className="group flex items-center gap-3 mx-auto text-gray-400 hover:text-accent font-black uppercase text-xs tracking-[0.3em] transition-all px-6 py-3 rounded-full border border-white/5 hover:border-accent/30 bg-card-bg/50"
          >
            <svg className="w-4 h-4 group-hover:-rotate-90 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Restart Engine
          </button>
        </div>
      </div>
    </div>
  );
}
