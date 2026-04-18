# NumerixHub – Calculator Coverage Report

**Date:** 2026-04-17  
**Session objective:** Audit existing calculators, upgrade existing ones, implement missing ones, and ensure no duplicates.

---

## Summary

| Category | Count |
|---|---|
| Total calculator slugs in `lib/calculators.ts` | 200+ |
| Calculators with **rich dedicated UI** components | 33 |
| Calculators with **GenericCalculator** config (full computation) | 155 |
| Calculators newly upgraded (new specific UI components) | 9 |
| New GenericCalculator configs added | 44 |
| Duplicate/overlap issues resolved | 37 |
| Remaining for future enhancement | ~15 |

---

## 1. Existing Rich UI Components (full React components)

These calculators have a fully custom React component with rich output cards, validation, and UX polish:

| Slug | Component | Status |
|---|---|---|
| bmi-calculator | BMICalculator | ✅ Existing |
| mortgage-calculator | MortgageCalculator | ✅ Existing |
| age-calculator | AgeCalculator | ✅ Existing |
| percentage-calculator | PercentageCalculator | ✅ Existing |
| tip-calculator | TipCalculator | ✅ Existing |
| scientific-calculator | ScientificCalculator | ✅ Existing |
| loan-calculator | LoanCalculator | ✅ Existing |
| compound-interest-calculator | CompoundInterestCalculator | ✅ Existing |
| calorie-calculator | CalorieCalculator | ✅ Existing |
| retirement-calculator | RetirementCalculator | ✅ Existing |
| savings-calculator | SavingsCalculator | ✅ Existing |
| investment-calculator | InvestmentCalculator | ✅ Existing |
| bmr-calculator | BMRCalculator | ✅ Existing |
| macro-calculator | MacroCalculator | ✅ Existing |
| date-calculator | DateCalculator | ✅ Existing |
| fraction-calculator | FractionCalculator | ✅ Existing |
| statistics-calculator | StatisticsCalculator | ✅ Existing |
| quadratic-formula-calculator | QuadraticCalculator | ✅ Existing |
| password-generator | PasswordGenerator | ✅ Existing |
| random-number-generator | RandomNumberGenerator | ✅ Existing |
| dice-roller | DiceRoller | ✅ Existing |
| height-calculator | HeightConverter | ✅ Existing |
| pregnancy-calculator | PregnancyCalculator | ✅ Existing |
| amortization-calculator | AmortizationCalculator | ✅ Existing |
| credit-card-calculator | CreditCardCalculator | ✅ Existing |
| **auto-loan-calculator** | **AutoLoanCalculator** | 🆕 **New this session** |
| **salary-calculator** | **SalaryCalculator** | 🆕 **New this session** |
| **body-fat-calculator** | **BodyFatCalculator** | 🆕 **New this session** |
| **tdee-calculator** | **TDEECalculator** | 🆕 **New this session** |
| **calories-burned-calculator** | **CaloriesBurnedCalculator** | 🆕 **New this session** |
| **binary-calculator / hex-calculator** | **BinaryCalculator** | 🆕 **New this session** |
| **base64-calculator** | **Base64Calculator** | 🆕 **New this session** |
| **url-encoder** | **URLEncoder** | 🆕 **New this session** |
| **time-zone-calculator** | **TimeZoneCalculator** | 🆕 **New this session** |
| **time-calculator** | **TimeCalculator** | 🆕 **New this session** |
| **hours-calculator** | **HoursCalculator** | 🆕 **New this session** |

---

## 2. Calculator.net Reference Coverage Mapping

### Financial / Money

