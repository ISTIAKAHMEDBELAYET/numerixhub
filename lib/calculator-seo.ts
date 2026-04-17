import type { Calculator } from '@/lib/calculators';

export interface SEOFaq {
  question: string;
  answer: string;
}

export interface CalculatorSEO {
  intro: string;
  howTo?: string[];
  formula?: string;
  examples?: Array<{ title: string; description: string }>;
  faqs?: SEOFaq[];
  relatedSlugs?: string[];
}

// ── Full SEO content for featured & high-traffic calculators ──────────────────

const seoData: Record<string, CalculatorSEO> = {
  'bmi-calculator': {
    intro:
      'The BMI Calculator helps you instantly determine your Body Mass Index — a widely used measure of body weight relative to height. Enter your measurements to see your score and weight category, and understand what it means for your health.',
    howTo: [
      'Select Imperial (lbs / ft & in) or Metric (kg / cm) units.',
      'Enter your current weight.',
      'Enter your height.',
      "Click 'Calculate BMI' to see your BMI score and weight category.",
    ],
    formula:
      'Imperial: BMI = (weight in lbs ÷ height in inches²) × 703\nMetric: BMI = weight in kg ÷ (height in meters)²',
    examples: [
      {
        title: "5′9″, 160 lbs (Imperial)",
        description:
          'BMI = (160 ÷ 69²) × 703 = 23.6 → Normal weight',
      },
      {
        title: '175 cm, 85 kg (Metric)',
        description: 'BMI = 85 ÷ 1.75² = 27.8 → Overweight',
      },
    ],
    faqs: [
      {
        question: 'What is a healthy BMI range?',
        answer:
          'A BMI between 18.5 and 24.9 is considered normal or healthy for most adults. Below 18.5 is underweight; 25–29.9 is overweight; 30 and above is obese.',
      },
      {
        question: 'Is BMI accurate for athletes?',
        answer:
          'BMI can overestimate body fat in highly muscular individuals and underestimate it in older adults who have lost muscle mass. Body fat percentage is a more precise measure for athletes.',
      },
      {
        question: 'What BMI is considered obese?',
        answer:
          'A BMI of 30 or above is classified as obese. A BMI of 40 or above is considered severely (morbidly) obese.',
      },
      {
        question: 'Does BMI apply to children?',
        answer:
          'For children aged 2–19, BMI is plotted on age- and sex-specific growth charts (BMI-for-age percentile) rather than using the adult thresholds.',
      },
    ],
    relatedSlugs: [
      'calorie-calculator',
      'body-fat-calculator',
      'ideal-weight-calculator',
      'bmr-calculator',
    ],
  },

  'mortgage-calculator': {
    intro:
      'The Mortgage Calculator estimates your monthly mortgage payment, total interest paid, and full amortization schedule. Enter the home price, interest rate, and loan term to get an accurate breakdown in seconds.',
    howTo: [
      'Enter the home price (or loan amount).',
      'Enter the annual interest rate.',
      'Select the loan term (15, 20, or 30 years).',
      "Click 'Calculate Payment' to see your monthly payment and total cost.",
    ],
    formula:
      'Monthly Payment = P × [r(1+r)ⁿ] ÷ [(1+r)ⁿ − 1]\nWhere P = principal loan amount, r = monthly interest rate (APR ÷ 12), n = total number of monthly payments',
    examples: [
      {
        title: '$280,000 loan, 7% rate, 30-year term',
        description:
          'Monthly payment ≈ $1,863. Total interest paid over life of loan ≈ $390,905.',
      },
      {
        title: '$180,000 loan, 6.5% rate, 15-year term',
        description:
          'Monthly payment ≈ $1,569. Total interest paid ≈ $102,493.',
      },
    ],
    faqs: [
      {
        question: "What's included in a mortgage payment?",
        answer:
          'Principal, interest, property taxes, homeowner\'s insurance, and PMI (if applicable) — often abbreviated PITI + PMI. Our calculator shows principal + interest; taxes and insurance will vary.',
      },
      {
        question: 'What credit score do I need for a mortgage?',
        answer:
          'Most conventional loans require a 620+ credit score. FHA loans allow as low as 580 with a 3.5% down payment, or 500 with 10% down.',
      },
      {
        question: 'What is the 28% rule for mortgages?',
        answer:
          "Lenders typically prefer your total housing payment to be no more than 28% of your gross monthly income. For example, a household earning $6,000/month should ideally keep the payment at or below $1,680.",
      },
      {
        question: 'How can I lower my monthly mortgage payment?',
        answer:
          'Make a larger down payment, improve your credit score to get a better rate, choose a longer term (30 vs. 15 years), buy discount points, or shop multiple lenders to compare offers.',
      },
    ],
    relatedSlugs: [
      'amortization-calculator',
      'mortgage-payoff-calculator',
      'down-payment-calculator',
      'refinance-calculator',
    ],
  },

  'loan-calculator': {
    intro:
      'The Loan Calculator computes monthly payments, total interest, and the full repayment schedule for any type of installment loan. Enter the loan amount, interest rate, and term to instantly see your costs.',
    howTo: [
      'Enter the loan amount (principal).',
      'Enter the annual interest rate (APR).',
      'Enter the loan term in months or years.',
      "Click 'Calculate' to see your monthly payment, total interest, and amortization schedule.",
    ],
    formula:
      'Monthly Payment = P × [r(1+r)ⁿ] ÷ [(1+r)ⁿ − 1]\nWhere P = loan principal, r = monthly interest rate (APR ÷ 12), n = number of monthly payments',
    examples: [
      {
        title: '$10,000 personal loan at 8% APR for 3 years',
        description:
          'Monthly payment ≈ $313.36. Total interest paid ≈ $1,281.',
      },
      {
        title: '$25,000 auto loan at 5.9% APR for 5 years',
        description:
          'Monthly payment ≈ $481.36. Total interest paid ≈ $3,881.',
      },
    ],
    faqs: [
      {
        question: 'What is APR vs. interest rate?',
        answer:
          'APR (Annual Percentage Rate) includes the interest rate plus any fees charged by the lender, giving a fuller picture of the true cost of borrowing.',
      },
      {
        question: 'How do I qualify for the lowest loan rate?',
        answer:
          'Improve your credit score, reduce your debt-to-income ratio, offer collateral (secured loan), and compare multiple lenders. A co-signer can also help.',
      },
      {
        question: 'What is a good interest rate for a personal loan?',
        answer:
          'Rates vary widely—typically 6–36%. Borrowers with excellent credit (720+) can often qualify for rates below 10%.',
      },
      {
        question: 'Can I pay off my loan early?',
        answer:
          "Yes—paying extra toward the principal reduces total interest paid. Check your loan agreement for prepayment penalties before making extra payments.",
      },
    ],
    relatedSlugs: [
      'mortgage-calculator',
      'auto-loan-calculator',
      'personal-loan-calculator',
      'amortization-calculator',
    ],
  },

  'compound-interest-calculator': {
    intro:
      'The Compound Interest Calculator shows how your money grows when returns are reinvested. See the exponential power of compounding across different interest rates, compounding frequencies, and time horizons.',
    howTo: [
      'Enter the starting principal amount.',
      'Enter the annual interest rate (%).',
      'Choose the compounding frequency (daily, monthly, quarterly, or annually).',
      'Enter the investment period in years.',
      "Click 'Calculate' to see your final balance and total interest earned.",
    ],
    formula:
      'A = P(1 + r/n)^(nt)\nWhere A = final balance, P = principal, r = annual interest rate (decimal), n = compounding periods per year, t = time in years',
    examples: [
      {
        title: '$5,000 at 7% compounded monthly for 10 years',
        description:
          'A = 5,000 × (1 + 0.07/12)^(120) ≈ $9,967. Interest earned ≈ $4,967.',
      },
      {
        title: '$1,000 at 5% compounded annually for 20 years',
        description:
          'A = 1,000 × (1.05)^20 ≈ $2,653. Interest earned ≈ $1,653.',
      },
    ],
    faqs: [
      {
        question: 'What is compound interest?',
        answer:
          'Compound interest is interest calculated on both the initial principal and all previously accumulated interest, causing growth to accelerate exponentially over time.',
      },
      {
        question: 'How does compounding frequency affect growth?',
        answer:
          'More frequent compounding (daily > monthly > quarterly > annually) results in slightly higher returns. The difference compounds significantly over long periods.',
      },
      {
        question: 'What is the Rule of 72?',
        answer:
          "Divide 72 by the annual interest rate to estimate how many years it takes to double your money. At 6% annual rate, your investment doubles in about 12 years.",
      },
      {
        question: "What's the difference between APY and APR?",
        answer:
          'APY (Annual Percentage Yield) accounts for compounding; APR (Annual Percentage Rate) does not. APY always equals or exceeds APR for the same nominal rate.',
      },
    ],
    relatedSlugs: [
      'simple-interest-calculator',
      'savings-calculator',
      'investment-calculator',
      'cd-calculator',
    ],
  },

  'calorie-calculator': {
    intro:
      'The Calorie Calculator estimates your daily calorie needs based on your age, sex, height, weight, and activity level. Use the results to plan a diet for weight loss, maintenance, or muscle gain.',
    howTo: [
      'Select your biological sex.',
      'Enter your age, weight, and height.',
      'Choose your activity level from the dropdown.',
      "Click 'Calculate' to see your maintenance calories and goal-based recommendations.",
    ],
    formula:
      "Mifflin-St Jeor BMR (Men): (10 × weight kg) + (6.25 × height cm) − (5 × age) + 5\nMifflin-St Jeor BMR (Women): (10 × weight kg) + (6.25 × height cm) − (5 × age) − 161\nTDEE = BMR × Activity Factor (1.2–1.9)",
    examples: [
      {
        title: '35-year-old male, 175 cm, 80 kg, moderately active',
        description:
          'BMR ≈ 1,871 kcal. TDEE ≈ 2,900 kcal/day for weight maintenance.',
      },
      {
        title: '28-year-old female, 163 cm, 62 kg, lightly active',
        description:
          'BMR ≈ 1,394 kcal. TDEE ≈ 1,918 kcal/day for weight maintenance.',
      },
    ],
    faqs: [
      {
        question: 'How many calories should I eat to lose weight?',
        answer:
          'A deficit of ~500 kcal/day typically yields about 1 lb (0.45 kg) of weight loss per week. Avoid dropping below 1,200 kcal/day (women) or 1,500 kcal/day (men) without medical supervision.',
      },
      {
        question: 'What activity level should I choose?',
        answer:
          'Sedentary = desk job / little exercise; Lightly active = light exercise 1–3 days/week; Moderately active = exercise 3–5 days/week; Very active = hard exercise 6–7 days/week; Extra active = physical job or 2× daily training.',
      },
      {
        question: 'How accurate is this calorie calculator?',
        answer:
          'The Mifflin-St Jeor formula is one of the most validated equations for estimating calorie needs, but individual metabolism varies. Use results as a starting estimate and adjust based on real-world progress.',
      },
      {
        question: 'What are macros?',
        answer:
          'Macronutrients are protein, carbohydrates, and fat. Standard recommendations are 20–35% of calories from fat, 45–65% from carbohydrates, and 10–35% from protein.',
      },
    ],
    relatedSlugs: [
      'bmi-calculator',
      'bmr-calculator',
      'macro-calculator',
      'tdee-calculator',
    ],
  },

  'scientific-calculator': {
    intro:
      'The Scientific Calculator provides all standard and advanced mathematical operations — including trigonometry, logarithms, exponents, factorials, and constants — directly in your browser. No download or signup needed.',
    howTo: [
      'Type numbers using the on-screen keypad or your physical keyboard.',
      'Use function buttons (sin, cos, tan, log, ln, √, xⁿ, n!) for advanced operations.',
      'Use parentheses to control the order of operations.',
      "Press '=' or Enter to calculate the result.",
    ],
    formula:
      'Key functions: sin(x), cos(x), tan(x), asin(x), acos(x), atan(x), log₁₀(x), ln(x), √x, xⁿ, n!, π ≈ 3.14159, e ≈ 2.71828',
    examples: [
      { title: 'sin(30°)', description: '= 0.5' },
      {
        title: 'log(1000)',
        description: '= 3 (base-10 logarithm, since 10³ = 1000)',
      },
      { title: '5!', description: '= 5 × 4 × 3 × 2 × 1 = 120' },
    ],
    faqs: [
      {
        question: 'Can I use this calculator for exams?',
        answer:
          'This is an online reference tool. Check your exam rules — most standardized tests require a physical, approved calculator.',
      },
      {
        question: 'What is the order of operations used?',
        answer:
          'PEMDAS / BODMAS: Parentheses, Exponents, Multiplication & Division (left-to-right), Addition & Subtraction (left-to-right).',
      },
      {
        question: 'How do I calculate a factorial?',
        answer:
          "Enter a non-negative integer and press the 'n!' button. For example, 6! = 720.",
      },
      {
        question: 'Does it support radians and degrees?',
        answer:
          'Yes. Toggle between degree and radian mode before using trigonometric functions to get the correct result.',
      },
    ],
    relatedSlugs: [
      'percentage-calculator',
      'fraction-calculator',
      'quadratic-formula-calculator',
      'statistics-calculator',
    ],
  },

  'age-calculator': {
    intro:
      'The Age Calculator computes your exact age in years, months, and days from any birth date to today (or a date you choose). It also shows how many days remain until your next birthday.',
    howTo: [
      'Enter your date of birth using the date picker.',
      'The end date defaults to today — change it if needed.',
      "Click 'Calculate Age' to see your exact age and days until next birthday.",
    ],
    formula:
      'Age = End Date − Birth Date (accounting for varying month lengths and leap years)\nDays Until Birthday = Next Birthday Date − Today',
    examples: [
      {
        title: 'Born January 15, 1990 — calculated on April 17, 2025',
        description: 'Age = 35 years, 3 months, 2 days.',
      },
      {
        title: 'Born February 29, 2000 (leap day)',
        description:
          "On non-leap years, the birthday is treated as March 1 for calculation purposes.",
      },
    ],
    faqs: [
      {
        question: 'How is age calculated across different cultures?',
        answer:
          'Western systems add 1 year on each birthday. The traditional Korean age system counts everyone as 1 at birth and adds a year every January 1st, making Korean age 1–2 years higher than international age.',
      },
      {
        question: 'Does the calculator handle leap years?',
        answer:
          'Yes. The calculator correctly handles February 29 birthdays, leap year differences, and varying month lengths.',
      },
      {
        question: 'How do I find my age in total days?',
        answer:
          "Multiply your age in years by 365.25 (accounting for leap years) for an approximation, or use the 'days between dates' result for an exact count.",
      },
      {
        question: "Can I calculate someone else's age?",
        answer:
          "Yes — simply enter their birth date. You can also change the 'as of' date to calculate age at any point in time, past or future.",
      },
    ],
    relatedSlugs: [
      'date-calculator',
      'day-counter',
      'due-date-calculator',
      'day-of-week-calculator',
    ],
  },

  'tip-calculator': {
    intro:
      'The Tip Calculator instantly computes the tip amount, total bill, and per-person split for any restaurant or service. Enter the bill amount, tip percentage, and number of guests to get a breakdown in seconds.',
    howTo: [
      'Enter the total bill amount (before tip).',
      'Select or type a tip percentage (e.g., 15%, 18%, 20%).',
      'Enter the number of people splitting the bill.',
      "See the tip, total, and amount per person instantly.",
    ],
    formula:
      'Tip Amount = Bill × (Tip% ÷ 100)\nTotal Bill = Bill + Tip Amount\nPer Person = Total Bill ÷ Number of People',
    examples: [
      {
        title: '$85 dinner bill, 20% tip, 4 people',
        description: 'Tip = $17.00. Total = $102.00. Per person = $25.50.',
      },
      {
        title: '$42 lunch bill, 15% tip, 2 people',
        description: 'Tip = $6.30. Total = $48.30. Per person = $24.15.',
      },
    ],
    faqs: [
      {
        question: 'What is the standard tip percentage in the US?',
        answer:
          '15–20% is standard for restaurant service. 18–22% is typical for excellent service. Many people default to 20% for easy math.',
      },
      {
        question: 'Should I tip on the pre-tax or post-tax amount?',
        answer:
          'Either is acceptable. Tipping on the pre-tax subtotal is traditional; tipping on the post-tax total is simpler and common in practice.',
      },
      {
        question: 'Do I tip if gratuity is already included?',
        answer:
          "If the bill states 'gratuity included' or 'service charge included,' no additional tip is required — though you can add more for truly exceptional service.",
      },
      {
        question: 'How much do you tip for takeout or delivery?',
        answer:
          '10–15% for takeout is increasingly common, especially for large orders. For delivery, 15–20% (or a minimum of $3–5) is standard.',
      },
    ],
    relatedSlugs: [
      'discount-calculator',
      'sales-tax-calculator',
      'percentage-calculator',
      'budget-calculator',
    ],
  },

  // ── Additional high-traffic calculators ────────────────────────────────────

  'percentage-calculator': {
    intro:
      'The Percentage Calculator handles three essential percentage operations: find what percent of a number, calculate percent change between two values, or determine what percentage one number is of another — all in one free tool.',
    howTo: [
      "Select the operation: '% of a number', '% change', or 'X is what %'.",
      'Enter the two values in the input fields.',
      "Click 'Calculate' to see the result instantly.",
    ],
    formula:
      '% of a number: Result = (Percentage ÷ 100) × Number\nPercent change: Change% = ((New − Old) ÷ |Old|) × 100\nX is what % of Y: % = (X ÷ Y) × 100',
    examples: [
      {
        title: 'What is 15% of 200?',
        description: '(15 ÷ 100) × 200 = 30',
      },
      {
        title: 'Percent change from 80 to 100',
        description: '((100 − 80) ÷ 80) × 100 = 25% increase',
      },
    ],
    faqs: [
      {
        question: 'How do I calculate a percentage increase?',
        answer:
          'Subtract the original value from the new value, divide by the original, then multiply by 100. Formula: ((New − Old) ÷ Old) × 100.',
      },
      {
        question: 'What is the percentage formula?',
        answer:
          'Percentage = (Part ÷ Whole) × 100. For example, 30 out of 150 = (30 ÷ 150) × 100 = 20%.',
      },
      {
        question: 'How do I find the original price after a discount?',
        answer:
          'Original Price = Sale Price ÷ (1 − Discount%). For a $60 item after a 25% discount: $60 ÷ 0.75 = $80 original price.',
      },
      {
        question: 'What is a percentage point vs. a percent?',
        answer:
          'A percentage point is an absolute difference between two percentages (e.g., 10% to 15% = 5 percentage points). A percent is a relative change (10% to 15% = a 50% increase in the rate).',
      },
    ],
    relatedSlugs: [
      'discount-calculator',
      'percent-off-calculator',
      'percent-error-calculator',
      'sales-tax-calculator',
    ],
  },

  'body-fat-calculator': {
    intro:
      'The Body Fat Calculator estimates your body fat percentage using body measurements and the US Navy circumference method. Get a more detailed view of your body composition beyond what BMI provides.',
    howTo: [
      'Select your sex.',
      'Enter your height, neck circumference, and waist circumference.',
      'Women also enter hip circumference.',
      "Click 'Calculate' to see your estimated body fat percentage and fitness category.",
    ],
    formula:
      'Men: %BF = 86.010 × log₁₀(waist − neck) − 70.041 × log₁₀(height) + 36.76\nWomen: %BF = 163.205 × log₁₀(waist + hip − neck) − 97.684 × log₁₀(height) − 78.387',
    examples: [
      {
        title: 'Male: height 70 in, waist 34 in, neck 15 in',
        description: 'Estimated body fat ≈ 17.8% → Fitness category',
      },
      {
        title: 'Female: height 65 in, waist 30 in, hip 38 in, neck 13 in',
        description: 'Estimated body fat ≈ 24.1% → Fitness category',
      },
    ],
    faqs: [
      {
        question: 'What is a healthy body fat percentage?',
        answer:
          'For men, 10–20% is generally considered healthy (athletes 6–13%). For women, 18–28% is healthy (athletes 14–20%).',
      },
      {
        question: 'Is the Navy method accurate?',
        answer:
          'The US Navy method has a margin of error of ±3–4% compared to DEXA scans. It is a practical estimate but not as precise as medical body composition analysis.',
      },
      {
        question: 'How is body fat different from BMI?',
        answer:
          'BMI uses only height and weight and cannot distinguish muscle from fat. Body fat percentage directly measures the proportion of fat tissue in your body.',
      },
      {
        question: 'How do I reduce body fat?',
        answer:
          'A combination of caloric deficit, strength training (to preserve muscle), cardiovascular exercise, adequate protein intake, and quality sleep is most effective.',
      },
    ],
    relatedSlugs: [
      'bmi-calculator',
      'ideal-weight-calculator',
      'calorie-calculator',
      'lean-body-mass-calculator',
    ],
  },

  'salary-calculator': {
    intro:
      'The Salary Calculator converts your salary between hourly, daily, weekly, biweekly, monthly, and annual pay periods. Quickly see how much you earn per hour or what your annual salary equals per paycheck.',
    howTo: [
      'Enter your salary amount.',
      'Select the pay period it represents (hourly, weekly, monthly, etc.).',
      "Click 'Calculate' to see the equivalent pay for every other period.",
    ],
    formula:
      'Annual Salary = Hourly Rate × Hours per Week × 52\nMonthly = Annual ÷ 12\nBiweekly = Annual ÷ 26\nWeekly = Annual ÷ 52\nDaily = Annual ÷ (Work Days per Year)',
    examples: [
      {
        title: '$25/hour, 40 hours/week',
        description:
          'Annual = $52,000. Monthly = $4,333. Biweekly = $2,000.',
      },
      {
        title: '$65,000 annual salary',
        description:
          'Monthly = $5,417. Biweekly = $2,500. Hourly ≈ $31.25 (40 hr/wk).',
      },
    ],
    faqs: [
      {
        question: 'How many working hours are in a year?',
        answer:
          'A full-time employee working 40 hours/week for 52 weeks works 2,080 hours per year (before accounting for holidays and vacation).',
      },
      {
        question: 'What is the difference between gross and net salary?',
        answer:
          'Gross salary is your total pay before taxes and deductions. Net (take-home) salary is what you receive after federal, state, and local taxes, Social Security, Medicare, and other deductions.',
      },
      {
        question: 'How many biweekly paychecks are in a year?',
        answer:
          'There are 26 biweekly paychecks per year. In some years, certain months will have 3 paychecks instead of 2.',
      },
      {
        question: 'How do I negotiate a higher salary?',
        answer:
          'Research market rates for your role, document your accomplishments, time the conversation appropriately (performance review or new job offer), and be prepared to justify your number with data.',
      },
    ],
    relatedSlugs: [
      'take-home-paycheck-calculator',
      'income-tax-calculator',
      'budget-calculator',
      'hourly-to-salary-calculator',
    ],
  },

  'date-calculator': {
    intro:
      'The Date Calculator finds the exact number of days, weeks, months, or years between two dates, and lets you add or subtract days from any date to find a future or past date.',
    howTo: [
      'Choose between "Date Difference" or "Add/Subtract Days" mode.',
      'Enter the start date (and end date for difference mode).',
      'Enter the number of days to add or subtract (for date math mode).',
      "Click 'Calculate' to see the result.",
    ],
    formula:
      'Date Difference = End Date − Start Date (in days, then converted to weeks/months/years)\nFuture Date = Start Date + N Days',
    examples: [
      {
        title: 'Days between Jan 1, 2024 and Dec 31, 2024',
        description: '364 days (the end date is excluded; 2024 is a leap year with 366 days total).',
      },
      {
        title: '90 days after March 15, 2026',
        description: 'Result = June 13, 2026.',
      },
    ],
    faqs: [
      {
        question: 'How do I count the number of business days?',
        answer:
          "To count only weekdays, exclude Saturdays and Sundays from your count. Our calculator can show total days; divide by 7 and multiply by 5 for a rough weekday estimate.",
      },
      {
        question: 'What date is 100 days from today?',
        answer:
          "Use the 'Add Days' mode, enter today's date and 100 days, and click Calculate for the exact future date.",
      },
      {
        question: 'Does the calculator account for leap years?',
        answer:
          'Yes. Dates are computed using actual calendar rules, including leap year adjustments for February.',
      },
      {
        question: 'Can I calculate my age in days?',
        answer:
          "Enter your birth date as the start date and today as the end date. The result in days is your exact age in days. You can also use the dedicated Age Calculator.",
      },
    ],
    relatedSlugs: [
      'age-calculator',
      'day-counter',
      'due-date-calculator',
      'day-of-week-calculator',
    ],
  },
};

