import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🧮</span>
              <span className="font-bold text-xl text-white">NumerixHub</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Free online calculators for math, finance, health, and more. Fast, accurate, and easy to use.
            </p>
          </div>

          {/* Calculators */}
          <div>
            <h3 className="text-white font-semibold mb-4">Popular Calculators</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/calculators/mortgage-calculator/" className="hover:text-white transition-colors">Mortgage Calculator</Link></li>
              <li><Link href="/calculators/bmi-calculator/" className="hover:text-white transition-colors">BMI Calculator</Link></li>
              <li><Link href="/calculators/compound-interest-calculator/" className="hover:text-white transition-colors">Compound Interest</Link></li>
              <li><Link href="/calculators/calorie-calculator/" className="hover:text-white transition-colors">Calorie Calculator</Link></li>
              <li><Link href="/calculators/loan-calculator/" className="hover:text-white transition-colors">Loan Calculator</Link></li>
              <li><Link href="/calculators/tip-calculator/" className="hover:text-white transition-colors">Tip Calculator</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/calculators/?category=financial" className="hover:text-white transition-colors">💰 Financial</Link></li>
              <li><Link href="/calculators/?category=health" className="hover:text-white transition-colors">❤️ Health & Fitness</Link></li>
              <li><Link href="/calculators/?category=math" className="hover:text-white transition-colors">🧮 Math</Link></li>
              <li><Link href="/calculators/?category=utility" className="hover:text-white transition-colors">🔧 Utility & Other</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about/" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact/" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy/" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms/" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies/" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>© {currentYear} NumerixHub. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Free online calculators for everyone.</p>
        </div>
      </div>
    </footer>
  );
}
