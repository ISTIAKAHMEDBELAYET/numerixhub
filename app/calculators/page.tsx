'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CalculatorCard from '@/components/CalculatorCard';
import { calculators } from '@/lib/calculators';
import { categories } from '@/lib/categories';

function CalculatorsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const cat = searchParams.get('category') || 'all';
    setSearch(q);
    setActiveCategory(cat);
  }, [searchParams]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    const cat = activeCategory !== 'all' ? `&category=${activeCategory}` : '';
    if (value.trim()) {
      router.push(`/calculators/?q=${encodeURIComponent(value.trim())}${cat}`);
    } else {
      router.push(`/calculators/${cat ? `?category=${activeCategory}` : ''}`);
    }
  }, [activeCategory, router]);

  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
    const q = search ? `?q=${encodeURIComponent(search)}` : '';
    if (category !== 'all' && search) {
      router.push(`/calculators/?q=${encodeURIComponent(search)}&category=${category}`);
    } else if (category !== 'all') {
      router.push(`/calculators/?category=${category}`);
    } else if (search) {
      router.push(`/calculators/?q=${encodeURIComponent(search)}`);
    } else {
      router.push('/calculators/');
    }
  }, [search, router]);

  const q = search.toLowerCase().trim();

  const getRelevanceScore = (calc: (typeof calculators)[number], query: string) => {
    if (!query) return 0;

    const name = calc.name.toLowerCase();
    const description = calc.description.toLowerCase();
    const slug = calc.slug.toLowerCase();
    const keywords = calc.keywords.map(k => k.toLowerCase());
    const words = name.split(/\s+/);
    const firstWord = query.split(/\s+/)[0];

    let score = 0;

    // Highest priority: exact and prefix matches in title.
    if (name === query) score += 2000;
    if (name.startsWith(query)) score += 1600;
    if (words.some(w => w.startsWith(query))) score += 1300;
    if (firstWord && words.some(w => w.startsWith(firstWord))) score += 1000;
    if (name.includes(query)) score += 700;

    // Slug is also important for direct calculator intent.
    if (slug === query.replace(/\s+/g, '-')) score += 900;
    if (slug.startsWith(query.replace(/\s+/g, '-'))) score += 750;
    if (slug.includes(query.replace(/\s+/g, '-'))) score += 500;

    // Keyword and description are secondary signals.
    if (keywords.some(k => k === query)) score += 600;
    if (keywords.some(k => k.startsWith(query))) score += 450;
    if (keywords.some(k => k.includes(query) || query.includes(k))) score += 300;
    if (description.startsWith(query)) score += 180;
    if (description.includes(query)) score += 90;

    return score;
  };

  const filtered = calculators
    .filter(calc => activeCategory === 'all' || calc.category === activeCategory)
    .map(calc => ({ calc, score: getRelevanceScore(calc, q) }))
    .filter(item => !q || item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.calc.name.localeCompare(b.calc.name);
    })
    .map(item => item.calc);

  const categoryCountMap = Object.fromEntries(
    categories.map(cat => [cat.id, calculators.filter(c => c.category === cat.id).length])
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">All Calculators</h1>
            <p className="text-white/80 text-lg">200+ free calculators for every need</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Search + Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={e => handleSearchChange(e.target.value)}
                placeholder="Search calculators..."
                className="w-full px-5 py-3 pl-12 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              >
                All ({calculators.length})
              </button>
              {categories.map(cat => {
                const count = calculators.filter(c => c.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                  >
                    {cat.emoji} {cat.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Showing {filtered.length} calculator{filtered.length !== 1 ? 's' : ''}
            {search && ` for "${search}"`}
            {activeCategory !== 'all' && ` in ${categories.find(c => c.id === activeCategory)?.name}`}
          </p>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map(calc => (
                <CalculatorCard key={calc.slug} calculator={calc} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No calculators found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try a different search term or browse all categories.</p>
              <button
                onClick={() => { handleSearchChange(''); handleCategoryChange('all'); }}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CalculatorsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-xl text-gray-500">Loading...</div></div>}>
      <CalculatorsContent />
    </Suspense>
  );
}
