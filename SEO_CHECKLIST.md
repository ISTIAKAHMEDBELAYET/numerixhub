# SEO Checklist for NumerixHub Calculator Pages

## What's implemented

Every calculator page now has:
- ✅ Unique `<title>` and `<meta description>` (via `generateMetadata`)
- ✅ Correct `<link rel="canonical">` trailing-slash URL
- ✅ OpenGraph + Twitter Card tags
- ✅ `<h1>` heading (calc name with emoji, above the tool)
- ✅ Intro paragraph (above the tool)
- ✅ **How to Use** section with numbered steps
- ✅ **Formula** section (where applicable)
- ✅ **Examples** section (where applicable)
- ✅ **Frequently Asked Questions** (interactive accordion)
- ✅ **Related Calculators** links (explicit list or same-category auto-selection)
- ✅ Schema.org `SoftwareApplication` JSON-LD
- ✅ Schema.org `BreadcrumbList` JSON-LD
- ✅ Schema.org `FAQPage` JSON-LD (injected automatically when FAQs are present)
- ✅ Google Search Console site verification meta tag (in root layout)

---

## Calculators with full custom SEO content

| Calculator | Slug | Custom intro | How-to | Formula | Examples | FAQs (4) | Related links |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|
| BMI Calculator | `bmi-calculator` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Mortgage Calculator | `mortgage-calculator` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Loan Calculator | `loan-calculator` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Compound Interest Calculator | `compound-interest-calculator` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Calorie Calculator | `calorie-calculator` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Scientific Calculator | `scientific-calculator` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Age Calculator | `age-calculator` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tip Calculator | `tip-calculator` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Percentage Calculator | `percentage-calculator` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Body Fat Calculator | `body-fat-calculator` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Salary Calculator | `salary-calculator` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Date Calculator | `date-calculator` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Calculators with generic auto-generated SEO content

All remaining ~200 calculators use auto-generated content (see `lib/calculator-seo.ts → generateFallbackSEO`):

- ✅ Unique intro derived from the calculator's name + description
- ✅ Category-appropriate how-to steps (4 generic steps)
- ✅ 4 category-appropriate FAQs (financial / health / math / utility buckets)
- ✅ Related calculators from the same category (auto-selected, 4 items)
- ❌ No custom formula (too calculator-specific to auto-generate accurately)
- ❌ No worked examples (too calculator-specific)

**To upgrade any calculator to full custom content:** add an entry to the `seoData` record in `lib/calculator-seo.ts` matching the calculator's slug.

---

## Remaining pages to add full custom content (priority order)

### High-traffic financial
- [ ] `interest-calculator`
- [ ] `savings-calculator`
- [ ] `retirement-calculator`
- [ ] `income-tax-calculator`
- [ ] `amortization-calculator`
- [ ] `investment-calculator`
- [ ] `credit-card-calculator`
- [ ] `auto-loan-calculator`
- [ ] `student-loan-calculator`
- [ ] `debt-payoff-calculator`
- [ ] `401k-calculator`
- [ ] `sales-tax-calculator`
- [ ] `roth-ira-calculator`
- [ ] `budget-calculator`
- [ ] `roi-calculator`

### High-traffic health
- [ ] `bmr-calculator`
- [ ] `macro-calculator`
- [ ] `ideal-weight-calculator`
- [ ] `tdee-calculator`
- [ ] `pregnancy-calculator`
- [ ] `due-date-calculator`
- [ ] `pace-calculator`

### High-traffic math
- [ ] `fraction-calculator`
- [ ] `triangle-calculator`
- [ ] `quadratic-formula-calculator`
- [ ] `standard-deviation-calculator`
- [ ] `statistics-calculator`
- [ ] `probability-calculator`
- [ ] `pythagorean-theorem-calculator`

### High-traffic utility
- [ ] `gpa-calculator`
- [ ] `grade-calculator`
- [ ] `fuel-cost-calculator`
- [ ] `time-calculator`
- [ ] `hours-calculator`
- [ ] `conversion-calculator`