// ── Generic fallback content generator ────────────────────────────────────────

const categoryFaqs: Record<string, SEOFaq[]> = {
  financial: [
    {
      question: 'Is this calculator free to use?',
      answer:
        'Yes. All NumerixHub calculators are 100% free with no signup, no ads, and no hidden charges.',
    },
    {
      question: 'How accurate are the results?',
      answer:
        'Results are calculated using standard financial formulas. They are estimates for planning purposes — consult a licensed financial advisor for personalized advice.',
    },
    {
      question: 'Can I use this on my phone?',
      answer:
        'Yes. NumerixHub is fully mobile-friendly and works on any device with a modern browser.',
    },
    {
      question: 'Do I need to create an account?',
      answer:
        'No account is required. Open the calculator and start using it instantly.',
    },
  ],
  health: [
    {
      question: 'Is this calculator free to use?',
      answer:
        'Yes. All NumerixHub health calculators are 100% free with no signup required.',
    },
    {
      question: 'Should I rely on this for medical decisions?',
      answer:
        'These tools are for informational and educational purposes only. Always consult a qualified healthcare professional for medical advice, diagnosis, or treatment.',
    },
    {
      question: 'How accurate are health calculator results?',
      answer:
        'Results are based on clinically validated formulas. Individual results may vary based on factors not captured by the calculator.',
    },
    {
      question: 'Can I use this on my phone or tablet?',
      answer:
        'Yes. NumerixHub is responsive and works on all modern devices and browsers.',
    },
  ],
  math: [
    {
      question: 'Is this calculator free?',
      answer:
        'Yes — completely free, no signup or download needed.',
    },
    {
      question: 'Can I use this for homework or exams?',
      answer:
        'This is an online reference tool for practice and verification. Check your institution\'s rules on allowed calculators for formal assessments.',
    },
    {
      question: 'How precise are the results?',
      answer:
        'Results are computed using standard algorithms with floating-point precision. For most practical purposes, results are accurate to many decimal places.',
    },
    {
      question: 'What if I need to show my work?',
      answer:
        'Many calculators show intermediate steps alongside the final answer to help you understand the method.',
    },
  ],
  utility: [
    {
      question: 'Is this tool free to use?',
      answer:
        'Yes. Every tool on NumerixHub is free — no account, no download, no charge.',
    },
    {
      question: 'How accurate are the results?',
      answer:
        'Results are based on standard reference data and formulas. Treat outputs as estimates and verify with authoritative sources when accuracy is critical.',
    },
    {
      question: 'Does it work on mobile?',
      answer:
        'Yes. NumerixHub is fully optimized for smartphones, tablets, and desktop browsers.',
    },
    {
      question: 'Can I bookmark this calculator?',
      answer:
        'Absolutely. Each calculator has its own permanent URL that you can bookmark or share.',
    },
  ],
};

