import VehicleImage from "@/app/components/VehicleImage";

export default function CarCard({ car }: { car: Car }) {
  return (
    <Link
      href={`/cars/${car.id}`}
      className="group flex flex-col bg-card-bg rounded-lg overflow-hidden border border-white/5 hover:border-accent/40 hover:shadow-[0_0_15px_rgba(229,9,20,0.15)] transition-all duration-300 transform hover:-translate-y-1"
    >
      <VehicleImage 
        src={car.image} 
        alt={car.name} 
        aspectRatio="aspect-[16/10]"
        className="group-hover:scale-105" 
      />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Absolute tags */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
            {car.brand}
          </span>
          <span className="bg-accent/80 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
            {car.type}
          </span>
        </div>
        
        <div className="absolute bottom-0 p-4 w-full">
          <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">{car.name}</h3>
          <p className="text-sm text-green-400 font-semibold">{car.price}</p>
        </div>
      </div>
      
      <div className="p-4 flex items-center justify-between border-t border-white/5">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Range</span>
          <span className="text-sm font-medium text-gray-200">{car.range || "N/A"}</span>
        </div>
        <div className="w-[1px] h-8 bg-white/10" />
        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Battery</span>
          <span className="text-sm font-medium text-gray-200">{car.battery || "N/A"}</span>
        </div>
      </div>
    </Link>
  );
}
