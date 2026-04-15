export interface Category {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  bgColor: string;
}

export const categories: Category[] = [
  {
    id: 'financial',
    name: 'Financial',
    emoji: '💰',
    description: 'Mortgage, loans, investments, taxes, retirement',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    id: 'health',
    name: 'Health & Fitness',
    emoji: '❤️',
    description: 'BMI, calories, fitness, pregnancy, nutrition',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
  },
  {
    id: 'math',
    name: 'Math',
    emoji: '🧮',
    description: 'Scientific, fractions, statistics, geometry',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    id: 'utility',
    name: 'Utility & Other',
    emoji: '🔧',
    description: 'Date, time, conversion, construction, tools',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
  },
];