const genericHowTo: Record<string, string[]> = {
  financial: [
    'Enter the required financial values in the input fields.',
    'Adjust any optional settings (rate, term, frequency, etc.).',
    "Click the 'Calculate' button.",
    'Review your results and use them for planning.',
  ],
  health: [
    'Enter your personal details (age, sex, weight, height as required).',
    'Select any applicable options (units, activity level, etc.).',
    "Click 'Calculate' to see your results.",
    'Use the output as a reference — consult a professional for advice.',
  ],
  math: [
    'Enter the values or expression in the input field(s).',
    'Select the operation or mode if applicable.',
    "Click 'Calculate' or press Enter.",
    'Read the result and any shown steps.',
  ],
  utility: [
    'Fill in the required input fields.',
    'Adjust any settings or options.',
    "Click 'Calculate' or 'Convert'.",
    'View and use your result.',
  ],
};

function generateFallbackSEO(calc: Calculator): CalculatorSEO {
  const category = calc.category as keyof typeof categoryFaqs;
  return {
    intro: `The ${calc.name} is a free online tool — ${calc.description} No signup or download required.`,
    howTo: genericHowTo[category] ?? genericHowTo.utility,
    faqs: categoryFaqs[category] ?? categoryFaqs.utility,
    relatedSlugs: undefined, // populated dynamically in the component
  };
}

export function getCalculatorSEO(calc: Calculator): CalculatorSEO {
  return seoData[calc.slug] ?? generateFallbackSEO(calc);
}