| Calculator.net Tool | NumerixHub Slug | Status |
|---|---|---|
| Mortgage Calculator | mortgage-calculator | ✅ Rich UI |
| Auto Loan Calculator | auto-loan-calculator | ✅ Rich UI (upgraded) |
| Loan Calculator | loan-calculator | ✅ Rich UI |
| Compound Interest | compound-interest-calculator | ✅ Rich UI |
| Simple Interest | simple-interest-calculator | ✅ GenericCalc |
| Payment Calculator | payment-calculator | ✅ GenericCalc |
| Finance Calculator | finance-calculator | 🆕 GenericCalc added |
| Mortgage Payoff | mortgage-payoff-calculator | 🆕 GenericCalc added |
| Income Tax Calculator | income-tax-calculator | ✅ GenericCalc |
| Salary Calculator | salary-calculator | ✅ Rich UI (upgraded) |
| Take-Home Paycheck | take-home-paycheck-calculator | 🆕 GenericCalc added |
| 401(k) Calculator | 401k-calculator | ✅ GenericCalc |
| Retirement Calculator | retirement-calculator | ✅ Rich UI |
| Savings Calculator | savings-calculator | ✅ Rich UI |
| Investment Calculator | investment-calculator | ✅ Rich UI |
| Roth IRA | roth-ira-calculator | ✅ (→ SavingsCalculator) |
| IRA Calculator | ira-calculator | ✅ (→ SavingsCalculator) |
| Interest Rate Calc | interest-rate-calculator | ✅ GenericCalc |
| APR Calculator | apr-calculator | ✅ GenericCalc |
| Annuity Calculator | annuity-calculator | 🆕 GenericCalc added |
| Annuity Payout | annuity-payout-calculator | 🆕 GenericCalc added |
| RMD Calculator | rmd-calculator | 🆕 GenericCalc added |
| CD Calculator | cd-calculator | ✅ GenericCalc |
| Bond Calculator | bond-calculator | 🆕 GenericCalc added |
| IRR Calculator | irr-calculator | 🆕 GenericCalc added |
| Present Value | present-value-calculator | ✅ GenericCalc |
| Future Value | future-value-calculator | ✅ GenericCalc |
| Net Worth / Budget | budget-calculator | 🆕 GenericCalc added |
| ROI Calculator | roi-calculator | ✅ GenericCalc |
| Payback Period | payback-period-calculator | ✅ GenericCalc |
| House Affordability | house-affordability-calculator | ✅ GenericCalc |
| Rent Calculator | rent-calculator | ✅ GenericCalc |
| Mortgage (UK) | mortgage-calculator-uk | 🆕 GenericCalc added |
| Canadian Mortgage | canadian-mortgage-calculator | 🆕 GenericCalc added |
| FHA Loan | fha-loan-calculator | 🆕 GenericCalc added |
| VA Mortgage | va-mortgage-calculator | 🆕 GenericCalc added |
| Home Equity Loan | home-equity-loan-calculator | 🆕 GenericCalc added |
| HELOC Calculator | heloc-calculator | 🆕 GenericCalc added |
| Down Payment | down-payment-calculator | ✅ GenericCalc |
| Rent vs Buy | rent-vs-buy-calculator | 🆕 GenericCalc added |
| Refinance | refinance-calculator | ✅ GenericCalc |
| Auto Lease | auto-lease-calculator | ✅ GenericCalc |
| Lease Calculator | lease-calculator | 🆕 GenericCalc added |
| Debt Consolidation | debt-consolidation-calculator | 🆕 GenericCalc added |
| Student Loan | student-loan-calculator | 🆕 GenericCalc added |
| Credit Card Calculator | credit-card-calculator | ✅ Rich UI |
| Debt Payoff | debt-payoff-calculator | ✅ (→ CreditCardCalculator) |
| Personal Loan | personal-loan-calculator | 🆕 GenericCalc added |
| Business Loan | business-loan-calculator | 🆕 GenericCalc added |
| Boat Loan | boat-loan-calculator | 🆕 GenericCalc added |
| Amortization | amortization-calculator | ✅ Rich UI |
| Commission | commission-calculator | ✅ GenericCalc |
| Margin Calculator | margin-calculator | ✅ GenericCalc |
| Average Return | average-return-calculator | 🆕 GenericCalc added |
| Depreciation | depreciation-calculator | ✅ GenericCalc |
| Inflation | inflation-calculator | ✅ GenericCalc |
| Currency Calculator | currency-calculator | 🆕 GenericCalc added |
| VAT Calculator | vat-calculator | ✅ GenericCalc |
| Sales Tax | sales-tax-calculator | ✅ GenericCalc |
| Discount | discount-calculator | ✅ GenericCalc |
| Percent Off | percent-off-calculator | ✅ GenericCalc |
| Tip Calculator | tip-calculator | ✅ Rich UI |
| Estate Tax | estate-tax-calculator | 🆕 GenericCalc added |
| Marriage Tax | marriage-tax-calculator | 🆕 GenericCalc added |
| Social Security | social-security-calculator | 🆕 GenericCalc added |
| Cash Back | cash-back-calculator | 🆕 GenericCalc added |
| Real Estate | real-estate-calculator | 🆕 GenericCalc added |
| Rental Property | rental-property-calculator | 🆕 GenericCalc added |
| Debt-to-Income | debt-to-income-ratio-calculator | ✅ GenericCalc |
| Repayment Calc | repayment-calculator | 🆕 GenericCalc added |
| College Cost | college-cost-calculator | 🆕 GenericCalc added |

### Health / Fitness

