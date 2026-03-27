import Link from "next/link";
import SearchBar from "./SearchBar";
import { Zap } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-header-bg backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 group-hover:bg-blue-500 transition-colors">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">
              Auto<span className="text-blue-500">Flix</span>
            </span>
            <div className="hidden sm:block ml-2 px-1.5 py-0.5 text-[8px] font-bold text-gray-500 border border-gray-800 rounded uppercase tracking-widest">
              Intelligence
            </div>
          </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-white hover:text-accent transition">
            Home
          </Link>
          <Link href="/cars" className="text-white hover:text-accent transition">
            Cars
          </Link>
          <Link href="/news" className="text-white hover:text-accent transition">
            News
          </Link>
          <Link href="/quiz" className="text-white hover:text-accent transition font-bold">
            Advisor
          </Link>
          <Link href="/compare" className="text-white hover:text-accent transition">
            Compare
          </Link>
          <Link href="/search" className="text-white hover:text-accent transition">
            Search
          </Link>
          <Link href="/my-list" className="text-white hover:text-accent transition">
            My List
          </Link>
          <div className="w-[1px] h-4 bg-white/10" />
          <button className="bg-white text-black px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-lg active:scale-95">
             Sign In
          </button>
          <SearchBar />
        </nav>
      </div>
    </header>
  );
}
