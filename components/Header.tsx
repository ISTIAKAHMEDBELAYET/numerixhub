'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function readThemePreference() {
  const getCookieValue = (name: string) => {
    const escaped = name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  };

  let stored: string | null = null;
  try {
    stored = localStorage.getItem('darkMode');
  } catch {
    stored = null;
  }

  if (stored !== 'true' && stored !== 'false') {
    const cookieValue = getCookieValue('darkMode');
    if (cookieValue === 'true' || cookieValue === 'false') stored = cookieValue;
    else stored = null;
  }

  return stored;
}

function persistThemePreference(enabled: boolean) {
  const value = enabled ? 'true' : 'false';
  try {
    localStorage.setItem('darkMode', value);
  } catch {
    // Cookie fallback covers environments that block localStorage.
  }
  document.cookie = `darkMode=${value}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const html = document.documentElement;
    const stored = readThemePreference();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = stored === 'true' || (stored === null && prefersDark);

    html.classList.toggle('dark', shouldUseDark);
    setDarkMode(shouldUseDark);
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      persistThemePreference(false);
      setDarkMode(false);
    } else {
      html.classList.add('dark');
      persistThemePreference(true);
      setDarkMode(true);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/calculators/?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };

  const themeToggleIcon = (
    <span className="relative block w-5 h-5">
      <svg
        className={`absolute inset-0 w-5 h-5 text-amber-500 transition-all duration-500 ${darkMode ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-75 opacity-0'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
      </svg>
      <svg
        className={`absolute inset-0 w-5 h-5 text-indigo-500 transition-all duration-500 ${darkMode ? 'rotate-90 scale-75 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>
    </span>
  );

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button - LEFT on mobile, hidden on desktop */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-2xl">🧮</span>
            <span className="font-bold text-xl text-indigo-600 dark:text-indigo-400">NumerixHub</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
              Home
            </Link>
            <Link href="/calculators/" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
              Calculators
            </Link>
            <Link href="/about/" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
              About
            </Link>
            <Link href="/contact/" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* Search + Dark Mode (desktop only) */}
          <div className="hidden md:flex items-center space-x-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search calculators..."
                className="w-48 lg:w-64 px-4 py-2 pl-10 text-sm rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>
            <button
              onClick={toggleDarkMode}
              className="relative p-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300"
              aria-label="Toggle dark mode"
            >
              {themeToggleIcon}
            </button>
          </div>

          {/* Dark mode toggle - RIGHT on mobile, hidden on desktop */}
          <button
            onClick={toggleDarkMode}
            className="md:hidden p-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300"
            aria-label="Toggle dark mode"
          >
            {themeToggleIcon}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-4 space-y-3">
          <form onSubmit={handleSearch} className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search calculators..."
              className="w-full px-4 py-2 pl-10 text-sm rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </form>
          <Link href="/" className="block py-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 font-medium" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/calculators/" className="block py-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 font-medium" onClick={() => setMenuOpen(false)}>Calculators</Link>
          <Link href="/about/" className="block py-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 font-medium" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/contact/" className="block py-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 font-medium" onClick={() => setMenuOpen(false)}>Contact</Link>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
            <Link href="/privacy/" className="block py-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 font-medium" onClick={() => setMenuOpen(false)}>Privacy Policy</Link>
            <Link href="/terms/" className="block py-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 font-medium" onClick={() => setMenuOpen(false)}>Terms of Service</Link>
            <Link href="/cookies/" className="block py-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 font-medium" onClick={() => setMenuOpen(false)}>Cookie Policy</Link>
          </div>
        </div>
      )}
    </header>
  );
}
