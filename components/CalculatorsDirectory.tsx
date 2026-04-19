'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import CalculatorCard from '@/components/CalculatorCard';
import { calculators } from '@/lib/calculators';
import { categories } from '@/lib/categories';

const stopWords = new Set(['calculator', 'calculators', 'calc', 'tool', 'tools', 'online', 'free']);

const normalize = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();

function getRelevanceScore(calc: (typeof calculators)[number], query: string) {
  if (!query) return 0;

  const normalizedQuery = normalize(query);
  const rawTokens = normalizedQuery.split(' ').filter(Boolean);
  const meaningfulTokens = rawTokens.filter(token => !stopWords.has(token));
  const tokens = meaningfulTokens.length > 0 ? meaningfulTokens : rawTokens;
  if (tokens.length === 0) return 0;

  const name = normalize(calc.name);
  const nameWords = name.split(' ').filter(Boolean);

  const allTokensMatchInTitle = tokens.every(token => nameWords.some(word => word.startsWith(token)));
  if (!allTokensMatchInTitle) return 0;

  let score = 0;
  let matchedCount = 0;

  for (const token of tokens) {
    let tokenScore = 0;

    if (nameWords.includes(token)) tokenScore = Math.max(tokenScore, 650);
    if (nameWords.some(w => w.startsWith(token))) tokenScore = Math.max(tokenScore, 520);
    if (name.includes(token)) tokenScore = Math.max(tokenScore, 320);

    if (tokenScore > 0) {
      matchedCount += 1;
      score += tokenScore;
    }
  }

  if (matchedCount < tokens.length) return 0;

  const firstToken = tokens[0];
  if (name === normalizedQuery) score += 1800;
  if (name.startsWith(normalizedQuery)) score += 1400;
  if (firstToken && nameWords[0]?.startsWith(firstToken)) score += 500;
  if (firstToken && nameWords[0] === firstToken) score += 800;

  return score;
}

export default function CalculatorsDirectory() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const quickLinksByCategory = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      links: calculators.filter((c) => c.category === category.id).slice(0, 8),
    }));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return calculators
      .filter(calc => activeCategory === 'all' || calc.category === activeCategory)
      .map(calc => ({ calc, score: getRelevanceScore(calc, q) }))
      .filter(item => !q || item.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.calc.name.localeCompare(b.calc.name);
      })
      .map(item => item.calc);
  }, [activeCategory, search]);

  const selectedCategoryName = categories.find(c => c.id === activeCategory)?.name;

  return (
    <>
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">All Online Calculators</h1>
          <p className="text-white/80 text-lg">200+ free calculator tools for finance, health, math, and utility needs</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="relative mb-8">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search calculators..."
            className="w-full px-5 py-3 pl-12 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
          >
            All ({calculators.length})
          </button>
          {categories.map(cat => {
            const count = calculators.filter(c => c.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              >
                {cat.emoji} {cat.name} ({count})
              </button>
            );
          })}
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Showing {filtered.length} calculator{filtered.length !== 1 ? 's' : ''}
          {search && ` for "${search}"`}
          {activeCategory !== 'all' && selectedCategoryName && ` in ${selectedCategoryName}`}
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map(calc => (
              <CalculatorCard key={calc.slug} calculator={calc} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No calculators found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Try a different search term or browse all categories.</p>
            <Link
              href="/calculators/"
              className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
              onClick={event => {
                event.preventDefault();
                setSearch('');
                setActiveCategory('all');
              }}
            >
              Clear Filters
            </Link>
          </div>
        )}

        <section className="mt-14 pt-10 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Popular Calculator Links by Category</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Quick links to high-demand tools to help search engines and users discover key calculator pages faster.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {quickLinksByCategory.map((category) => (
              <div key={category.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{category.emoji} {category.name}</h3>
                <ul className="space-y-2 text-sm">
                  {category.links.map((calc) => (
                    <li key={calc.slug}>
                      <Link href={`/${calc.slug}/`} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                        {calc.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
