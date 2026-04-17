import { redirect } from 'next/navigation';
import { calculators } from '@/lib/calculators';

// This route has been migrated to /[slug]/page.tsx.
// Permanently redirect any remaining /calculators/[slug] requests to /{slug}/.
export async function generateStaticParams() {
  return calculators.map(c => ({ slug: c.slug }));
}

export default function CalculatorRedirect({ params }: { params: { slug: string } }) {
  redirect(`/${params.slug}/`);
}