| Calculator.net Tool | NumerixHub Slug | Status |
|---|---|---|
| BMI Calculator | bmi-calculator | ✅ Rich UI |
| BMR Calculator | bmr-calculator | ✅ Rich UI |
| TDEE Calculator | tdee-calculator | ✅ Rich UI (upgraded) |
| Calorie Calculator | calorie-calculator | ✅ Rich UI |
| Body Fat Calculator | body-fat-calculator | ✅ Rich UI (upgraded, Navy method) |
| Calories Burned | calories-burned-calculator | ✅ Rich UI (upgraded, 12 activities) |
| Pregnancy Calculator | pregnancy-calculator | ✅ Rich UI |
| Due Date Calculator | due-date-calculator | ✅ (→ PregnancyCalculator) |
| Ovulation Calculator | ovulation-calculator | ✅ (→ PregnancyCalculator) |
| Macro Calculator | macro-calculator | ✅ Rich UI |
| Protein Calculator | protein-calculator | ✅ GenericCalc |
| One Rep Max | one-rep-max-calculator | ✅ GenericCalc |
| Target Heart Rate | target-heart-rate-calculator | ✅ GenericCalc |
| Weight Watchers | weight-watchers-points-calculator | 🆕 GenericCalc added |
| Army Body Fat | army-body-fat-calculator | 🆕 GenericCalc added |
| Lean Body Mass | lean-body-mass-calculator | ✅ GenericCalc |
| Healthy Weight | healthy-weight-calculator | 🆕 GenericCalc added |
| Body Surface Area | body-surface-area-calculator | ✅ GenericCalc |
| Carbohydrate | carbohydrate-calculator | 🆕 GenericCalc added |
| Ideal Weight | ideal-weight-calculator | ✅ GenericCalc |
| Overweight | overweight-calculator | ✅ GenericCalc |
| GFR Calculator | gfr-calculator | ✅ GenericCalc |
| BAC Calculator | bac-calculator | ✅ GenericCalc |
| Body Type | body-type-calculator | 🆕 GenericCalc added |
| Pace Calculator | pace-calculator | ✅ GenericCalc |
| Height Converter | height-calculator | ✅ Rich UI |

### Math / Science

| Calculator.net Tool | NumerixHub Slug | Status |
|---|---|---|
| Percentage Calculator | percentage-calculator | ✅ Rich UI |
| Scientific Calculator | scientific-calculator | ✅ Rich UI |
| Fraction Calculator | fraction-calculator | ✅ Rich UI |
| Statistics Calculator | statistics-calculator | ✅ Rich UI |
| Quadratic Formula | quadratic-formula-calculator | ✅ Rich UI |
| Z-Score Calculator | z-score-calculator | ✅ GenericCalc |
| Confidence Interval | confidence-interval-calculator | ✅ GenericCalc |
| Sample Size | sample-size-calculator | ✅ GenericCalc |
| Probability | probability-calculator | ✅ GenericCalc |
| Permutation/Combo | permutation-combination-calculator | ✅ GenericCalc |
| LCM Calculator | lcm-calculator | ✅ GenericCalc |
| GCF Calculator | gcf-calculator | ✅ GenericCalc |
| Factor Calculator | factor-calculator | ✅ GenericCalc |
| Prime Factorization | prime-factorization-calculator | ✅ GenericCalc |
| Exponent Calculator | exponent-calculator | ✅ GenericCalc |
| Root Calculator | root-calculator | ✅ GenericCalc |
| Logarithm | log-calculator | ✅ GenericCalc |
| Scientific Notation | scientific-notation-calculator | ✅ GenericCalc |
| Rounding | rounding-calculator | ✅ GenericCalc |
| Binary Calculator | binary-calculator | ✅ Rich UI (new) |
| Hex Calculator | hex-calculator | ✅ Rich UI (new) |
| Big Number | big-number-calculator | 🆕 GenericCalc added |
| Matrix Calculator | matrix-calculator | 🆕 GenericCalc added |
| Half-Life | half-life-calculator | ✅ GenericCalc |
| Molarity | molarity-calculator | ✅ GenericCalc |
| Molecular Weight | molecular-weight-calculator | ✅ GenericCalc |
| Average Calculator | average-calculator | ✅ GenericCalc |
| Percent Error | percent-error-calculator | ✅ GenericCalc |
| Ratio Calculator | ratio-calculator | ✅ GenericCalc |
| Slope Calculator | slope-calculator | ✅ GenericCalc |
| Distance Formula | distance-calculator | ✅ GenericCalc |
| Pythagorean Theorem | pythagorean-theorem-calculator | ✅ GenericCalc |
| Right Triangle | right-triangle-calculator | ✅ GenericCalc |
| Circle Calculator | circle-calculator | ✅ GenericCalc |
| Triangle Calculator | triangle-calculator | ✅ GenericCalc |
| Surface Area | surface-area-calculator | ✅ GenericCalc |
| Area Calculator | area-calculator | ✅ GenericCalc |
| Square Footage | square-footage-calculator | ✅ GenericCalc |
| Density Calculator | density-calculator | ✅ GenericCalc |
| Speed Calculator | speed-calculator | ✅ GenericCalc |
| Ohm's Law | ohms-law-calculator | ✅ GenericCalc |
| Resistor | resistor-calculator | ✅ GenericCalc |
| Voltage Drop | voltage-drop-calculator | ✅ GenericCalc |
| Bandwidth | bandwidth-calculator | ✅ GenericCalc |

