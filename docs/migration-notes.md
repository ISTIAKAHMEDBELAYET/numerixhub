# URL Structure Migration Notes

## Summary

Calculator pages have been moved from `/calculators/<slug>/` to top-level `/<slug>/`.

**Date:** 2026-04-17  
**Type:** Breaking URL change (pages were not yet indexed)

---

## Changed Routes

All calculator pages previously under `/calculators/<slug>/` now live at `/<slug>/`.

| Old URL | New URL |
|---|---|
| `/calculators/mortgage-calculator/` | `/mortgage-calculator/` |
| `/calculators/loan-calculator/` | `/loan-calculator/` |
| `/calculators/bmi-calculator/` | `/bmi-calculator/` |
| `/calculators/age-calculator/` | `/age-calculator/` |
| `/calculators/compound-interest-calculator/` | `/compound-interest-calculator/` |
| `/calculators/calorie-calculator/` | `/calorie-calculator/` |
| `/calculators/tip-calculator/` | `/tip-calculator/` |
| `/calculators/<any-other-slug>/` | `/<any-other-slug>/` |

The full list of calculator slugs is defined in `lib/calculators.ts`.

---

## Unchanged Routes

The following routes are **unchanged**:

| Route | Purpose |
|---|---|
| `/` | Homepage |
| `/calculators/` | Calculator listing/search page |
| `/about/` | About page |
| `/contact/` | Contact page |
| `/privacy/` | Privacy policy |
| `/terms/` | Terms of service |
| `/cookies/` | Cookie policy |

---

## Files Modified

| File | Change |
|---|---|
| `app/[slug]/page.tsx` | **New** — top-level dynamic route for all calculator pages |
| `app/calculators/[slug]/page.tsx` | **Deleted** — old nested route removed |
| `components/CalculatorCard.tsx` | Updated link href from `/calculators/${slug}/` to `/${slug}/` |
| `components/Footer.tsx` | Updated popular-calculator links in footer |
| `app/page.tsx` | Updated hardcoded mortgage-calculator link on homepage |
| `app/sitemap.ts` | Updated calculator page URLs in sitemap |

---

## Route Conflict Prevention

Unknown slugs return HTTP 404 via the `notFound()` call in `app/[slug]/page.tsx`.  
Only slugs defined in `lib/calculators.ts` are pre-rendered via `generateStaticParams()`.  
Existing top-level pages (`/about`, `/calculators`, `/contact`, `/privacy`, `/terms`, `/cookies`) are not affected — none of the calculator slugs match these paths.

---

## No Redirects

Per project requirements, no redirects were created. Pages were not yet indexed by search engines.
