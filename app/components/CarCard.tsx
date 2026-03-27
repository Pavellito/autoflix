import Link from "next/link";
import { Car } from "@/app/lib/data";
import VehicleImage from "@/app/components/VehicleImage";

export default function CarCard({ car }: { car: Car }) {
  return (
    <Link
      href={`/cars/${car.id}`}
      className="group flex flex-col bg-card-bg rounded-2xl overflow-hidden border border-white/5 hover:border-accent/40 hover:shadow-[0_0_15px_rgba(229,9,20,0.15)] transition-all duration-300 transform hover:-translate-y-1"
    >
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
  );
}
