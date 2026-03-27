import Link from "next/link";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-header-bg backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-accent text-2xl font-bold tracking-wider">
          AUTOFLIX
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
