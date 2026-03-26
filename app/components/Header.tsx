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
          <Link href="/search" className="text-white hover:text-accent transition">
            Search
          </Link>
          <span className="text-gray-500 cursor-not-allowed">My List</span>
          <SearchBar />
        </nav>
      </div>
    </header>
  );
}
