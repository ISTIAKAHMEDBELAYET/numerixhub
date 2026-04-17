import Link from 'next/link';
import type { Calculator } from '@/lib/calculators';

interface CalculatorCardProps {
  calculator: Calculator;
}

export default function CalculatorCard({ calculator }: CalculatorCardProps) {
  const categoryColors: Record<string, string> = {
    financial: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    health: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    math: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    utility: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  };

  const categoryLabels: Record<string, string> = {
    financial: 'Financial',
    health: 'Health',
    math: 'Math',
    utility: 'Utility',
  };

  return (
    <Link href={`/${calculator.slug}/`} className="group block">
      <div className="h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-200 hover:-translate-y-1">
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl">{calculator.emoji}</span>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColors[calculator.category] || 'bg-gray-100 text-gray-600'}`}>
            {categoryLabels[calculator.category] || calculator.category}
          </span>
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
          {calculator.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
          {calculator.description}
        </p>
      </div>
    </Link>
  );
}
