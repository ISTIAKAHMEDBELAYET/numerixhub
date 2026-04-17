import Link from 'next/link';
import FAQAccordion from '@/components/FAQAccordion';
import type { Calculator } from '@/lib/calculators';
import { calculators } from '@/lib/calculators';
import type { CalculatorSEO } from '@/lib/calculator-seo';

interface Props {
  calc: Calculator;
  seo: CalculatorSEO;
}

export default function CalculatorSEOContent({ calc, seo }: Props) {
  // Resolve related calculators: use explicit slugs if present, else pick from same category
  const relatedSlugs =
    seo.relatedSlugs ??
    calculators
      .filter((c) => c.category === calc.category && c.slug !== calc.slug)
      .slice(0, 4)
      .map((c) => c.slug);

  const relatedCalcs = relatedSlugs
    .map((slug) => calculators.find((c) => c.slug === slug))
    .filter(Boolean) as Calculator[];

  return (
    <div className="mt-12 space-y-12">
      {/* How to Use */}
      {seo.howTo && seo.howTo.length > 0 && (
        <section aria-labelledby="how-to-heading">
          <h2
            id="how-to-heading"
            className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
          >
            How to Use the {calc.name}
          </h2>
          <ol className="space-y-3">
            {seo.howTo.map((step, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-300 pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Formula */}
      {seo.formula && (
        <section aria-labelledby="formula-heading">
          <h2
            id="formula-heading"
            className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Formula
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono leading-relaxed">
              {seo.formula}
            </pre>
          </div>
        </section>
      )}

      {/* Examples */}
      {seo.examples && seo.examples.length > 0 && (
        <section aria-labelledby="examples-heading">
          <h2
            id="examples-heading"
            className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Examples
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {seo.examples.map((ex, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5"
              >
                <div className="font-semibold text-gray-900 dark:text-white mb-2">
                  {ex.title}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {ex.description}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQs */}
      {seo.faqs && seo.faqs.length > 0 && (
        <section aria-labelledby="faq-heading">
          <h2
            id="faq-heading"
            className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Frequently Asked Questions
          </h2>
          <FAQAccordion items={seo.faqs} />
        </section>
      )}

      {/* Related Calculators */}
      {relatedCalcs.length > 0 && (
        <section aria-labelledby="related-heading">
          <h2
            id="related-heading"
            className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Related Calculators
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {relatedCalcs.map((related) => (
              <Link
                key={related.slug}
                href={`/calculators/${related.slug}/`}
                className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-sm transition-all group"
              >
                <span className="text-2xl">{related.emoji}</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 leading-tight">
                  {related.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
