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
                   { id: "Low", label: "Budget-Friendly (Under 150k / $35k)" },
                   { id: "Medium", label: "Standard (150k-250k / $35k-$55k)" },
                   { id: "High", label: "Premium / Luxury (Above 250k / $55k)" },
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
  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase mb-2">
            YOUR <span className="text-accent">MATCHES</span>
          </h2>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest max-w-xl mx-auto">
            Our AI analyzed {cars.length} vehicles. Here is the final expert recommendation.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {results.recommendations.map((rec: any, i: number) => {
            const car = cars.find(c => c.id === rec.carId);
            if (!car) return null;
            return (
              <div key={i} className="group bg-card-bg/60 rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
                <div className="absolute top-4 right-4 bg-accent/20 border border-accent/40 px-3 py-1 rounded-full text-accent text-[10px] font-black uppercase tracking-widest z-10">
                  {rec.score}% Match
                </div>
                <img src={car.image} alt={car.name} className="w-full aspect-[16/9] object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="p-8">
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">{car.name}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed font-medium italic mb-6">"{rec.why}"</p>
                  <Link 
                    href={`/cars/${car.id}`}
                    className="flex items-center justify-center py-3 bg-white text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-full hover:bg-accent hover:text-white transition-all shadow-xl"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-accent/5 p-8 rounded-3xl border border-accent/20 text-center relative overflow-hidden group mb-12">
           <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
           <h4 className="text-[10px] font-black text-accent uppercase tracking-widest mb-3">Expert Regional Tip</h4>
           <p className="text-xl text-white font-bold italic leading-tight tracking-tight">"{results.expert_tip}"</p>
        </div>

        <div className="text-center">
          <button onClick={onReset} className="text-gray-500 hover:text-white text-xs font-black uppercase tracking-[0.3em] transition-all">
            Restart Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