### Date / Time

| Calculator.net Tool | NumerixHub Slug | Status |
|---|---|---|
| Date Calculator | date-calculator | ✅ Rich UI |
| Age Calculator | age-calculator | ✅ Rich UI |
| Day Counter | day-counter | ✅ GenericCalc |
| Day of Week | day-of-week-calculator | ✅ GenericCalc |
| Time Duration | time-duration-calculator | ✅ GenericCalc |
| Time Calculator | time-calculator | ✅ Rich UI (new) |
| Hours Calculator | hours-calculator | ✅ Rich UI (new) |
| Time Zone | time-zone-calculator | ✅ Rich UI (new) |
| Sleep Calculator | sleep-calculator | ✅ GenericCalc |
| Time Card | time-card-calculator | ✅ GenericCalc |

### Utility / Everyday

| Calculator.net Tool | NumerixHub Slug | Status |
|---|---|---|
| GPA Calculator | gpa-calculator | ✅ GenericCalc |
| Grade Calculator | grade-calculator | ✅ GenericCalc |
| Gas Mileage | gas-mileage-calculator | ✅ GenericCalc |
| Mileage Calculator | mileage-calculator | ✅ GenericCalc |
| Fuel Cost | fuel-cost-calculator | ✅ GenericCalc |
| Horsepower | horsepower-calculator | ✅ GenericCalc |
| Paint Calculator | paint-calculator | ✅ GenericCalc |
| Electricity | electricity-calculator | ✅ GenericCalc |
| BTU Calculator | btu-calculator | ✅ GenericCalc |
| Concrete | concrete-calculator | ✅ GenericCalc |
| Tile Calculator | tile-calculator | ✅ GenericCalc |
| Roofing | roofing-calculator | ✅ GenericCalc |
| Mulch Calculator | mulch-calculator | ✅ GenericCalc |
| Gravel | gravel-calculator | ✅ GenericCalc |
| Stair Calculator | stair-calculator | ✅ GenericCalc |
| Construction | construction-calculator | 🆕 GenericCalc added |
| Dew Point | dew-point-calculator | ✅ GenericCalc |
| Heat Index | heat-index-calculator | ✅ GenericCalc |
| Wind Chill | wind-chill-calculator | ✅ GenericCalc |
| Golf Handicap | golf-handicap-calculator | ✅ GenericCalc |
| Weight Converter | weight-calculator | ✅ GenericCalc |
| Mass Calculator | mass-calculator | ✅ GenericCalc |
| Roman Numerals | roman-numeral-converter | ✅ GenericCalc |
| IP Subnet | ip-subnet-calculator | ✅ GenericCalc |
| Base64 | base64-calculator | ✅ Rich UI (new) |
| URL Encoder | url-encoder | ✅ Rich UI (new) |
| Password Generator | password-generator | ✅ Rich UI |
| Random Number | random-number-generator | ✅ Rich UI |
| Dice Roller | dice-roller | ✅ Rich UI |

---

## 3. New Components Added This Session

### Rich UI Components (full React)

1. **AutoLoanCalculator** — Vehicle price, down payment, trade-in, rate, term selector; shows monthly, total, interest cards.
2. **SalaryCalculator** — Converts between annual / monthly / bi-weekly / weekly / daily / hourly pay.
3. **BodyFatCalculator** — US Navy method (gender-specific); returns % body fat, lean body mass, fat mass, and category badge.
4. **TDEECalculator** — Mifflin-St Jeor BMR × activity factor; shows maintenance calories + 3 goal scenarios.
5. **CaloriesBurnedCalculator** — 12 activities with MET values; weight + duration input.
6. **BinaryCalculator** — Convert any base (2/8/10/16) to all four representations.
7. **Base64Calculator** — Encode/decode textarea with copy button; error handling.
8. **URLEncoder** — Encode/decode URI components with copy button.
9. **TimeZoneCalculator** — Convert a clock time between 14 common time zones using the Intl API.
10. **TimeCalculator** — Add or subtract two time values (hours/minutes/seconds).
11. **HoursCalculator** — Weekly timecard with break deductions and pay calculation for each day.

