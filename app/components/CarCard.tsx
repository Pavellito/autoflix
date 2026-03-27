import Link from "next/link";
import { Car } from "@/app/lib/data";
import VehicleImage from "@/app/components/VehicleImage";
import { useFavorites } from "@/app/lib/favorites-context";

export default function CarCard({ car }: { car: Car }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(car.id);

  return (
    <div className="relative group flex flex-col bg-card-bg rounded-2xl overflow-hidden border border-white/5 hover:border-accent/40 hover:shadow-[0_0_15px_rgba(229,9,20,0.15)] transition-all duration-300 transform hover:-translate-y-1">
      {/* Heart Button */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(car.id);
        }}
        className={`absolute top-3 left-3 z-30 p-2 rounded-full backdrop-blur-md border transition-all duration-300 active:scale-75 ${
          active 
            ? "bg-accent border-accent text-white shadow-[0_0_15px_rgba(229,9,20,0.5)]" 
            : "bg-black/40 border-white/10 text-gray-400 hover:text-white"
        }`}
      >
        <svg className={`w-4 h-4 ${active ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <Link href={`/cars/${car.id}`} className="flex flex-col h-full">
      <div className="relative aspect-[16/10] overflow-hidden">
        <VehicleImage 
          src={car.image} 
          alt={car.name} 
          aspectRatio="aspect-full"
          className="group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Absolute tags */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
          <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-[0.2em] border border-white/10">
            {car.brand}
          </span>
          <span className="bg-accent/90 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-[0.2em] shadow-lg">
            {car.type}
          </span>
          {car.relatedVideoIds && car.relatedVideoIds.length > 0 && (
            <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-[0.2em] flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm14 7V7H4v6h12z"/><path fillRule="evenodd" d="M10 8a1 1 0 01.553.894l2 1a1 1 0 010 1.788l-2 1A1 1 0 019 11V9a1 1 0 011-1z" clipRule="evenodd"/></svg>
              Review
            </span>
          )}
        </div>
        
        <div className="absolute bottom-0 p-4 w-full">
          <h3 className="text-xl font-black text-white mb-0.5 drop-shadow-lg uppercase italic tracking-tighter">{car.name}</h3>
          <p className="text-sm text-accent font-bold">{car.price}</p>
        </div>
      </div>
      
      <div className="p-4 flex items-center justify-between bg-white/[0.02] border-t border-white/5">
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-black mb-0.5">Range</span>
          <span className="text-sm font-bold text-gray-200">{car.range || "N/A"}</span>
        </div>
        <div className="w-[1px] h-6 bg-white/10" />
        <div className="flex flex-col items-end">
          <span className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-black mb-0.5">Battery</span>
          <span className="text-sm font-bold text-gray-200">{car.battery || "N/A"}</span>
        </div>
      </div>
      </Link>
    </div>
  );
}