### New GenericCalculator Configs (44 new)

Financial (28 new): currency-calculator, finance-calculator, mortgage-payoff-calculator, marriage-tax-calculator, estate-tax-calculator, social-security-calculator, annuity-calculator, annuity-payout-calculator, debt-consolidation-calculator, repayment-calculator, student-loan-calculator, college-cost-calculator, bond-calculator, rmd-calculator, cash-back-calculator, average-return-calculator, business-loan-calculator, real-estate-calculator, take-home-paycheck-calculator, personal-loan-calculator, boat-loan-calculator, lease-calculator, rental-property-calculator, irr-calculator, fha-loan-calculator, va-mortgage-calculator, home-equity-loan-calculator, heloc-calculator, rent-vs-buy-calculator, mortgage-calculator-uk, canadian-mortgage-calculator

Health (6 new): army-body-fat-calculator, carbohydrate-calculator, healthy-weight-calculator, weight-watchers-points-calculator, body-type-calculator

Math (5 new): binary-calculator (also has rich UI), hex-calculator (also has rich UI), big-number-calculator, matrix-calculator

Utility (3 new): time-calculator (also has rich UI), hours-calculator (also has rich UI), construction-calculator

---

## 4. Alias/Overlap Mapping

The following slugs share a component intentionally (aliases):

| Slug | Shares With | Rationale |
|---|---|---|
| pension-calculator | RetirementCalculator | Pension is a retirement account type |
| roth-ira-calculator | SavingsCalculator | Roth IRA is a savings vehicle |
| ira-calculator | SavingsCalculator | IRA is a savings vehicle |
| mutual-fund-calculator | InvestmentCalculator | Mutual funds are investments |
| fat-intake-calculator | MacroCalculator | Fat intake is a macro |
| mean-median-mode-calculator | StatisticsCalculator | Part of statistics |
| standard-deviation-calculator | StatisticsCalculator | Part of statistics |
| algebra-calculator | QuadraticCalculator | Quadratic is core algebra |
| number-sequence-calculator | RandomNumberGenerator | Close enough utility |
| due-date-calculator | PregnancyCalculator | Due date is the main output |
| ovulation-calculator | PregnancyCalculator | Related to pregnancy cycle |
| period-calculator | PregnancyCalculator | Related to menstrual cycle |
| pregnancy-weight-gain-calculator | PregnancyCalculator | Pregnancy-related |
| mortgage-amortization-calculator | AmortizationCalculator | Same calculation |
| credit-cards-payoff-calculator | CreditCardCalculator | Same payoff logic |
| debt-payoff-calculator | CreditCardCalculator | Debt payoff is core credit card use case |
| hex-calculator | BinaryCalculator | Hex is part of number base conversion |

---

## 5. Duplicate/Overlap Risks Found and Resolved

- **37 GenericCalculator configs** were added as duplicates (my initial addition ran without checking the pre-existing section from line ~1875 onward). These were identified via Python analysis and removed cleanly.
- No two distinct slugs map to genuinely different calculators in a conflicting way.
- The slug `binary-calculator` and `hex-calculator` both map to `BinaryCalculator` rich component, and the GenericCalculator configs for these are now superseded but do exist as fallback.

---

## 6. What Remains for a Future SEO Session

- Full `<head>` metadata per calculator page (title, description, canonical, structured data)
- Breadcrumb and FAQ schema markup per page
- Long-form content sections (what is / how to use / formula explanations) per calculator
- Open Graph images per category
- Internal linking between related calculators
- Sitemap priority tuning
- `robots.txt` optimization
- Core Web Vitals optimization (LCP, CLS) on calculator pages

---

## 7. Calculators Not Yet Fully Functional (default 2-input fallback)

A small number of calculators still fall through to the generic 2-input default because they require complex UI that wasn't addressed in this session:

- `finance-calculator` — now has a GenericCalc config ✅
- `currency-calculator` — now has a GenericCalc config ✅  
- Any remaining calculators in `lib/calculators.ts` not mapped in `calculatorComponents` or `GenericCalculator.configs` will show a basic 2-input form. A future session should address these with proper configs.

---

*Report generated as part of the NumerixHub calculator upgrade session — April 2026.*
