'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Calculator } from '@/lib/calculators';
import { calculators } from '@/lib/calculators';

// ── individual calculator UIs ──────────────────────────────────────────────

function BMICalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('imperial');
  const [weight, setWeight] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [result, setResult] = useState<{ bmi: number; category: string; color: string; bgColor: string; healthyLow: number; healthyHigh: number; heightIn: number } | null>(null);

  const calculate = () => {
    let bmi = 0;
    let totalInches = 0;
    if (unit === 'imperial') {
      const ft = parseFloat(heightFt) || 0;
      const inVal = parseFloat(heightIn) || 0;
      totalInches = ft * 12 + inVal;
      const lbs = parseFloat(weight);
      if (!lbs || !totalInches) return;
      bmi = (lbs / (totalInches * totalInches)) * 703;
    } else {
      const cm = parseFloat(heightCm);
      const kg = parseFloat(weight);
      if (!kg || !cm) return;
      const m = cm / 100;
      bmi = kg / (m * m);
      totalInches = cm / 2.54;
    }
    let category = '', color = '', bgColor = '';
    if (bmi < 18.5) { category = 'Underweight'; color = 'text-blue-600'; bgColor = 'bg-blue-50 dark:bg-blue-900/20'; }
    else if (bmi < 25) { category = 'Normal weight'; color = 'text-green-600'; bgColor = 'bg-green-50 dark:bg-green-900/20'; }
    else if (bmi < 30) { category = 'Overweight'; color = 'text-yellow-600'; bgColor = 'bg-yellow-50 dark:bg-yellow-900/20'; }
    else { category = 'Obese'; color = 'text-red-600'; bgColor = 'bg-red-50 dark:bg-red-900/20'; }
    // Healthy weight range (BMI 18.5 – 24.9) for the given height
    const heightM = unit === 'imperial' ? totalInches * 0.0254 : parseFloat(heightCm) / 100;
    const hLow = 18.5 * heightM * heightM;
    const hHigh = 24.9 * heightM * heightM;
    const healthyLow = unit === 'imperial' ? (hLow / 0.453592) : hLow;
    const healthyHigh = unit === 'imperial' ? (hHigh / 0.453592) : hHigh;
    setResult({ bmi: Math.round(bmi * 10) / 10, category, color, bgColor, healthyLow, healthyHigh, heightIn: totalInches });
  };

  return (
    <div className="space-y-5">
      <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 w-fit">
        <button onClick={() => { setUnit('imperial'); setResult(null); }} className={`px-5 py-2 text-sm font-medium ${unit === 'imperial' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Imperial</button>
        <button onClick={() => { setUnit('metric'); setResult(null); }} className={`px-5 py-2 text-sm font-medium ${unit === 'metric' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Metric</button>
      </div>
      {unit === 'imperial' ? (
        <div className="grid grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Weight (lbs)</label><input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="150" /></div>
          <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Height (ft)</label><input type="number" value={heightFt} onChange={e => setHeightFt(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="5" /></div>
          <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Height (in)</label><input type="number" value={heightIn} onChange={e => setHeightIn(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="8" /></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Weight (kg)</label><input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="70" /></div>
          <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Height (cm)</label><input type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="175" /></div>
        </div>
      )}
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate BMI</button>
      {result && (
        <div className="space-y-3">
          <div className={`${result.bgColor} rounded-xl p-6 text-center`}>
            <div className={`text-5xl font-extrabold ${result.color} mb-2`}>{result.bmi}</div>
            <div className={`text-xl font-semibold ${result.color}`}>{result.category}</div>
            <div className="text-xs text-gray-500 mt-1">
              Healthy weight range: <span className="font-medium">
                {unit === 'imperial'
                  ? `${Math.round(result.healthyLow)} – ${Math.round(result.healthyHigh)} lbs`
                  : `${Math.round(result.healthyLow)} – ${Math.round(result.healthyHigh)} kg`}
              </span> for your height
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs">
            {[['< 18.5', 'Underweight', 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'], ['18.5–24.9', 'Normal', 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'], ['25–29.9', 'Overweight', 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300'], ['≥ 30', 'Obese', 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300']].map(([range, label, cls]) => (
              <div key={label} className={`p-2 rounded-lg ${cls} ${result.category === label || (result.category === 'Normal weight' && label === 'Normal') ? 'ring-2 ring-offset-1 ring-indigo-500' : ''}`}><div className="font-bold">{range}</div><div>{label}</div></div>
            ))}
          </div>
          <p className="text-xs text-gray-400 italic">⚕️ BMI is a screening tool, not a diagnostic measure. Consult a healthcare provider for personalized advice.</p>
        </div>
      )}
    </div>
  );
}

function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState('400000');
  const [downType, setDownType] = useState<'pct' | 'fixed'>('pct');
  const [downValue, setDownValue] = useState('20');
  const [rate, setRate] = useState('7');
  const [term, setTerm] = useState('30');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 7));
  const [propTax, setPropTax] = useState('1.2');
  const [insurance, setInsurance] = useState('1200');
  const [pmi, setPmi] = useState('0.5');
  const [hoa, setHoa] = useState('0');
  const [extraMonthly, setExtraMonthly] = useState('0');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showAmort, setShowAmort] = useState(false);
  const [result, setResult] = useState<{
    loanAmount: number; downPayment: number; monthly: number; totalMonthly: number;
    totalPayment: number; totalInterest: number; propTaxMo: number; insuranceMo: number;
    pmiMo: number; hoaMo: number; payoffDate: string; payoffMonths: number;
    baselineMonths: number; baselineInterest: number;
    schedule: { year: number; principal: number; interest: number; balance: number }[];
  } | null>(null);

  const calculate = () => {
    const price = parseFloat(homePrice) || 0;
    const down = downType === 'pct' ? price * (parseFloat(downValue) / 100) : parseFloat(downValue) || 0;
    const loan = price - down;
    if (loan <= 0) return;
    const r = parseFloat(rate) / 100 / 12;
    const n = parseInt(term) * 12;
    if (!n) return;
    const monthly = r === 0
      ? loan / n
      : (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const propTaxMo = price * (parseFloat(propTax) / 100) / 12;
    const insuranceMo = parseFloat(insurance) / 12;
    const pmiMo = down / price < 0.2 ? loan * (parseFloat(pmi) / 100) / 12 : 0;
    const hoaMo = parseFloat(hoa) || 0;
    const extra = parseFloat(extraMonthly) || 0;
    const totalMonthly = monthly + propTaxMo + insuranceMo + pmiMo + hoaMo;

    const runAmortization = (extraPay: number) => {
      let balance = loan;
      let months = 0;
      let totalInterestAcc = 0;
      const yearlyData: { year: number; principal: number; interest: number; balance: number }[] = [];
      let yearPrin = 0;
      let yearInt = 0;

      while (balance > 0.01 && months < n + 360) {
        const int = r === 0 ? 0 : balance * r;
        const prin = Math.min(monthly - int + extraPay, balance);
        balance = Math.max(0, balance - prin);
        yearPrin += prin;
        yearInt += int;
        totalInterestAcc += int;
        months++;

        if (months % 12 === 0 || balance <= 0.01) {
          yearlyData.push({ year: Math.ceil(months / 12), principal: yearPrin, interest: yearInt, balance });
          yearPrin = 0;
          yearInt = 0;
        }
      }

      return { months, totalInterest: totalInterestAcc, schedule: yearlyData };
    };

    const baseline = runAmortization(0);
    const accelerated = runAmortization(extra);

    const sd = new Date(startDate + '-01');
    sd.setMonth(sd.getMonth() + accelerated.months);
    const payoffStr = sd.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    setResult({
      loanAmount: loan,
      downPayment: down,
      monthly,
      totalMonthly,
      totalPayment: loan + accelerated.totalInterest,
      totalInterest: accelerated.totalInterest,
      propTaxMo,
      insuranceMo,
      pmiMo,
      hoaMo,
      payoffDate: payoffStr,
      payoffMonths: accelerated.months,
      baselineMonths: baseline.months,
      baselineInterest: baseline.totalInterest,
      schedule: accelerated.schedule,
    });
  };

  const fmt = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
  const fmtD = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const downPct = homePrice ? ((downType === 'pct' ? parseFloat(downValue) : (parseFloat(downValue) / parseFloat(homePrice)) * 100) || 0).toFixed(1) : '0';

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Home Price ($)</label>
          <input type="number" value={homePrice} onChange={e => setHomePrice(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="400000" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Down Payment</label>
          <div className="flex gap-2">
            <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 flex-shrink-0">
              <button onClick={() => setDownType('pct')} className={`px-3 py-2 text-xs font-medium ${downType === 'pct' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>%</button>
              <button onClick={() => setDownType('fixed')} className={`px-3 py-2 text-xs font-medium ${downType === 'fixed' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>$</button>
            </div>
            <input type="number" value={downValue} onChange={e => setDownValue(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder={downType === 'pct' ? '20' : '80000'} />
          </div>
          {homePrice && <div className="text-xs text-gray-400 mt-1">{downPct}% down = {fmt(parseFloat(homePrice) * (1 - parseFloat(downPct) / 100))} loan</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Interest Rate (%)</label>
          <input type="number" step="0.125" value={rate} onChange={e => setRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Loan Term</label>
          <select value={term} onChange={e => setTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            <option value="30">30 years</option><option value="20">20 years</option><option value="15">15 years</option><option value="10">10 years</option>
          </select>
        </div>
      </div>

      <button type="button" onClick={() => setShowAdvanced(v => !v)} className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
        <span>{showAdvanced ? '▲' : '▼'}</span> {showAdvanced ? 'Hide' : 'Show'} taxes, insurance & extra payment
      </button>

      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Annual Property Tax (%)</label><input type="number" step="0.1" value={propTax} onChange={e => setPropTax(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="1.2" /></div>
          <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Annual Home Insurance ($)</label><input type="number" value={insurance} onChange={e => setInsurance(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="1200" /></div>
          <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">PMI Rate (% of loan, if &lt;20% down)</label><input type="number" step="0.1" value={pmi} onChange={e => setPmi(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="0.5" /></div>
          <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">HOA Fees ($/month)</label><input type="number" value={hoa} onChange={e => setHoa(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="0" /></div>
          <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Extra Monthly Payment ($)</label><input type="number" value={extraMonthly} onChange={e => setExtraMonthly(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="0" /></div>
          <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Loan Start Month</label><input type="month" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        </div>
      )}

      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate Mortgage</button>

      {result && (
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <div className="text-center mb-5">
              <div className="text-xs text-gray-500 mb-1">Principal & Interest / Month</div>
              <div className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">{fmtD(result.monthly)}</div>
              {result.totalMonthly > result.monthly && (
                <div className="text-sm text-gray-500 mt-1">Total monthly (incl. taxes/ins): <span className="font-bold text-gray-800 dark:text-gray-200">{fmtD(result.totalMonthly)}</span></div>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-sm">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Loan Amount</div><div className="font-bold">{fmt(result.loanAmount)}</div></div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Down Payment</div><div className="font-bold">{fmt(result.downPayment)}</div></div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Total Interest</div><div className="font-bold text-red-500">{fmt(result.totalInterest)}</div></div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Payoff Date</div><div className="font-bold text-xs">{result.payoffDate}</div></div>
            </div>
            {(result.propTaxMo > 0 || result.insuranceMo > 0 || result.pmiMo > 0 || result.hoaMo > 0) && (
              <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-4">
                <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Monthly Breakdown</div>
                <div className="space-y-1 text-sm">
                  {[['Principal & Interest', result.monthly], ['Property Tax', result.propTaxMo], ['Home Insurance', result.insuranceMo], result.pmiMo > 0 ? ['PMI', result.pmiMo] : null, result.hoaMo > 0 ? ['HOA', result.hoaMo] : null].filter(Boolean).map((row) => (
                    <div key={(row as [string, number])[0]} className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">{(row as [string, number])[0]}</span><span className="font-medium">{fmtD((row as [string, number])[1])}</span></div>
                  ))}
                  <div className="flex justify-between font-bold border-t border-gray-200 dark:border-gray-600 pt-1"><span>Total</span><span>{fmtD(result.totalMonthly)}</span></div>
                </div>
              </div>
            )}
            {result.pmiMo > 0 && <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">⚠️ PMI applies until you reach 20% equity (~{fmt(result.loanAmount * 0.8)} remaining balance)</div>}
            {parseFloat(extraMonthly) > 0 && result.baselineMonths > result.payoffMonths && (
              <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                Extra payment saves about {result.baselineMonths - result.payoffMonths} month(s) and {fmt(result.baselineInterest - result.totalInterest)} in interest.
              </div>
            )}
          </div>

          <button type="button" onClick={() => setShowAmort(v => !v)} className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
            <span>{showAmort ? '▲' : '▼'}</span> {showAmort ? 'Hide' : 'Show'} yearly amortization schedule
          </button>
          {showAmort && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead><tr className="bg-gray-100 dark:bg-gray-700">{['Year', 'Principal', 'Interest', 'Remaining Balance'].map(h => <th key={h} className="px-3 py-2 font-semibold text-gray-600 dark:text-gray-300">{h}</th>)}</tr></thead>
                <tbody>
                  {result.schedule.map(row => (
                    <tr key={row.year} className="border-t border-gray-100 dark:border-gray-700">
                      <td className="px-3 py-2">{row.year}</td>
                      <td className="px-3 py-2 text-green-600">{fmt(row.principal)}</td>
                      <td className="px-3 py-2 text-red-500">{fmt(row.interest)}</td>
                      <td className="px-3 py-2">{row.balance < 1 ? '—' : fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AgeCalculator() {
  const [mode, setMode] = useState<'single' | 'compare'>('single');
  const [dob, setDob] = useState('');
  const [asOfDate, setAsOfDate] = useState('');
  const [dob2, setDob2] = useState('');
  const [result, setResult] = useState<{
    years: number; months: number; days: number;
    totalMonths: number; totalWeeks: number; totalDays: number; totalHours: number;
    nextBirthday: number; nextBirthdayDate: string; nextBirthdayWeekday: string;
    prevBirthdayDate: string; birthWeekday: string; asOf: string;
  } | null>(null);
  const [compare, setCompare] = useState<{ diff: string; older: string } | null>(null);

  const calcAge = (birthStr: string, refStr: string) => {
    const birth = new Date(birthStr + 'T00:00:00');
    const ref = new Date(refStr + 'T00:00:00');
    let years = ref.getFullYear() - birth.getFullYear();
    let months = ref.getMonth() - birth.getMonth();
    let days = ref.getDate() - birth.getDate();
    if (days < 0) { months--; const d = new Date(ref.getFullYear(), ref.getMonth(), 0); days += d.getDate(); }
    if (months < 0) { years--; months += 12; }
    const diffMs = ref.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / 86400000);
    return { years, months, days, totalMonths: years * 12 + months, totalWeeks: Math.floor(totalDays / 7), totalDays, totalHours: totalDays * 24 };
  };

  const calculate = () => {
    if (!dob) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const ref = asOfDate || todayStr;
    const { years, months, days, totalMonths, totalWeeks, totalDays, totalHours } = calcAge(dob, ref);

    const birth = new Date(dob + 'T00:00:00');
    const refDate = new Date(ref + 'T00:00:00');
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const birthWeekday = weekdays[birth.getDay()];

    const nextBday = new Date(refDate.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday <= refDate) nextBday.setFullYear(refDate.getFullYear() + 1);
    const daysUntil = Math.ceil((nextBday.getTime() - refDate.getTime()) / 86400000);
    const nextBdayStr = nextBday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const nextBdayWeekday = weekdays[nextBday.getDay()];

    const prevBday = new Date(refDate.getFullYear(), birth.getMonth(), birth.getDate());
    if (prevBday >= refDate) prevBday.setFullYear(refDate.getFullYear() - 1);
    const prevBdayStr = prevBday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    setResult({ years, months, days, totalMonths, totalWeeks, totalDays, totalHours, nextBirthday: daysUntil, nextBirthdayDate: nextBdayStr, nextBirthdayWeekday: nextBdayWeekday, prevBirthdayDate: prevBdayStr, birthWeekday, asOf: new Date(ref + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) });

    if (mode === 'compare' && dob2) {
      const a = calcAge(dob, todayStr);
      const b = calcAge(dob2, todayStr);
      const diffDays = Math.abs(a.totalDays - b.totalDays);
      const diffYears = Math.floor(diffDays / 365);
      const diffMonths = Math.floor((diffDays % 365) / 30);
      const diffRemDays = diffDays % 30;
      const parts = [];
      if (diffYears) parts.push(`${diffYears} year${diffYears !== 1 ? 's' : ''}`);
      if (diffMonths) parts.push(`${diffMonths} month${diffMonths !== 1 ? 's' : ''}`);
      if (diffRemDays) parts.push(`${diffRemDays} day${diffRemDays !== 1 ? 's' : ''}`);
      setCompare({ diff: parts.join(', ') || '0 days', older: a.totalDays > b.totalDays ? 'Person 1 is older' : a.totalDays < b.totalDays ? 'Person 2 is older' : 'Same age' });
    } else {
      setCompare(null);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-5">
      <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 w-fit">
        <button onClick={() => { setMode('single'); setCompare(null); }} className={`px-5 py-2 text-sm font-medium ${mode === 'single' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Single Age</button>
        <button onClick={() => setMode('compare')} className={`px-5 py-2 text-sm font-medium ${mode === 'compare' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Compare Two Ages</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{mode === 'compare' ? 'Person 1 — Date of Birth' : 'Date of Birth'}</label>
          <input type="date" value={dob} onChange={e => setDob(e.target.value)} max={todayStr} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
        </div>
        {mode === 'compare' ? (
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Person 2 — Date of Birth</label>
            <input type="date" value={dob2} onChange={e => setDob2(e.target.value)} max={todayStr} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Age As Of Date <span className="text-gray-400 font-normal">(leave blank for today)</span></label>
            <input type="date" value={asOfDate} onChange={e => setAsOfDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
          </div>
        )}
      </div>

      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate Age</button>

      {result && (
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <div className="text-center mb-4">
              <div className="text-xs text-gray-400 mb-1">Age as of {result.asOf}</div>
              <div className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">{result.years}</div>
              <div className="text-gray-500 dark:text-gray-400 font-medium">Years Old</div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3"><div className="text-2xl font-bold text-purple-600">{result.years}</div><div className="text-xs text-gray-500">Years</div></div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3"><div className="text-2xl font-bold text-purple-600">{result.months}</div><div className="text-xs text-gray-500">Months</div></div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3"><div className="text-2xl font-bold text-purple-600">{result.days}</div><div className="text-xs text-gray-500">Days</div></div>
            </div>
            <div className="text-center mt-2 text-xs text-gray-400">Born on a {result.birthWeekday}</div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
            <div className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-2 uppercase tracking-wide">Total Duration</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[['Total Months', result.totalMonths.toLocaleString()], ['Total Weeks', result.totalWeeks.toLocaleString()], ['Total Days', result.totalDays.toLocaleString()], ['Total Hours', result.totalHours.toLocaleString()]].map(([label, val]) => (
                <div key={label} className="flex justify-between bg-white dark:bg-gray-800 rounded-lg px-3 py-2"><span className="text-gray-500">{label}</span><span className="font-bold text-indigo-700 dark:text-indigo-300">{val}</span></div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
              <div className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">🎂 Next Birthday</div>
              <div className="font-bold text-green-700 dark:text-green-300">{result.nextBirthdayDate}</div>
              <div className="text-sm text-gray-500">{result.nextBirthdayWeekday} · in {result.nextBirthday} day{result.nextBirthday !== 1 ? 's' : ''}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="text-xs font-semibold text-gray-500 mb-1">📅 Previous Birthday</div>
              <div className="font-bold text-gray-800 dark:text-gray-200">{result.prevBirthdayDate}</div>
            </div>
          </div>

          {compare && (
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 text-center">
              <div className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">Age Difference</div>
              <div className="font-bold text-amber-700 dark:text-amber-300 text-lg">{compare.diff}</div>
              <div className="text-sm text-gray-500 mt-1">{compare.older}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PercentageCalculator() {
  const [mode, setMode] = useState<'of' | 'change' | 'is'>('of');
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const a = parseFloat(val1);
    const b = parseFloat(val2);
    if (isNaN(a) || isNaN(b)) return;
    if (mode === 'of') setResult(`${a}% of ${b} = ${(a / 100 * b).toFixed(4).replace(/\.?0+$/, '')}`);
    else if (mode === 'change') setResult(`Percent change = ${(((b - a) / Math.abs(a)) * 100).toFixed(2)}%`);
    else setResult(`${a} is ${((a / b) * 100).toFixed(2)}% of ${b}`);
  };

  return (
    <div className="space-y-5">
      <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
        {([['of', '% of a number'], ['change', '% change'], ['is', 'X is what %']] as [string, string][]).map(([m, label]) => (
          <button key={m} onClick={() => { setMode(m as 'of'|'change'|'is'); setResult(null); }} className={`flex-1 py-2 text-sm font-medium ${mode === m ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>{label}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{mode === 'of' ? 'Percentage (%)' : mode === 'change' ? 'Original Value' : 'Part'}</label>
          <input type="number" value={val1} onChange={e => setVal1(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{mode === 'of' ? 'Number' : mode === 'change' ? 'New Value' : 'Whole'}</label>
          <input type="number" value={val2} onChange={e => setVal2(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
        </div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate</button>
      {result && <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded-xl p-5 text-center text-xl font-bold text-indigo-700 dark:text-indigo-300">{result}</div>}
    </div>
  );
}

function TipCalculator() {
  const [bill, setBill] = useState('');
  const [tipPct, setTipPct] = useState('18');
  const [people, setPeople] = useState('1');
  const [result, setResult] = useState<{ tip: number; total: number; perPerson: number } | null>(null);

  const calculate = () => {
    const b = parseFloat(bill);
    const t = parseFloat(tipPct) / 100;
    const p = parseInt(people) || 1;
    if (!b) return;
    const tip = b * t;
    const total = b + tip;
    setResult({ tip, total, perPerson: total / p });
  };

  const fmt = (n: number) => '$' + n.toFixed(2);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Bill Amount ($)</label><input type="number" value={bill} onChange={e => setBill(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="50.00" /></div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Tip %</label>
          <div className="flex gap-1 mb-2">
            {['15', '18', '20', '25'].map(p => <button key={p} onClick={() => setTipPct(p)} className={`flex-1 py-1.5 text-xs rounded font-medium ${tipPct === p ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>{p}%</button>)}
          </div>
          <input type="number" value={tipPct} onChange={e => setTipPct(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Custom %" />
        </div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Split Between</label><input type="number" min="1" value={people} onChange={e => setPeople(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate Tip</button>
      {result && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 grid grid-cols-3 gap-4 text-center">
          <div><div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tip Amount</div><div className="text-2xl font-bold text-green-600">{fmt(result.tip)}</div></div>
          <div><div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Bill</div><div className="text-2xl font-bold text-indigo-600">{fmt(result.total)}</div></div>
          <div><div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Per Person</div><div className="text-2xl font-bold text-purple-600">{fmt(result.perPerson)}</div></div>
        </div>
      )}
    </div>
  );
}

// Safe recursive-descent math expression parser (no eval / new Function)
function safeEval(raw: string): number {
  const src = raw
    .replace(/×/g, '*').replace(/÷/g, '/')
    .replace(/π/g, String(Math.PI))
    .replace(/\be\b/g, String(Math.E))
    .replace(/Math\.sin\(/g, 'sin(').replace(/Math\.cos\(/g, 'cos(')
    .replace(/Math\.tan\(/g, 'tan(').replace(/Math\.log10\(/g, 'log(')
    .replace(/Math\.log\(/g, 'ln(').replace(/Math\.sqrt\(/g, 'sqrt(')
    .replace(/\s+/g, '');

  let pos = 0;

  function peek() { return src[pos]; }
  function consume() { return src[pos++]; }

  function parseExpr(): number { return parseAddSub(); }

  function parseAddSub(): number {
    let left = parseMulDiv();
    while (peek() === '+' || peek() === '-') {
      const op = consume();
      const right = parseMulDiv();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  function parseMulDiv(): number {
    let left = parsePow();
    while (peek() === '*' || peek() === '/' || peek() === '%') {
      const op = consume();
      const right = parsePow();
      if (op === '*') left = left * right;
      else if (op === '/') left = left / right;
      else left = left % right;
    }
    return left;
  }

  function parsePow(): number {
    let base = parseUnary();
    if (peek() === '^') { consume(); base = Math.pow(base, parsePow()); }
    return base;
  }

  function parseUnary(): number {
    if (peek() === '-') { consume(); return -parseAtom(); }
    if (peek() === '+') { consume(); }
    return parseAtom();
  }

  function parseAtom(): number {
    // named functions
    const fns: Record<string, (x: number) => number> = {
      sin: Math.sin, cos: Math.cos, tan: Math.tan,
      ln: Math.log, log: Math.log10, sqrt: Math.sqrt,
      abs: Math.abs,
    };
    for (const [name, fn] of Object.entries(fns)) {
      if (src.startsWith(name + '(', pos)) {
        pos += name.length;
        consume(); // '('
        const arg = parseExpr();
        consume(); // ')'
        return fn(arg);
      }
    }
    // parentheses
    if (peek() === '(') {
      consume();
      const val = parseExpr();
      if (peek() === ')') consume();
      return val;
    }
    // number
    let numStr = '';
    while (pos < src.length && /[0-9.]/.test(src[pos])) numStr += consume();
    if (!numStr) throw new Error('Unexpected token at ' + pos);
    return parseFloat(numStr);
  }

  const result = parseExpr();
  if (pos < src.length) throw new Error('Unexpected characters remaining');
  return result;
}

function ScientificCalculator() {
  const [display, setDisplay] = useState('0');
  const [expr, setExpr] = useState('');
  const [justCalc, setJustCalc] = useState(false);

  const press = (val: string) => {
    if (justCalc && /[0-9.]/.test(val)) { setDisplay(val); setExpr(val); setJustCalc(false); return; }
    setJustCalc(false);
    if (val === 'C') { setDisplay('0'); setExpr(''); return; }
    if (val === '⌫') { const s = expr.slice(0, -1) || '0'; setExpr(s); setDisplay(s); return; }
    if (val === '=') {
      try {
        const r = safeEval(expr);
        const rs = typeof r === 'number' && isFinite(r) ? String(parseFloat(r.toFixed(10))) : 'Error';
        setDisplay(rs); setExpr(rs); setJustCalc(true);
      } catch { setDisplay('Error'); setExpr(''); }
      return;
    }
    const fns: Record<string, string> = {
      sin: 'Math.sin(', cos: 'Math.cos(', tan: 'Math.tan(',
      ln: 'Math.log(', log: 'Math.log10(', '√': 'Math.sqrt(',
    };
    if (fns[val]) { const ne = expr + fns[val]; setExpr(ne); setDisplay(ne); return; }
    const ne = (expr === '0' || expr === 'Error') && /[0-9.(]/.test(val) ? val : expr + val;
    setExpr(ne); setDisplay(ne);
  };

  const rows = [
    ['sin','cos','tan','C','⌫'],
    ['ln','log','√','π','e'],
    ['(',')','^','%','1/x'],
    ['7','8','9','÷','×'],
    ['4','5','6','-','+'],
    ['1','2','3','0','.'],
    ['='],
  ];

  return (
    <div className="max-w-xs mx-auto">
      <div className="bg-gray-900 text-white rounded-2xl p-5 shadow-xl">
        <div className="bg-black/50 rounded-xl p-4 mb-4 min-h-[64px] flex items-end justify-end">
          <div className="text-right w-full">
            <div className="text-gray-400 text-sm truncate">{expr || '0'}</div>
            <div className="text-2xl font-bold truncate">{display}</div>
          </div>
        </div>
        <div className="space-y-2">
          {rows.map((row, ri) => (
            <div key={ri} className={`grid gap-2 ${row.length === 1 ? 'grid-cols-1' : `grid-cols-${row.length}`}`}>
              {row.map(btn => {
                const isOp = ['÷','×','-','+'].includes(btn);
                const isClear = btn === 'C';
                const isEq = btn === '=';
                const isSpecial = ['sin','cos','tan','ln','log','√','π','e','^','%','1/x','(', ')'].includes(btn);
                return (
                  <button
                    key={btn}
                    onClick={() => {
                      if (btn === '1/x') {
                        try { const v = safeEval(expr); setDisplay(String(1/v)); setExpr(String(1/v)); setJustCalc(true); } catch { setDisplay('Error'); }
                        return;
                      }
                      press(btn);
                    }}
                    className={`py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                      isEq ? 'bg-indigo-600 hover:bg-indigo-500 text-white' :
                      isClear ? 'bg-red-500 hover:bg-red-400 text-white' :
                      isOp ? 'bg-orange-500 hover:bg-orange-400 text-white' :
                      isSpecial ? 'bg-gray-600 hover:bg-gray-500 text-white' :
                      'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                  >{btn}</button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('7');
  const [time, setTime] = useState('10');
  const [compound, setCompound] = useState('12');
  const [contribution, setContribution] = useState('0');
  const [result, setResult] = useState<{ total: number; interest: number; contributed: number; effectiveAnnualRate: number } | null>(null);

  const calculate = () => {
    const P = parseFloat(principal);
    const nominalAnnualRate = parseFloat(rate) / 100;
    const t = parseFloat(time);
    const compoundsPerYear = Math.max(1, parseFloat(compound) || 12);
    const monthlyContribution = parseFloat(contribution) || 0;
    if (isNaN(P) || P < 0 || isNaN(t) || t <= 0 || isNaN(nominalAnnualRate) || nominalAnnualRate < 0) return;

    const effectiveAnnualRate = nominalAnnualRate === 0
      ? 0
      : Math.pow(1 + nominalAnnualRate / compoundsPerYear, compoundsPerYear) - 1;
    const monthlyRate = effectiveAnnualRate === 0
      ? 0
      : Math.pow(1 + effectiveAnnualRate, 1 / 12) - 1;
    const months = Math.round(t * 12);

    const grownPrincipal = monthlyRate === 0
      ? P
      : P * Math.pow(1 + monthlyRate, months);
    const grownContributions = monthlyRate === 0
      ? monthlyContribution * months
      : monthlyContribution * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;

    const totalPrincipal = grownPrincipal + grownContributions;
    const contributed = P + monthlyContribution * months;
    setResult({ total: totalPrincipal, interest: totalPrincipal - contributed, contributed, effectiveAnnualRate });
  };

  const fmt = (n: number) => '$' + Math.round(n).toLocaleString();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Initial Investment ($)</label><input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Annual Interest Rate (%)</label><input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Time (years)</label><input type="number" value={time} onChange={e => setTime(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Monthly Contribution ($)</label><input type="number" value={contribution} onChange={e => setContribution(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div className="col-span-2"><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Compound Frequency</label>
          <select value={compound} onChange={e => setCompound(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            <option value="1">Annually</option><option value="4">Quarterly</option><option value="12">Monthly</option><option value="365">Daily</option>
          </select>
        </div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate</button>
      {result && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
          <div className="text-center mb-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Final Balance</div>
            <div className="text-4xl font-extrabold text-green-600">{fmt(result.total)}</div>
          </div>
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 mb-3">Effective annual rate (EAR): {(result.effectiveAnnualRate * 100).toFixed(3)}%</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center"><div className="text-xs text-gray-500 mb-1">Total Deposited</div><div className="font-bold text-gray-900 dark:text-white">{fmt(result.contributed)}</div></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center"><div className="text-xs text-gray-500 mb-1">Interest Earned</div><div className="font-bold text-green-500">{fmt(result.interest)}</div></div>
          </div>
        </div>
      )}
    </div>
  );
}

function LoanCalculator() {
  const [mode, setMode] = useState<'amortized' | 'deferred' | 'bond'>('amortized');
  const [amount, setAmount] = useState('25000');
  const [rate, setRate] = useState('6.5');
  const [term, setTerm] = useState('5');
  const [compoundPerYear, setCompoundPerYear] = useState('12');
  const [result, setResult] = useState<
    | { kind: 'amortized'; monthly: number; total: number; interest: number; effectiveAnnualRate: number }
    | { kind: 'deferred'; maturity: number; interest: number; effectiveAnnualRate: number }
    | { kind: 'bond'; presentValue: number; interest: number; effectiveAnnualRate: number }
    | null
  >(null);

  const calculate = () => {
    const P = parseFloat(amount);
    const years = parseFloat(term);
    const nominalAnnualRate = parseFloat(rate) / 100;
    const compounds = Math.max(1, parseInt(compoundPerYear) || 12);
    const n = years * 12;
    if (isNaN(P) || P <= 0 || isNaN(n) || n <= 0 || isNaN(nominalAnnualRate) || nominalAnnualRate < 0) return;

    const effectiveAnnualRate = nominalAnnualRate === 0
      ? 0
      : Math.pow(1 + nominalAnnualRate / compounds, compounds) - 1;
    const monthlyRate = effectiveAnnualRate === 0
      ? 0
      : Math.pow(1 + effectiveAnnualRate, 1 / 12) - 1;

    if (mode === 'amortized') {
      const monthly = monthlyRate === 0 ? P / n : (P * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
      const total = monthly * n;
      setResult({ kind: 'amortized', monthly, total, interest: total - P, effectiveAnnualRate });
      return;
    }

    if (mode === 'deferred') {
      const maturity = effectiveAnnualRate === 0 ? P : P * Math.pow(1 + effectiveAnnualRate, years);
      setResult({ kind: 'deferred', maturity, interest: maturity - P, effectiveAnnualRate });
      return;
    }

    const presentValue = effectiveAnnualRate === 0 ? P : P / Math.pow(1 + effectiveAnnualRate, years);
    setResult({ kind: 'bond', presentValue, interest: P - presentValue, effectiveAnnualRate });
  };

  const fmt = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-5">
      <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
        <button onClick={() => { setMode('amortized'); setResult(null); }} className={`flex-1 py-2 text-sm font-medium ${mode === 'amortized' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Amortized Loan</button>
        <button onClick={() => { setMode('deferred'); setResult(null); }} className={`flex-1 py-2 text-sm font-medium ${mode === 'deferred' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Deferred Payment</button>
        <button onClick={() => { setMode('bond'); setResult(null); }} className={`flex-1 py-2 text-sm font-medium ${mode === 'bond' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Bond (Face Value)</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{mode === 'bond' ? 'Face Value at Maturity ($)' : 'Loan Amount ($)'}</label><input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Annual Rate (%)</label><input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Term (years)</label><input type="number" value={term} onChange={e => setTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Compounding Frequency</label>
        <select value={compoundPerYear} onChange={e => setCompoundPerYear(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
          <option value="365">Daily</option>
          <option value="52">Weekly</option>
          <option value="26">Biweekly</option>
          <option value="12">Monthly</option>
          <option value="4">Quarterly</option>
          <option value="2">Semi-Annually</option>
          <option value="1">Annually</option>
        </select>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate</button>
      {result && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
          {result.kind === 'amortized' && (
            <>
              <div className="text-center mb-5"><div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Monthly Payment</div><div className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">{fmt(result.monthly)}</div></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center"><div className="text-xs text-gray-500 mb-1">Total Payment</div><div className="font-bold text-gray-900 dark:text-white">{fmt(result.total)}</div></div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center"><div className="text-xs text-gray-500 mb-1">Total Interest</div><div className="font-bold text-red-500">{fmt(result.interest)}</div></div>
              </div>
            </>
          )}
          {result.kind === 'deferred' && (
            <>
              <div className="text-center mb-5"><div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Amount Due at Maturity</div><div className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">{fmt(result.maturity)}</div></div>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center"><div className="text-xs text-gray-500 mb-1">Total Interest</div><div className="font-bold text-red-500">{fmt(result.interest)}</div></div>
              </div>
            </>
          )}
          {result.kind === 'bond' && (
            <>
              <div className="text-center mb-5"><div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Amount Received Today</div><div className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">{fmt(result.presentValue)}</div></div>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center"><div className="text-xs text-gray-500 mb-1">Discount / Interest Cost</div><div className="font-bold text-red-500">{fmt(result.interest)}</div></div>
              </div>
            </>
          )}
          <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
            Effective annual rate (EAR): {(result.effectiveAnnualRate * 100).toFixed(3)}%
          </div>
        </div>
      )}
    </div>
  );
}

function CalorieCalculator() {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activity, setActivity] = useState('1.55');
  const [result, setResult] = useState<{ bmr: number; tdee: number; lose: number; gain: number } | null>(null);

  const calculate = () => {
    const a = parseFloat(age), w = parseFloat(weight), h = parseFloat(height), act = parseFloat(activity);
    if (!a || !w || !h) return;
    const bmr = gender === 'male' ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
    const tdee = bmr * act;
    setResult({ bmr: Math.round(bmr), tdee: Math.round(tdee), lose: Math.round(tdee - 500), gain: Math.round(tdee + 500) });
  };

  return (
    <div className="space-y-5">
      <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 w-fit">
        <button onClick={() => setGender('male')} className={`px-5 py-2 text-sm font-medium ${gender === 'male' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Male</button>
        <button onClick={() => setGender('female')} className={`px-5 py-2 text-sm font-medium ${gender === 'female' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Female</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Age (years)</label><input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="30" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Weight (kg)</label><input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="70" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Height (cm)</label><input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="175" /></div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Activity Level</label>
          <select value={activity} onChange={e => setActivity(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm">
            <option value="1.2">Sedentary (little/no exercise)</option>
            <option value="1.375">Lightly active (1-3 days/wk)</option>
            <option value="1.55">Moderately active (3-5 days/wk)</option>
            <option value="1.725">Very active (6-7 days/wk)</option>
            <option value="1.9">Extra active (athlete)</option>
          </select>
        </div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate Calories</button>
      {result && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center"><div className="text-xs text-gray-500 mb-1">BMR (at rest)</div><div className="text-2xl font-bold text-gray-900 dark:text-white">{result.bmr}</div><div className="text-xs text-gray-400">cal/day</div></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center"><div className="text-xs text-gray-500 mb-1">Maintenance (TDEE)</div><div className="text-2xl font-bold text-indigo-600">{result.tdee}</div><div className="text-xs text-gray-400">cal/day</div></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center"><div className="text-xs text-gray-500 mb-1">Lose Weight</div><div className="text-2xl font-bold text-red-500">{result.lose}</div><div className="text-xs text-gray-400">cal/day (-500)</div></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center"><div className="text-xs text-gray-500 mb-1">Gain Weight</div><div className="text-2xl font-bold text-green-500">{result.gain}</div><div className="text-xs text-gray-400">cal/day (+500)</div></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Additional dedicated calculator components ────────────────────────────────

function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState('35');
  const [retirementAge, setRetirementAge] = useState('65');
  const [current, setCurrent] = useState('50000');
  const [monthly, setMonthly] = useState('500');
  const [rate, setRate] = useState('7');
  const [inflation, setInflation] = useState('3');
  const [preRetIncome, setPreRetIncome] = useState('70000');
  const [replacePct, setReplacePct] = useState('80');
  const [otherMonthlyIncome, setOtherMonthlyIncome] = useState('0');
  const [result, setResult] = useState<{
    nominal: number;
    real: number;
    contributed: number;
    interest: number;
    annualIncomeTarget: number;
    annualPortfolioNeed: number;
    requiredNestEgg: number;
    monthlyFromPortfolio: number;
    readinessGap: number;
  } | null>(null);

  const calculate = () => {
    const P = parseFloat(current);
    const pmt = parseFloat(monthly);
    const annualRate = parseFloat(rate) / 100;
    const r = annualRate / 12;
    const ageNow = parseFloat(currentAge);
    const ageRetire = parseFloat(retirementAge);
    const yearsToRetirement = ageRetire - ageNow;
    const n = yearsToRetirement * 12;
    const inf = parseFloat(inflation) / 100;
    const income = parseFloat(preRetIncome) || 0;
    const replace = (parseFloat(replacePct) || 80) / 100;
    const otherIncomeAnnual = (parseFloat(otherMonthlyIncome) || 0) * 12;

    if (isNaN(P) || isNaN(pmt) || isNaN(n) || n <= 0 || isNaN(ageNow) || isNaN(ageRetire) || ageRetire <= ageNow) return;

    const nominal = r === 0 ? P + pmt * n : P * Math.pow(1 + r, n) + pmt * (Math.pow(1 + r, n) - 1) / r;
    const realRate = (1 + parseFloat(rate) / 100) / (1 + inf) - 1;
    const realMonthly = realRate / 12;
    const real = realMonthly === 0
      ? P + pmt * n
      : P * Math.pow(1 + realMonthly, n) + pmt * (Math.pow(1 + realMonthly, n) - 1) / realMonthly;
    const contributed = P + pmt * n;

    const annualIncomeTarget = income * replace;
    const annualPortfolioNeed = Math.max(0, annualIncomeTarget - otherIncomeAnnual);
    const requiredNestEgg = annualPortfolioNeed / 0.04;
    const monthlyFromPortfolio = nominal * 0.04 / 12;
    const readinessGap = requiredNestEgg - nominal;

    setResult({
      nominal,
      real,
      contributed,
      interest: nominal - contributed,
      annualIncomeTarget,
      annualPortfolioNeed,
      requiredNestEgg,
      monthlyFromPortfolio,
      readinessGap,
    });
  };
  const fmt = (n: number) => '$' + Math.round(n).toLocaleString();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Current Age</label><input type="number" value={currentAge} onChange={e => setCurrentAge(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Retirement Age</label><input type="number" value={retirementAge} onChange={e => setRetirementAge(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Current Savings ($)</label><input type="number" value={current} onChange={e => setCurrent(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Monthly Contribution ($)</label><input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Annual Return (%)</label><input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div className="flex items-end"><div className="w-full rounded-lg border border-dashed border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-600 dark:text-gray-300">Years to retirement: <span className="font-semibold">{Math.max(0, (parseFloat(retirementAge) || 0) - (parseFloat(currentAge) || 0))}</span></div></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Current Annual Income ($)</label><input type="number" value={preRetIncome} onChange={e => setPreRetIncome(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Income Needed in Retirement (%)</label><input type="number" step="1" value={replacePct} onChange={e => setReplacePct(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Other Retirement Income ($/month)</label><input type="number" value={otherMonthlyIncome} onChange={e => setOtherMonthlyIncome(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Inflation Rate (%)</label><input type="number" step="0.1" value={inflation} onChange={e => setInflation(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate Retirement</button>
      {result && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 space-y-4">
          <div className="text-center"><div className="text-sm text-gray-500 dark:text-gray-400">Projected Balance</div><div className="text-4xl font-extrabold text-green-600">{fmt(result.nominal)}</div></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-500 mb-1">Real Value (today&apos;s $)</div><div className="font-bold text-indigo-600">{fmt(result.real)}</div></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-500 mb-1">Interest Earned</div><div className="font-bold text-green-500">{fmt(result.interest)}</div></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center col-span-2"><div className="text-xs text-gray-500 mb-1">Total Contributed</div><div className="font-bold text-gray-900 dark:text-white">{fmt(result.contributed)}</div></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-500 mb-1">80% Rule Target Income (annual)</div><div className="font-bold">{fmt(result.annualIncomeTarget)}</div></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-500 mb-1">Needed from Portfolio (annual)</div><div className="font-bold">{fmt(result.annualPortfolioNeed)}</div></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-500 mb-1">Required Nest Egg (4% rule)</div><div className="font-bold">{fmt(result.requiredNestEgg)}</div></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-500 mb-1">Estimated Safe Monthly Withdrawal</div><div className="font-bold">{fmt(result.monthlyFromPortfolio)}</div></div>
          </div>
          <div className={`rounded-lg p-3 text-center ${result.readinessGap <= 0 ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
            <div className="text-xs text-gray-500 mb-1">Retirement Readiness Gap</div>
            <div className={`font-bold ${result.readinessGap <= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {result.readinessGap <= 0 ? `On track (+${fmt(Math.abs(result.readinessGap))})` : `Short by ${fmt(result.readinessGap)}`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SavingsCalculator() {
  const [principal, setPrincipal] = useState('1000');
  const [monthly, setMonthly] = useState('100');
  const [rate, setRate] = useState('5');
  const [years, setYears] = useState('10');
  const [result, setResult] = useState<{ total: number; contributed: number; interest: number } | null>(null);

  const calculate = () => {
    const P = parseFloat(principal), pmt = parseFloat(monthly);
    const r = parseFloat(rate) / 100 / 12, n = parseFloat(years) * 12;
    if (isNaN(P) || isNaN(pmt) || !r || !n) return;
    const total = P * Math.pow(1 + r, n) + pmt * (Math.pow(1 + r, n) - 1) / r;
    const contributed = P + pmt * n;
    setResult({ total, contributed, interest: total - contributed });
  };
  const fmt = (n: number) => '$' + Math.round(n).toLocaleString();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Initial Deposit ($)</label><input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Monthly Deposit ($)</label><input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Annual Interest Rate (%)</label><input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Time Period (years)</label><input type="number" value={years} onChange={e => setYears(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate Savings</button>
      {result && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
          <div className="text-center mb-4"><div className="text-sm text-gray-500 dark:text-gray-400">Final Balance</div><div className="text-4xl font-extrabold text-green-600">{fmt(result.total)}</div></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-500 mb-1">Total Deposited</div><div className="font-bold">{fmt(result.contributed)}</div></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-500 mb-1">Interest Earned</div><div className="font-bold text-green-500">{fmt(result.interest)}</div></div>
          </div>
        </div>
      )}
    </div>
  );
}

function InvestmentCalculator() {
  const [pv, setPv] = useState('10000');
  const [rate, setRate] = useState('8');
  const [years, setYears] = useState('10');
  const [additional, setAdditional] = useState('0');
  const [contribFreq, setContribFreq] = useState<'annual' | 'monthly'>('annual');
  const [result, setResult] = useState<{ fv: number; contributed: number; gain: number; annualizedGrowthOnDeposits: number; assumedRate: number } | null>(null);

  const calculate = () => {
    const P = parseFloat(pv);
    const annualRate = parseFloat(rate) / 100;
    const t = parseFloat(years);
    const pmt = parseFloat(additional) || 0;
    if (isNaN(P) || isNaN(t) || t <= 0) return;

    let fv = 0;
    let contributed = P;

    if (contribFreq === 'annual') {
      const r = annualRate;
      fv = r === 0 ? P + pmt * t : P * Math.pow(1 + r, t) + pmt * (Math.pow(1 + r, t) - 1) / r;
      contributed = P + pmt * t;
    } else {
      const n = t * 12;
      const r = annualRate / 12;
      fv = r === 0 ? P + pmt * n : P * Math.pow(1 + r, n) + pmt * (Math.pow(1 + r, n) - 1) / r;
      contributed = P + pmt * n;
    }

    const annualizedGrowthOnDeposits = t > 0 && contributed > 0 ? (Math.pow(fv / contributed, 1 / t) - 1) * 100 : 0;
    setResult({ fv, contributed, gain: fv - contributed, annualizedGrowthOnDeposits, assumedRate: annualRate * 100 });
  };
  const fmt = (n: number) => '$' + Math.round(n).toLocaleString();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Initial Investment ($)</label><input type="number" value={pv} onChange={e => setPv(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Annual Return (%)</label><input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Time Period (years)</label><input type="number" value={years} onChange={e => setYears(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Contribution Amount ($)</label><input type="number" value={additional} onChange={e => setAdditional(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div className="col-span-2"><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Contribution Frequency</label><select value={contribFreq} onChange={e => setContribFreq(e.target.value as 'annual' | 'monthly')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"><option value="annual">Annual</option><option value="monthly">Monthly</option></select></div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate Investment</button>
      {result && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
          <div className="text-center mb-4"><div className="text-sm text-gray-500 dark:text-gray-400">Future Value</div><div className="text-4xl font-extrabold text-green-600">{fmt(result.fv)}</div></div>
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 mb-3">Assumed annual return: {result.assumedRate.toFixed(2)}%</div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-500 mb-1">Total Invested</div><div className="font-bold">{fmt(result.contributed)}</div></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-500 mb-1">Investment Gain</div><div className="font-bold text-green-500">{fmt(result.gain)}</div></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-500 mb-1">Annualized Growth on Deposits</div><div className="font-bold text-indigo-600">{result.annualizedGrowthOnDeposits.toFixed(2)}%</div></div>
          </div>
        </div>
      )}
    </div>
  );
}

function BMRCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('175');
  const [age, setAge] = useState('30');
  const [result, setResult] = useState<{ bmr: number; sedentary: number; light: number; moderate: number; active: number; veryActive: number } | null>(null);

  const calculate = () => {
    const w = parseFloat(weight), h = parseFloat(height), a = parseFloat(age);
    if (!w || !h || !a) return;
    const bmr = gender === 'male' ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
    setResult({ bmr: Math.round(bmr), sedentary: Math.round(bmr * 1.2), light: Math.round(bmr * 1.375), moderate: Math.round(bmr * 1.55), active: Math.round(bmr * 1.725), veryActive: Math.round(bmr * 1.9) });
  };

  return (
    <div className="space-y-5">
      <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 w-fit">
        <button onClick={() => setGender('male')} className={`px-5 py-2 text-sm font-medium ${gender === 'male' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Male</button>
        <button onClick={() => setGender('female')} className={`px-5 py-2 text-sm font-medium ${gender === 'female' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Female</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Weight (kg)</label><input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Height (cm)</label><input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Age (years)</label><input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate BMR</button>
      {result && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 space-y-3">
          <div className="text-center"><div className="text-sm text-gray-500 dark:text-gray-400">Basal Metabolic Rate</div><div className="text-4xl font-extrabold text-indigo-600">{result.bmr} <span className="text-lg font-normal">cal/day</span></div></div>
          <div className="space-y-2 mt-4">
            {[['Sedentary', result.sedentary], ['Lightly Active', result.light], ['Moderately Active', result.moderate], ['Very Active', result.active], ['Extra Active', result.veryActive]].map(([label, val]) => (
              <div key={label as string} className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg px-4 py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
                <span className="font-bold text-gray-900 dark:text-white">{val} cal/day</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MacroCalculator() {
  const [calories, setCalories] = useState('2000');
  const [goal, setGoal] = useState<'maintain' | 'lose' | 'gain'>('maintain');
  const [result, setResult] = useState<{ protein: number; carbs: number; fat: number; calories: number } | null>(null);

  const calculate = () => {
    const cal = parseFloat(calories);
    if (!cal) return;
    let adj = cal;
    if (goal === 'lose') adj = cal - 500;
    if (goal === 'gain') adj = cal + 500;
    const protein = Math.round(adj * 0.3 / 4);
    const fat = Math.round(adj * 0.25 / 9);
    const carbs = Math.round(adj * 0.45 / 4);
    setResult({ protein, carbs, fat, calories: Math.round(adj) });
  };

  return (
    <div className="space-y-5">
      <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
        {([['maintain', 'Maintain'], ['lose', 'Lose Weight'], ['gain', 'Gain Muscle']] as [string, string][]).map(([g, label]) => (
          <button key={g} onClick={() => setGoal(g as 'maintain'|'lose'|'gain')} className={`flex-1 py-2 text-sm font-medium ${goal === g ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>{label}</button>
        ))}
      </div>
      <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Daily Maintenance Calories</label><input type="number" value={calories} onChange={e => setCalories(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate Macros</button>
      {result && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
          <div className="text-center mb-4"><div className="text-sm text-gray-500 dark:text-gray-400">Target Calories</div><div className="text-3xl font-extrabold text-indigo-600">{result.calories} cal/day</div></div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Protein (30%)</div><div className="text-2xl font-bold text-red-600">{result.protein}g</div></div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Carbs (45%)</div><div className="text-2xl font-bold text-yellow-600">{result.carbs}g</div></div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Fat (25%)</div><div className="text-2xl font-bold text-blue-600">{result.fat}g</div></div>
          </div>
        </div>
      )}
    </div>
  );
}

function DateCalculator() {
  const [tab, setTab] = useState<'diff' | 'add'>('diff');
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [includeEnd, setIncludeEnd] = useState(false);
  const [businessOnly, setBusinessOnly] = useState(false);
  const [diffResult, setDiffResult] = useState<{ years: number; months: number; days: number; totalDays: number; totalWeeks: number; businessDays: number; weekends: number } | null>(null);
  const [addDate, setAddDate] = useState('');
  const [addYears, setAddYears] = useState('0');
  const [addMonths, setAddMonths] = useState('0');
  const [addWeeks, setAddWeeks] = useState('0');
  const [addDays, setAddDays] = useState('0');
  const [addOp, setAddOp] = useState<'+' | '-'>('+');
  const [addResult, setAddResult] = useState<string | null>(null);

  const countBusinessDays = (start: Date, end: Date) => {
    let count = 0;
    const cur = new Date(start);
    while (cur <= end) {
      const d = cur.getDay();
      if (d !== 0 && d !== 6) count++;
      cur.setDate(cur.getDate() + 1);
    }
    return count;
  };

  const calculateDiff = () => {
    if (!date1 || !date2) return;
    const earlier = date1 <= date2 ? date1 : date2;
    const later = date1 <= date2 ? date2 : date1;
    const start = new Date(earlier + 'T00:00:00');
    const end = new Date(later + 'T00:00:00');

    const calDays = Math.floor((end.getTime() - start.getTime()) / 86400000) + (includeEnd ? 1 : 0);

    // For years/months/days breakdown, use a copy of end adjusted for includeEnd
    const endAdj = new Date(later + 'T00:00:00');
    if (includeEnd) endAdj.setDate(endAdj.getDate() + 1);
    let years = endAdj.getFullYear() - start.getFullYear();
    let months = endAdj.getMonth() - start.getMonth();
    let days = endAdj.getDate() - start.getDate();
    if (days < 0) { months--; const prev = new Date(endAdj.getFullYear(), endAdj.getMonth(), 0); days += prev.getDate(); }
    if (months < 0) { years--; months += 12; }

    // Business days between start and end (inclusive of end when includeEnd)
    const bEnd = new Date(later + 'T00:00:00');
    if (includeEnd) bEnd.setDate(bEnd.getDate() + 1);
    const bDays = countBusinessDays(start, new Date(bEnd.getTime() - 86400000 > start.getTime() ? bEnd.getTime() - 86400000 : start.getTime()));

    setDiffResult({ years, months, days, totalDays: calDays, totalWeeks: Math.floor(calDays / 7), businessDays: bDays, weekends: calDays - bDays });
  };

  const calculateAdd = () => {
    if (!addDate) return;
    const d = new Date(addDate + 'T00:00:00');
    const sign = addOp === '+' ? 1 : -1;
    d.setFullYear(d.getFullYear() + sign * parseInt(addYears || '0'));
    d.setMonth(d.getMonth() + sign * parseInt(addMonths || '0'));
    d.setDate(d.getDate() + sign * (parseInt(addWeeks || '0') * 7 + parseInt(addDays || '0')));
    setAddResult(d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  };

  return (
    <div className="space-y-5">
      <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 w-fit">
        <button onClick={() => setTab('diff')} className={`px-5 py-2 text-sm font-medium ${tab === 'diff' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Date Difference</button>
        <button onClick={() => setTab('add')} className={`px-5 py-2 text-sm font-medium ${tab === 'add' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Add / Subtract</button>
      </div>

      {tab === 'diff' ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Start Date</label><input type="date" value={date1} onChange={e => setDate1(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
            <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">End Date</label><input type="date" value={date2} onChange={e => setDate2(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
              <input type="checkbox" checked={includeEnd} onChange={e => setIncludeEnd(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
              Include end date
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
              <input type="checkbox" checked={businessOnly} onChange={e => setBusinessOnly(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
              Highlight business days
            </label>
          </div>
          <button onClick={calculateDiff} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate Difference</button>
          {diffResult && (
            <div className="space-y-3">
              <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">Duration</div>
                <div className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-300">
                  {diffResult.years > 0 && `${diffResult.years}y `}{diffResult.months > 0 && `${diffResult.months}mo `}{diffResult.days}d
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[['Total Days', diffResult.totalDays.toLocaleString()], ['Total Weeks', diffResult.totalWeeks.toLocaleString()], ['Business Days', diffResult.businessDays.toLocaleString()], ['Weekends/Holidays', diffResult.weekends.toLocaleString()]].map(([label, val]) => (
                  <div key={label} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center"><div className="text-xs text-gray-500 mb-1">{label}</div><div className="font-bold text-gray-900 dark:text-white">{val}</div></div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Starting Date</label>
            <input type="date" value={addDate} onChange={e => setAddDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
          </div>
          <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 w-fit">
            <button onClick={() => setAddOp('+')} className={`px-5 py-2 text-sm font-medium ${addOp === '+' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Add (+)</button>
            <button onClick={() => setAddOp('-')} className={`px-5 py-2 text-sm font-medium ${addOp === '-' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Subtract (−)</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[['Years', addYears, setAddYears], ['Months', addMonths, setAddMonths], ['Weeks', addWeeks, setAddWeeks], ['Days', addDays, setAddDays]].map(([label, val, setter]) => (
              <div key={label as string}>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{label as string}</label>
                <input type="number" min="0" value={val as string} onChange={e => (setter as (v: string) => void)(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="0" />
              </div>
            ))}
          </div>
          <button onClick={calculateAdd} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate Date</button>
          {addResult && (
            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-5 text-center">
              <div className="text-xs text-gray-500 mb-2">Result</div>
              <div className="text-xl font-bold text-indigo-700 dark:text-indigo-300">{addResult}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FractionCalculator() {
  const [n1, setN1] = useState('1');
  const [d1, setD1] = useState('2');
  const [op, setOp] = useState('+');
  const [n2, setN2] = useState('1');
  const [d2, setD2] = useState('3');
  const [result, setResult] = useState<string | null>(null);

  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);

  const calculate = () => {
    const a = parseInt(n1), b = parseInt(d1), c = parseInt(n2), d = parseInt(d2);
    if (!b || !d) return;
    let rn: number, rd: number;
    if (op === '+') { rn = a * d + c * b; rd = b * d; }
    else if (op === '-') { rn = a * d - c * b; rd = b * d; }
    else if (op === '×') { rn = a * c; rd = b * d; }
    else { rn = a * d; rd = b * c; }
    if (!rd) { setResult('Division by zero'); return; }
    const g = gcd(Math.abs(rn), Math.abs(rd));
    const sn = rn / g, sd = rd / g;
    const decimal = sn / sd;
    setResult(sd === 1 ? `${sn}` : `${sn}/${sd} = ${decimal.toFixed(6).replace(/\.?0+$/, '')}`);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="text-center">
          <input type="number" value={n1} onChange={e => setN1(e.target.value)} className="w-16 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-center focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
          <div className="border-t-2 border-gray-400 my-1" />
          <input type="number" value={d1} onChange={e => setD1(e.target.value)} className="w-16 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-center focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          {['+', '-', '×', '÷'].map(o => <button key={o} onClick={() => setOp(o)} className={`w-10 h-10 rounded-lg font-bold text-lg ${op === o ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>{o}</button>)}
        </div>
        <div className="text-center">
          <input type="number" value={n2} onChange={e => setN2(e.target.value)} className="w-16 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-center focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
          <div className="border-t-2 border-gray-400 my-1" />
          <input type="number" value={d2} onChange={e => setD2(e.target.value)} className="w-16 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-center focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
        </div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate</button>
      {result && <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded-xl p-5 text-center text-2xl font-bold text-indigo-700 dark:text-indigo-300">= {result}</div>}
    </div>
  );
}

function StatisticsCalculator() {
  const [input, setInput] = useState('5, 7, 3, 9, 1, 8, 2, 6, 4');
  const [result, setResult] = useState<{ mean: number; median: number; mode: string; range: number; stdDev: number; variance: number; min: number; max: number } | null>(null);

  const calculate = () => {
    const nums = input.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
    if (!nums.length) return;
    const sorted = [...nums].sort((a, b) => a - b);
    const mean = nums.reduce((s, n) => s + n, 0) / nums.length;
    const median = sorted.length % 2 === 0 ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2 : sorted[Math.floor(sorted.length / 2)];
    const freq: Record<number, number> = {};
    nums.forEach(n => { freq[n] = (freq[n] || 0) + 1; });
    const maxFreq = Math.max(...Object.values(freq));
    const modes = Object.keys(freq).filter(k => freq[+k] === maxFreq);
    const variance = nums.reduce((s, n) => s + Math.pow(n - mean, 2), 0) / nums.length;
    setResult({ mean: +mean.toFixed(4), median: +median.toFixed(4), mode: maxFreq === 1 ? 'No mode' : modes.join(', '), range: sorted[sorted.length - 1] - sorted[0], stdDev: +Math.sqrt(variance).toFixed(4), variance: +variance.toFixed(4), min: sorted[0], max: sorted[sorted.length - 1] });
  };

  return (
    <div className="space-y-5">
      <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Enter Numbers (comma or space separated)</label><textarea value={input} onChange={e => setInput(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono" /></div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate Statistics</button>
      {result && (
        <div className="grid grid-cols-2 gap-3">
          {[['Mean', result.mean], ['Median', result.median], ['Mode', result.mode], ['Range', result.range], ['Std Deviation', result.stdDev], ['Variance', result.variance], ['Min', result.min], ['Max', result.max]].map(([label, val]) => (
            <div key={label as string} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">{label}</div><div className="font-bold text-gray-900 dark:text-white">{val}</div></div>
          ))}
        </div>
      )}
    </div>
  );
}

function QuadraticCalculator() {
  const [a, setA] = useState('1');
  const [b, setB] = useState('-5');
  const [c, setC] = useState('6');
  const [result, setResult] = useState<{ x1: string; x2: string; discriminant: number; vertex: string } | null>(null);

  const calculate = () => {
    const av = parseFloat(a), bv = parseFloat(b), cv = parseFloat(c);
    if (!av) return;
    const disc = bv * bv - 4 * av * cv;
    const vx = -bv / (2 * av), vy = av * vx * vx + bv * vx + cv;
    let x1: string, x2: string;
    if (disc > 0) { x1 = String((-bv + Math.sqrt(disc)) / (2 * av)); x2 = String((-bv - Math.sqrt(disc)) / (2 * av)); }
    else if (disc === 0) { x1 = x2 = String(-bv / (2 * av)); }
    else { const re = (-bv / (2 * av)).toFixed(4); const im = (Math.sqrt(-disc) / (2 * av)).toFixed(4); x1 = `${re} + ${im}i`; x2 = `${re} - ${im}i`; }
    setResult({ x1, x2, discriminant: disc, vertex: `(${vx.toFixed(4)}, ${vy.toFixed(4)})` });
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500 dark:text-gray-400">Solve ax² + bx + c = 0</p>
      <div className="grid grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">a</label><input type="number" value={a} onChange={e => setA(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">b</label><input type="number" value={b} onChange={e => setB(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">c</label><input type="number" value={c} onChange={e => setC(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Solve</button>
      {result && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3 text-center"><div className="text-xs text-gray-500 mb-1">x₁</div><div className="font-bold text-indigo-700 dark:text-indigo-300">{result.x1}</div></div>
            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3 text-center"><div className="text-xs text-gray-500 mb-1">x₂</div><div className="font-bold text-indigo-700 dark:text-indigo-300">{result.x2}</div></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Discriminant</div><div className="font-bold">{result.discriminant.toFixed(4)}</div></div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Vertex</div><div className="font-bold">{result.vertex}</div></div>
          </div>
        </div>
      )}
    </div>
  );
}

function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let chars = '';
    if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) return;
    let pwd = '';
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    for (let i = 0; i < length; i++) pwd += chars[arr[i] % chars.length];
    setPassword(pwd);
    setCopied(false);
  };

  const copy = () => { navigator.clipboard.writeText(password); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="space-y-5">
      <div><label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Length: {length}</label><input type="range" min="8" max="64" value={length} onChange={e => setLength(+e.target.value)} className="w-full accent-indigo-600" /></div>
      <div className="grid grid-cols-2 gap-3">
        {[['Uppercase (A-Z)', upper, setUpper], ['Lowercase (a-z)', lower, setLower], ['Numbers (0-9)', numbers, setNumbers], ['Symbols (!@#$)', symbols, setSymbols]].map(([label, val, setter]) => (
          <label key={label as string} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={val as boolean} onChange={e => (setter as (v: boolean) => void)(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{label as string}</span>
          </label>
        ))}
      </div>
      <button onClick={generate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Generate Password</button>
      {password && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
          <div className="font-mono text-lg break-all text-gray-900 dark:text-white mb-3">{password}</div>
          <button onClick={copy} className={`w-full py-2 rounded-lg font-semibold text-sm transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-300'}`}>{copied ? '✓ Copied!' : 'Copy to Clipboard'}</button>
        </div>
      )}
    </div>
  );
}

function RandomNumberGenerator() {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('1');
  const [result, setResult] = useState<number[] | null>(null);

  const generate = () => {
    const mn = parseInt(min), mx = parseInt(max), cnt = Math.min(parseInt(count) || 1, 100);
    if (mn >= mx) return;
    const nums = Array.from({ length: cnt }, () => Math.floor(Math.random() * (mx - mn + 1)) + mn);
    setResult(nums);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Minimum</label><input type="number" value={min} onChange={e => setMin(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Maximum</label><input type="number" value={max} onChange={e => setMax(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">How Many?</label><input type="number" min="1" max="100" value={count} onChange={e => setCount(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
      </div>
      <button onClick={generate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">🎲 Generate</button>
      {result && (
        <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-5">
          {result.length === 1 ? <div className="text-6xl font-extrabold text-indigo-600 text-center">{result[0]}</div> : <div className="flex flex-wrap gap-2">{result.map((n, i) => <span key={i} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold text-lg">{n}</span>)}</div>}
        </div>
      )}
    </div>
  );
}

function DiceRoller() {
  const [sides, setSides] = useState('6');
  const [count, setCount] = useState('2');
  const [result, setResult] = useState<{ rolls: number[]; total: number } | null>(null);

  const roll = () => {
    const s = parseInt(sides), c = Math.min(parseInt(count) || 1, 20);
    if (!s || s < 2) return;
    const rolls = Array.from({ length: c }, () => Math.floor(Math.random() * s) + 1);
    setResult({ rolls, total: rolls.reduce((a, b) => a + b, 0) });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Dice Type</label>
          <select value={sides} onChange={e => setSides(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            {['4', '6', '8', '10', '12', '20', '100'].map(s => <option key={s} value={s}>d{s}</option>)}
          </select>
        </div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Number of Dice</label><input type="number" min="1" max="20" value={count} onChange={e => setCount(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
      </div>
      <button onClick={roll} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors text-xl">🎲 Roll Dice</button>
      {result && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 text-center">
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            {result.rolls.map((r, i) => <div key={i} className="w-14 h-14 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-2xl font-extrabold shadow-lg">{r}</div>)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total: <span className="text-2xl font-extrabold text-indigo-600">{result.total}</span></div>
        </div>
      )}
    </div>
  );
}

function HeightConverter() {
  const [mode, setMode] = useState<'ftcm' | 'cmft'>('ftcm');
  const [ft, setFt] = useState('5');
  const [inch, setInch] = useState('10');
  const [cm, setCm] = useState('178');
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    if (mode === 'ftcm') {
      const totalIn = parseFloat(ft) * 12 + parseFloat(inch);
      setResult(`${(totalIn * 2.54).toFixed(1)} cm`);
    } else {
      const totalIn = parseFloat(cm) / 2.54;
      const f = Math.floor(totalIn / 12), i = (totalIn % 12).toFixed(1);
      setResult(`${f} ft ${i} in`);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 w-fit">
        <button onClick={() => setMode('ftcm')} className={`px-5 py-2 text-sm font-medium ${mode === 'ftcm' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>ft/in → cm</button>
        <button onClick={() => setMode('cmft')} className={`px-5 py-2 text-sm font-medium ${mode === 'cmft' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>cm → ft/in</button>
      </div>
      {mode === 'ftcm' ? (
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Feet</label><input type="number" value={ft} onChange={e => setFt(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
          <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Inches</label><input type="number" value={inch} onChange={e => setInch(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        </div>
      ) : (
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Centimeters</label><input type="number" value={cm} onChange={e => setCm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
      )}
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Convert</button>
      {result && <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded-xl p-5 text-center text-3xl font-extrabold text-indigo-700 dark:text-indigo-300">{result}</div>}
    </div>
  );
}

function PregnancyCalculator() {
  const [mode, setMode] = useState<'lmp' | 'duedate' | 'conception'>('lmp');
  const [lmp, setLmp] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [conception, setConception] = useState('');
  const [result, setResult] = useState<{ dueDate: string; lmpDate: string; conceptionDate: string; weeks: number; days: number; trimester: number; progress: number; weekLabel: string } | null>(null);

  const MILESTONE_WEEKS: Record<number, string> = {
    4: 'Size of a poppy seed', 8: 'Size of a raspberry', 12: 'End of 1st trimester – size of a lime',
    16: 'Size of an avocado', 20: 'Halfway point – size of a banana', 24: 'Size of an ear of corn',
    28: 'End of 2nd trimester – size of an eggplant', 32: 'Size of a squash', 36: 'Size of a papaya',
    40: 'Full term – size of a watermelon',
  };

  const getWeekLabel = (weeks: number) => {
    const keys = Object.keys(MILESTONE_WEEKS).map(Number).sort((a, b) => b - a);
    const key = keys.find(k => weeks >= k);
    return key !== undefined ? MILESTONE_WEEKS[key] : 'Growing every day!';
  };

  const calculate = () => {
    let lmpDate: Date;
    if (mode === 'lmp') {
      if (!lmp) return;
      lmpDate = new Date(lmp + 'T00:00:00');
    } else if (mode === 'duedate') {
      if (!dueDate) return;
      lmpDate = new Date(dueDate + 'T00:00:00');
      lmpDate.setDate(lmpDate.getDate() - 280);
    } else {
      if (!conception) return;
      lmpDate = new Date(conception + 'T00:00:00');
      lmpDate.setDate(lmpDate.getDate() - 14);
    }
    const due = new Date(lmpDate); due.setDate(due.getDate() + 280);
    const concDate = new Date(lmpDate); concDate.setDate(concDate.getDate() + 14);
    const today = new Date();
    const diffMs = today.getTime() - lmpDate.getTime();
    const totalDays = Math.floor(diffMs / 86400000);
    const weeks = Math.floor(totalDays / 7);
    const days = totalDays % 7;
    const trimester = weeks < 13 ? 1 : weeks < 27 ? 2 : 3;
    const progress = Math.min(100, Math.round((totalDays / 280) * 100));
    setResult({
      dueDate: due.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      lmpDate: lmpDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      conceptionDate: concDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      weeks, days, trimester, progress, weekLabel: getWeekLabel(weeks),
    });
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-5">
      <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
        {([['lmp', 'Last Period'], ['conception', 'Conception Date'], ['duedate', 'Due Date']] as [string, string][]).map(([m, label]) => (
          <button key={m} onClick={() => { setMode(m as typeof mode); setResult(null); }} className={`flex-1 py-2 text-xs font-medium ${mode === m ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>{label}</button>
        ))}
      </div>
      {mode === 'lmp' && <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">First Day of Last Menstrual Period</label><input type="date" value={lmp} onChange={e => setLmp(e.target.value)} max={todayStr} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>}
      {mode === 'duedate' && <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Known Due Date (EDD)</label><input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>}
      {mode === 'conception' && <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Estimated Conception Date</label><input type="date" value={conception} onChange={e => setConception(e.target.value)} max={todayStr} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>}
      <p className="text-xs text-gray-400">Based on standard Naegele&apos;s rule (LMP + 280 days). Assumes a 28-day cycle.</p>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate</button>
      {result && (
        <div className="space-y-3">
          <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-5">
            <div className="text-xs text-gray-500 mb-1">Estimated Due Date</div>
            <div className="text-xl font-bold text-pink-600 dark:text-pink-400">{result.dueDate}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center"><div className="text-xs text-gray-500 mb-1">Gestational Age</div><div className="font-bold text-lg">{result.weeks}w {result.days}d</div></div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center"><div className="text-xs text-gray-500 mb-1">Trimester</div><div className="font-bold">{result.trimester === 1 ? '1st (0–12w)' : result.trimester === 2 ? '2nd (13–26w)' : '3rd (27–40w)'}</div></div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center"><div className="text-xs text-gray-500 mb-1">LMP Date</div><div className="font-bold text-xs">{result.lmpDate}</div></div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center"><div className="text-xs text-gray-500 mb-1">Est. Conception</div><div className="font-bold text-xs">{result.conceptionDate}</div></div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Progress</span><span>{result.progress}% · Week {result.weeks}</span></div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5"><div className="bg-pink-500 h-2.5 rounded-full transition-all" style={{ width: `${result.progress}%` }} /></div>
            <div className="text-xs text-gray-500 mt-2 italic">{result.weekLabel}</div>
          </div>
          <p className="text-xs text-gray-400 italic">⚕️ This is an estimate only. Always confirm dates with your healthcare provider.</p>
        </div>
      )}
    </div>
  );
}

function AmortizationCalculator() {
  const [amount, setAmount] = useState('250000');
  const [rate, setRate] = useState('6.5');
  const [term, setTerm] = useState('30');
  const [extra, setExtra] = useState('0');
  const [rowsToShow, setRowsToShow] = useState('12');
  const [result, setResult] = useState<{
    monthly: number;
    total: number;
    interest: number;
    payoffMonths: number;
    interestSaved: number;
    monthsSaved: number;
    schedule: { month: number; payment: number; principal: number; interest: number; balance: number }[];
  } | null>(null);

  const calculate = () => {
    const P = parseFloat(amount);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseFloat(term) * 12;
    const extraPay = Math.max(0, parseFloat(extra) || 0);
    if (!P || !n) return;

    const monthly = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    const simulate = (extraMonthly: number, captureRows = false) => {
      let balance = P;
      let month = 0;
      let totalInterest = 0;
      const rows: { month: number; payment: number; principal: number; interest: number; balance: number }[] = [];

      while (balance > 0.01 && month < n + 360) {
        const int = r === 0 ? 0 : balance * r;
        const principalPart = Math.min(monthly - int + extraMonthly, balance);
        const payment = principalPart + int;
        balance = Math.max(0, balance - principalPart);
        totalInterest += int;
        month++;

        if (captureRows) {
          rows.push({ month, payment, principal: principalPart, interest: int, balance });
        }
      }

      return { payoffMonths: month, totalInterest, rows };
    };

    const base = simulate(0, false);
    const withExtra = simulate(extraPay, true);
    const totalPaid = P + withExtra.totalInterest;

    setResult({
      monthly,
      total: totalPaid,
      interest: withExtra.totalInterest,
      payoffMonths: withExtra.payoffMonths,
      interestSaved: Math.max(0, base.totalInterest - withExtra.totalInterest),
      monthsSaved: Math.max(0, base.payoffMonths - withExtra.payoffMonths),
      schedule: withExtra.rows,
    });
  };
  const fmt = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const visibleSchedule = result
    ? (rowsToShow === 'all' ? result.schedule : result.schedule.slice(0, Math.max(1, parseInt(rowsToShow) || 12)))
    : [];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Loan Amount ($)</label><input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Annual Rate (%)</label><input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Term (years)</label><input type="number" value={term} onChange={e => setTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
      </div>
      <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Extra Monthly Payment ($)</label><input type="number" value={extra} onChange={e => setExtra(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Schedule Rows to Show</label>
        <select value={rowsToShow} onChange={e => setRowsToShow(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
          <option value="12">First 12 months</option>
          <option value="24">First 24 months</option>
          <option value="60">First 60 months</option>
          <option value="120">First 120 months</option>
          <option value="all">Full schedule</option>
        </select>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Generate Schedule</button>
      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Monthly Payment</div><div className="font-bold text-indigo-600">{fmt(result.monthly)}</div></div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Total Payment</div><div className="font-bold">{fmt(result.total)}</div></div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Total Interest</div><div className="font-bold text-red-500">{fmt(result.interest)}</div></div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Payoff Time</div><div className="font-bold">{result.payoffMonths} months</div></div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Months Saved</div><div className="font-bold text-emerald-600">{result.monthsSaved}</div></div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Interest Saved</div><div className="font-bold text-emerald-600">{fmt(result.interestSaved)}</div></div>
          </div>
          <div className="overflow-x-auto"><table className="w-full text-xs text-left"><thead><tr className="bg-gray-100 dark:bg-gray-700">{['Month', 'Payment', 'Principal', 'Interest', 'Balance'].map(h => <th key={h} className="px-3 py-2 font-semibold text-gray-600 dark:text-gray-300">{h}</th>)}</tr></thead><tbody>{visibleSchedule.map(row => <tr key={row.month} className="border-t border-gray-100 dark:border-gray-700"><td className="px-3 py-2">{row.month}</td><td className="px-3 py-2">{fmt(row.payment)}</td><td className="px-3 py-2 text-green-600">{fmt(row.principal)}</td><td className="px-3 py-2 text-red-500">{fmt(row.interest)}</td><td className="px-3 py-2">{fmt(row.balance)}</td></tr>)}</tbody></table></div>
          <p className="text-xs text-gray-400 text-center">Showing {visibleSchedule.length} of {result.schedule.length} months in schedule</p>
        </div>
      )}
    </div>
  );
}

function CreditCardCalculator() {
  const [balance, setBalance] = useState('5000');
  const [rate, setRate] = useState('19.99');
  const [payment, setPayment] = useState('150');
  const [result, setResult] = useState<{ months: number; totalInterest: number; payoffDate: string; minPayoff: number } | null>(null);

  const calculate = () => {
    const b = parseFloat(balance), r = parseFloat(rate) / 100 / 12, p = parseFloat(payment);
    if (!b || !r || !p) return;
    if (p <= b * r) { setResult({ months: 0, totalInterest: 0, payoffDate: 'Never (payment too low)', minPayoff: Math.ceil(b * r * 1.01 * 100) / 100 }); return; }
    let bal = b, months = 0, totalInt = 0;
    while (bal > 0 && months < 1200) { const int = bal * r; totalInt += int; bal = bal + int - p; months++; }
    const date = new Date(); date.setMonth(date.getMonth() + months);
    setResult({ months, totalInterest: totalInt, payoffDate: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), minPayoff: Math.ceil(b * r * 1.01 * 100) / 100 });
  };
  const fmt = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Balance ($)</label><input type="number" value={balance} onChange={e => setBalance(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">APR (%)</label><input type="number" step="0.01" value={rate} onChange={e => setRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Monthly Payment ($)</label><input type="number" value={payment} onChange={e => setPayment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate Payoff</button>
      {result && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center"><div className="text-xs text-gray-500 mb-1">Payoff Time</div><div className="font-bold">{result.months ? `${result.months} months` : 'N/A'}</div></div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center"><div className="text-xs text-gray-500 mb-1">Payoff Date</div><div className="font-bold text-sm">{result.payoffDate}</div></div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center"><div className="text-xs text-gray-500 mb-1">Total Interest</div><div className="font-bold text-red-500">{result.months ? fmt(result.totalInterest) : 'N/A'}</div></div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 text-center"><div className="text-xs text-gray-500 mb-1">Min Payment Needed</div><div className="font-bold text-yellow-600">{fmt(result.minPayoff)}/mo</div></div>
        </div>
      )}
    </div>
  );
}

// ── Additional specific calculators ──────────────────────────────────────────

function AutoLoanCalculator() {
  const [price, setPrice] = useState('30000');
  const [cashIncentive, setCashIncentive] = useState('0');
  const [down, setDown] = useState('3000');
  const [rate, setRate] = useState('7.5');
  const [term, setTerm] = useState('60');
  const [tradeIn, setTradeIn] = useState('0');
  const [tradeOwed, setTradeOwed] = useState('0');
  const [salesTax, setSalesTax] = useState('7');
  const [fees, setFees] = useState('1200');
  const [applyTradeInTaxCredit, setApplyTradeInTaxCredit] = useState(true);
  const [includeTaxFees, setIncludeTaxFees] = useState(true);
  const [result, setResult] = useState<{
    monthly: number;
    totalPaid: number;
    totalInterest: number;
    loanAmount: number;
    taxAmount: number;
    taxableAmount: number;
    upfrontPayment: number;
    totalCost: number;
  } | null>(null);

  const calculate = () => {
    const carPrice = parseFloat(price) || 0;
    const rebate = parseFloat(cashIncentive) || 0;
    const downPayment = parseFloat(down) || 0;
    const tradeValue = parseFloat(tradeIn) || 0;
    const tradeLoanOwed = parseFloat(tradeOwed) || 0;
    const taxRate = parseFloat(salesTax) || 0;
    const otherFees = parseFloat(fees) || 0;

    const adjustedPrice = Math.max(0, carPrice - rebate);
    const netTradeCredit = tradeValue - tradeLoanOwed;
    const taxableAmount = applyTradeInTaxCredit
      ? Math.max(0, adjustedPrice - Math.max(0, netTradeCredit))
      : adjustedPrice;
    const taxAmount = taxableAmount * (taxRate / 100);

    let P = adjustedPrice - downPayment - tradeValue + tradeLoanOwed;
    if (includeTaxFees) P += taxAmount + otherFees;

    const r = parseFloat(rate) / 100 / 12;
    const n = parseFloat(term);
    if (!P || P <= 0 || !n) return;
    let monthly: number;
    if (r === 0) {
      monthly = P / n;
    } else {
      monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    const totalPaid = monthly * n;
    const totalInterest = totalPaid - P;
    const upfrontBase = downPayment + Math.max(0, netTradeCredit);
    const upfrontTaxFees = includeTaxFees ? 0 : taxAmount + otherFees;
    const upfrontPayment = upfrontBase + upfrontTaxFees;
    const totalCost = totalPaid + upfrontPayment;

    setResult({ monthly, totalPaid, totalInterest, loanAmount: P, taxAmount, taxableAmount, upfrontPayment, totalCost });
  };
  const fmt = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Vehicle Price ($)</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Cash Incentive / Rebate ($)</label><input type="number" value={cashIncentive} onChange={e => setCashIncentive(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Down Payment ($)</label><input type="number" value={down} onChange={e => setDown(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Trade-In Value ($)</label><input type="number" value={tradeIn} onChange={e => setTradeIn(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Amount Owed on Trade-In ($)</label><input type="number" value={tradeOwed} onChange={e => setTradeOwed(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Sales Tax (%)</label><input type="number" step="0.1" value={salesTax} onChange={e => setSalesTax(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Title/Registration/Fees ($)</label><input type="number" value={fees} onChange={e => setFees(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Annual Interest Rate (%)</label><input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Loan Term (months)</label>
          <select value={term} onChange={e => setTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            {['24','36','48','60','72','84'].map(t => <option key={t} value={t}>{t} months ({parseInt(t)/12} yrs)</option>)}
          </select>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <input type="checkbox" checked={includeTaxFees} onChange={e => setIncludeTaxFees(e.target.checked)} className="rounded border-gray-300 dark:border-gray-600" />
        Include taxes and fees in loan amount
      </label>
      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <input type="checkbox" checked={applyTradeInTaxCredit} onChange={e => setApplyTradeInTaxCredit(e.target.checked)} className="rounded border-gray-300 dark:border-gray-600" />
        Apply trade-in tax credit (state-dependent)
      </label>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate</button>
      {result && (
        <div className="space-y-3">
          <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-5 text-center">
            <div className="text-xs text-gray-500 mb-1">Monthly Payment</div>
            <div className="text-4xl font-extrabold text-indigo-600">{fmt(result.monthly)}</div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Loan Amount</div><div className="font-bold">{fmt(result.loanAmount)}</div></div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Total Paid</div><div className="font-bold">{fmt(result.totalPaid)}</div></div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Total Interest</div><div className="font-bold text-red-500">{fmt(result.totalInterest)}</div></div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Taxable Purchase Amount</div><div className="font-bold">{fmt(result.taxableAmount)}</div></div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Sales Tax</div><div className="font-bold">{fmt(result.taxAmount)}</div></div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Upfront Payment</div><div className="font-bold">{fmt(result.upfrontPayment)}</div></div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Total Vehicle Cost</div><div className="font-bold text-emerald-600">{fmt(result.totalCost)}</div></div>
          </div>
        </div>
      )}
    </div>
  );
}

function SalaryCalculator() {
  const [amount, setAmount] = useState('75000');
  const [type, setType] = useState<'annual' | 'monthly' | 'biweekly' | 'weekly' | 'daily' | 'hourly'>('annual');
  const [hoursPerWeek, setHoursPerWeek] = useState('40');
  const [result, setResult] = useState<{ hourly: number; daily: number; weekly: number; biweekly: number; monthly: number; annual: number } | null>(null);

  const calculate = () => {
    const val = parseFloat(amount);
    const hrs = parseFloat(hoursPerWeek) || 40;
    if (!val) return;
    let annual = 0;
    switch (type) {
      case 'annual': annual = val; break;
      case 'monthly': annual = val * 12; break;
      case 'biweekly': annual = val * 26; break;
      case 'weekly': annual = val * 52; break;
      case 'daily': annual = val * 260; break;
      case 'hourly': annual = val * hrs * 52; break;
    }
    const hourly = annual / (hrs * 52);
    setResult({ hourly, daily: hourly * hrs / 5, weekly: hourly * hrs, biweekly: hourly * hrs * 2, monthly: annual / 12, annual });
  };
  const fmt = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Pay Type</label>
          <select value={type} onChange={e => setType(e.target.value as typeof type)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            <option value="annual">Annual Salary</option>
            <option value="monthly">Monthly</option>
            <option value="biweekly">Bi-Weekly</option>
            <option value="weekly">Weekly</option>
            <option value="daily">Daily</option>
            <option value="hourly">Hourly</option>
          </select>
        </div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Amount ($)</label><input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Hours per Week</label><input type="number" value={hoursPerWeek} onChange={e => setHoursPerWeek(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Convert</button>
      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
          {[['Hourly', result.hourly], ['Daily', result.daily], ['Weekly', result.weekly], ['Bi-Weekly', result.biweekly], ['Monthly', result.monthly], ['Annual', result.annual]].map(([label, val]) => (
            <div key={label as string} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">{label as string}</div><div className="font-bold text-indigo-600">{fmt(val as number)}</div></div>
          ))}
        </div>
      )}
    </div>
  );
}

function BodyFatCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState('180');
  const [neck, setNeck] = useState('15');
  const [waist, setWaist] = useState('34');
  const [hip, setHip] = useState('');
  const [height, setHeight] = useState('70');
  const [result, setResult] = useState<{ bf: number; lbm: number; fat: number; category: string; color: string } | null>(null);

  const calculate = () => {
    const h = parseFloat(height), w = parseFloat(waist), n = parseFloat(neck), wt = parseFloat(weight);
    if (!h || !w || !n || !wt) return;
    let bf: number;
    if (gender === 'male') {
      bf = 86.010 * Math.log10(w - n) - 70.041 * Math.log10(h) + 36.76;
    } else {
      const hp = parseFloat(hip);
      if (!hp) return;
      bf = 163.205 * Math.log10(w + hp - n) - 97.684 * Math.log10(h) - 78.387;
    }
    bf = Math.max(0, Math.round(bf * 10) / 10);
    const lbm = wt * (1 - bf / 100);
    const fat = wt * bf / 100;
    let category = '', color = '';
    if (gender === 'male') {
      if (bf < 6) { category = 'Essential Fat'; color = 'text-blue-600'; }
      else if (bf < 14) { category = 'Athletes'; color = 'text-green-600'; }
      else if (bf < 18) { category = 'Fitness'; color = 'text-green-500'; }
      else if (bf < 25) { category = 'Average'; color = 'text-yellow-600'; }
      else { category = 'Obese'; color = 'text-red-600'; }
    } else {
      if (bf < 14) { category = 'Essential Fat'; color = 'text-blue-600'; }
      else if (bf < 21) { category = 'Athletes'; color = 'text-green-600'; }
      else if (bf < 25) { category = 'Fitness'; color = 'text-green-500'; }
      else if (bf < 32) { category = 'Average'; color = 'text-yellow-600'; }
      else { category = 'Obese'; color = 'text-red-600'; }
    }
    setResult({ bf, lbm: Math.round(lbm * 10) / 10, fat: Math.round(fat * 10) / 10, category, color });
  };

  return (
    <div className="space-y-5">
      <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 w-fit">
        <button onClick={() => setGender('male')} className={`px-5 py-2 text-sm font-medium ${gender === 'male' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Male</button>
        <button onClick={() => setGender('female')} className={`px-5 py-2 text-sm font-medium ${gender === 'female' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Female</button>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">Uses US Navy method. All measurements in inches.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Height (in)</label><input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="70" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Neck (in)</label><input type="number" value={neck} onChange={e => setNeck(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="15" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Waist (in)</label><input type="number" value={waist} onChange={e => setWaist(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="34" /></div>
        {gender === 'female' && <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Hip (in)</label><input type="number" value={hip} onChange={e => setHip(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="38" /></div>}
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Weight (lbs)</label><input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="180" /></div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate Body Fat</button>
      {result && (
        <div className="space-y-3">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 text-center">
            <div className={`text-5xl font-extrabold ${result.color} mb-2`}>{result.bf}%</div>
            <div className={`text-xl font-semibold ${result.color}`}>{result.category}</div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Lean Body Mass</div><div className="font-bold">{result.lbm} lbs</div></div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Fat Mass</div><div className="font-bold">{result.fat} lbs</div></div>
          </div>
        </div>
      )}
    </div>
  );
}

function TDEECalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('30');
  const [weight, setWeight] = useState('175');
  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('10');
  const [activity, setActivity] = useState('1.55');
  const [result, setResult] = useState<{ bmr: number; tdee: number; lose05: number; lose1: number; gain05: number } | null>(null);

  const activityLevels = [
    { value: '1.2', label: 'Sedentary (little/no exercise)' },
    { value: '1.375', label: 'Light (1-3 days/week)' },
    { value: '1.55', label: 'Moderate (3-5 days/week)' },
    { value: '1.725', label: 'Active (6-7 days/week)' },
    { value: '1.9', label: 'Very Active (hard daily exercise)' },
  ];

  const calculate = () => {
    const a = parseFloat(age), w = parseFloat(weight) * 0.453592;
    const totalIn = parseFloat(heightFt) * 12 + parseFloat(heightIn);
    const h = totalIn * 2.54;
    const act = parseFloat(activity);
    if (!a || !w || !h) return;
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }
    const tdee = bmr * act;
    setResult({ bmr: Math.round(bmr), tdee: Math.round(tdee), lose05: Math.round(tdee - 250), lose1: Math.round(tdee - 500), gain05: Math.round(tdee + 250) });
  };

  return (
    <div className="space-y-5">
      <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 w-fit">
        <button onClick={() => setGender('male')} className={`px-5 py-2 text-sm font-medium ${gender === 'male' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Male</button>
        <button onClick={() => setGender('female')} className={`px-5 py-2 text-sm font-medium ${gender === 'female' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Female</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Age (years)</label><input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Weight (lbs)</label><input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Height (ft)</label><input type="number" value={heightFt} onChange={e => setHeightFt(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Height (in)</label><input type="number" value={heightIn} onChange={e => setHeightIn(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Activity Level</label>
          <select value={activity} onChange={e => setActivity(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            {activityLevels.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate TDEE</button>
      {result && (
        <div className="space-y-3">
          <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-5 text-center">
            <div className="text-xs text-gray-500 mb-1">TDEE (Maintenance Calories)</div>
            <div className="text-4xl font-extrabold text-indigo-600">{result.tdee.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">calories/day • BMR: {result.bmr.toLocaleString()}</div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Lose 0.5 lb/wk</div><div className="font-bold text-red-500">{result.lose05.toLocaleString()}</div></div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Lose 1 lb/wk</div><div className="font-bold text-orange-500">{result.lose1.toLocaleString()}</div></div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Gain 0.5 lb/wk</div><div className="font-bold text-green-500">{result.gain05.toLocaleString()}</div></div>
          </div>
        </div>
      )}
    </div>
  );
}

function CaloriesBurnedCalculator() {
  const [weight, setWeight] = useState('175');
  const [duration, setDuration] = useState('30');
  const [activity, setActivity] = useState('running');
  const [result, setResult] = useState<number | null>(null);

  const activities: Record<string, { met: number; label: string }> = {
    running: { met: 9.8, label: 'Running (6 mph)' },
    cycling: { met: 7.5, label: 'Cycling (moderate)' },
    swimming: { met: 7.0, label: 'Swimming (laps)' },
    walking: { met: 3.5, label: 'Walking (3.5 mph)' },
    hiking: { met: 5.3, label: 'Hiking' },
    weights: { met: 3.5, label: 'Weight Training' },
    yoga: { met: 2.5, label: 'Yoga' },
    basketball: { met: 6.5, label: 'Basketball' },
    soccer: { met: 7.0, label: 'Soccer' },
    tennis: { met: 7.3, label: 'Tennis (singles)' },
    dancing: { met: 4.8, label: 'Dancing' },
    jump_rope: { met: 11.8, label: 'Jump Rope' },
  };

  const calculate = () => {
    const wt = parseFloat(weight) * 0.453592;
    const dur = parseFloat(duration);
    const met = activities[activity]?.met ?? 5;
    if (!wt || !dur) return;
    const cal = met * wt * (dur / 60);
    setResult(Math.round(cal));
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Activity</label>
          <select value={activity} onChange={e => setActivity(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            {Object.entries(activities).map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Weight (lbs)</label><input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Duration (minutes)</label><input type="number" value={duration} onChange={e => setDuration(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate</button>
      {result !== null && (
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 text-center">
          <div className="text-xs text-gray-500 mb-1">Calories Burned</div>
          <div className="text-5xl font-extrabold text-orange-600">{result.toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-1">kcal in {duration} minutes of {activities[activity]?.label}</div>
        </div>
      )}
    </div>
  );
}

function BinaryCalculator() {
  const [input, setInput] = useState('1010');
  const [fromBase, setFromBase] = useState<'2' | '8' | '10' | '16'>('10');
  const [result, setResult] = useState<{ binary: string; octal: string; decimal: string; hex: string } | null>(null);

  const calculate = () => {
    try {
      const dec = parseInt(input, parseInt(fromBase));
      if (isNaN(dec)) return;
      setResult({ decimal: dec.toString(10), binary: dec.toString(2), octal: dec.toString(8), hex: dec.toString(16).toUpperCase() });
    } catch { /* ignore */ }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Input Base</label>
          <select value={fromBase} onChange={e => setFromBase(e.target.value as typeof fromBase)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            <option value="2">Binary (Base 2)</option>
            <option value="8">Octal (Base 8)</option>
            <option value="10">Decimal (Base 10)</option>
            <option value="16">Hex (Base 16)</option>
          </select>
        </div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Value</label><input type="text" value={input} onChange={e => setInput(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono" placeholder="e.g. 255" /></div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Convert</button>
      {result && (
        <div className="grid grid-cols-2 gap-3">
          {[['Decimal (Base 10)', result.decimal], ['Binary (Base 2)', result.binary], ['Octal (Base 8)', result.octal], ['Hex (Base 16)', result.hex]].map(([label, val]) => (
            <div key={label} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">{label}</div><div className="font-mono font-bold text-indigo-600 break-all">{val}</div></div>
          ))}
        </div>
      )}
    </div>
  );
}

function Base64Calculator() {
  const [text, setText] = useState('Hello, World!');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const process = () => {
    setError(null);
    try {
      if (mode === 'encode') {
        setResult(btoa(unescape(encodeURIComponent(text))));
      } else {
        setResult(decodeURIComponent(escape(atob(text))));
      }
    } catch {
      setError('Invalid input for ' + mode);
      setResult(null);
    }
  };

  const copy = () => { if (result) navigator.clipboard.writeText(result); };

  return (
    <div className="space-y-5">
      <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 w-fit">
        <button onClick={() => setMode('encode')} className={`px-5 py-2 text-sm font-medium ${mode === 'encode' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Encode</button>
        <button onClick={() => setMode('decode')} className={`px-5 py-2 text-sm font-medium ${mode === 'decode' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Decode</button>
      </div>
      <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}</label><textarea value={text} onChange={e => setText(e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-sm" /></div>
      <button onClick={process} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">{mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}</button>
      {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl p-3 text-red-600 text-sm">{error}</div>}
      {result && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
          <div className="font-mono text-sm break-all text-gray-900 dark:text-white mb-3">{result}</div>
          <button onClick={copy} className="text-sm text-indigo-600 hover:underline">Copy to clipboard</button>
        </div>
      )}
    </div>
  );
}

function URLEncoder() {
  const [text, setText] = useState('https://example.com/path?name=hello world&foo=bar&baz=<test>');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [result, setResult] = useState<string | null>(null);

  const process = () => {
    try {
      setResult(mode === 'encode' ? encodeURIComponent(text) : decodeURIComponent(text));
    } catch {
      setResult('Invalid input');
    }
  };
  const copy = () => { if (result) navigator.clipboard.writeText(result); };

  return (
    <div className="space-y-5">
      <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 w-fit">
        <button onClick={() => setMode('encode')} className={`px-5 py-2 text-sm font-medium ${mode === 'encode' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Encode</button>
        <button onClick={() => setMode('decode')} className={`px-5 py-2 text-sm font-medium ${mode === 'decode' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Decode</button>
      </div>
      <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{mode === 'encode' ? 'Text / URL to Encode' : 'Encoded URL to Decode'}</label><textarea value={text} onChange={e => setText(e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-sm" /></div>
      <button onClick={process} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">{mode === 'encode' ? 'URL Encode' : 'URL Decode'}</button>
      {result && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
          <div className="font-mono text-sm break-all text-gray-900 dark:text-white mb-3">{result}</div>
          <button onClick={copy} className="text-sm text-indigo-600 hover:underline">Copy to clipboard</button>
        </div>
      )}
    </div>
  );
}

function TimeZoneCalculator() {
  const [time, setTime] = useState(() => new Date().toTimeString().slice(0, 5));
  const [fromZone, setFromZone] = useState('America/New_York');
  const [toZone, setToZone] = useState('Europe/London');
  const [result, setResult] = useState<string | null>(null);

  const zones = [
    { value: 'America/New_York', label: 'New York (ET)' },
    { value: 'America/Chicago', label: 'Chicago (CT)' },
    { value: 'America/Denver', label: 'Denver (MT)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (PT)' },
    { value: 'Europe/London', label: 'London (GMT/BST)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Europe/Berlin', label: 'Berlin (CET)' },
    { value: 'Asia/Kolkata', label: 'India (IST)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Shanghai', label: 'China (CST)' },
    { value: 'Asia/Dubai', label: 'Dubai (GST)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEDT)' },
    { value: 'Pacific/Auckland', label: 'Auckland (NZST)' },
    { value: 'UTC', label: 'UTC' },
  ];

  const convert = () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const dt = new Date(`${today}T${time}:00`);
      const fmt = (tz: string) => dt.toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true, weekday: 'short' });
      setResult(`${fmt(fromZone)} → ${fmt(toZone)}`);
    } catch {
      setResult('Conversion error');
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Time</label><input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">From Time Zone</label>
          <select value={fromZone} onChange={e => setFromZone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            {zones.map(z => <option key={z.value} value={z.value}>{z.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">To Time Zone</label>
          <select value={toZone} onChange={e => setToZone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            {zones.map(z => <option key={z.value} value={z.value}>{z.label}</option>)}
          </select>
        </div>
      </div>
      <button onClick={convert} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Convert Time</button>
      {result && <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded-xl p-5 text-center text-xl font-bold text-indigo-700 dark:text-indigo-300">{result}</div>}
    </div>
  );
}

function TimeCalculator() {
  const [mode, setMode] = useState<'add' | 'subtract'>('add');
  const [h1, setH1] = useState('2'); const [m1, setM1] = useState('30'); const [s1, setS1] = useState('0');
  const [h2, setH2] = useState('1'); const [m2, setM2] = useState('45'); const [s2, setS2] = useState('0');
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const t1 = parseInt(h1) * 3600 + parseInt(m1) * 60 + parseInt(s1);
    const t2 = parseInt(h2) * 3600 + parseInt(m2) * 60 + parseInt(s2);
    let total = mode === 'add' ? t1 + t2 : t1 - t2;
    const neg = total < 0; if (neg) total = -total;
    const rh = Math.floor(total / 3600);
    const rm = Math.floor((total % 3600) / 60);
    const rs = total % 60;
    setResult(`${neg ? '-' : ''}${rh}h ${rm}m ${rs}s (${total.toLocaleString()} total seconds)`);
  };

  const inp = (label: string, val: string, setter: (v: string) => void, max: number) => (
    <div><label className="block text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">{label}</label><input type="number" min={0} max={max} value={val} onChange={e => setter(e.target.value)} className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-center" /></div>
  );

  return (
    <div className="space-y-5">
      <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 w-fit">
        <button onClick={() => setMode('add')} className={`px-5 py-2 text-sm font-medium ${mode === 'add' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Add</button>
        <button onClick={() => setMode('subtract')} className={`px-5 py-2 text-sm font-medium ${mode === 'subtract' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Subtract</button>
      </div>
      <div className="grid grid-cols-3 gap-3">{inp('Hours', h1, setH1, 999)}{inp('Minutes', m1, setM1, 59)}{inp('Seconds', s1, setS1, 59)}</div>
      <div className="text-center text-gray-400 font-bold text-xl">{mode === 'add' ? '+' : '−'}</div>
      <div className="grid grid-cols-3 gap-3">{inp('Hours', h2, setH2, 999)}{inp('Minutes', m2, setM2, 59)}{inp('Seconds', s2, setS2, 59)}</div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate</button>
      {result && <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded-xl p-5 text-center text-lg font-bold text-indigo-700 dark:text-indigo-300">{result}</div>}
    </div>
  );
}

function HoursCalculator() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const [entries, setEntries] = useState<{ start: string; end: string; break: string }[]>(
    days.map(() => ({ start: '09:00', end: '17:00', break: '30' }))
  );
  const [rate, setRate] = useState('25');
  const [result, setResult] = useState<{ total: number; pay: number } | null>(null);

  const update = (i: number, field: string, val: string) => {
    setEntries(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: val } : e));
  };

  const calculate = () => {
    let total = 0;
    entries.forEach(e => {
      const [sh, sm] = e.start.split(':').map(Number);
      const [eh, em] = e.end.split(':').map(Number);
      const mins = (eh * 60 + em) - (sh * 60 + sm) - (parseFloat(e.break) || 0);
      if (mins > 0) total += mins;
    });
    const hrs = total / 60;
    setResult({ total: Math.round(hrs * 100) / 100, pay: Math.round(hrs * parseFloat(rate) * 100) / 100 });
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-500"><th className="pb-2">Day</th><th className="pb-2">Start</th><th className="pb-2">End</th><th className="pb-2">Break (min)</th></tr></thead>
          <tbody>
            {days.map((day, i) => (
              <tr key={day} className="border-t border-gray-100 dark:border-gray-700">
                <td className="py-2 pr-3 font-medium text-gray-700 dark:text-gray-300 text-xs">{day}</td>
                <td className="py-1 pr-2"><input type="time" value={entries[i].start} onChange={e => update(i, 'start', e.target.value)} className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none" /></td>
                <td className="py-1 pr-2"><input type="time" value={entries[i].end} onChange={e => update(i, 'end', e.target.value)} className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none" /></td>
                <td className="py-1"><input type="number" value={entries[i].break} onChange={e => update(i, 'break', e.target.value)} className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Hourly Rate ($)</label><input type="number" value={rate} onChange={e => setRate(e.target.value)} className="w-full sm:w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate Hours</button>
      {result && (
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-4"><div className="text-xs text-gray-500 mb-1">Total Hours</div><div className="text-3xl font-extrabold text-indigo-600">{result.total}</div></div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4"><div className="text-xs text-gray-500 mb-1">Total Pay</div><div className="text-3xl font-extrabold text-green-600">${result.pay.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div></div>
        </div>
      )}
    </div>
  );
}

// Generic calculator for all other slugs
function GenericCalculator({ slug, name }: { slug: string; name: string }) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);

  type FieldConfig = { id: string; label: string; placeholder?: string };
  type CalcConfig = { fields: FieldConfig[]; compute: (vals: Record<string, number>) => string };

  const configs: Record<string, CalcConfig> = {
    'sales-tax-calculator': {
      fields: [{ id: 'price', label: 'Price ($)', placeholder: '100' }, { id: 'tax', label: 'Tax Rate (%)', placeholder: '8.5' }],
      compute: (v) => {
        const price = Math.max(0, v.price);
        const rate = Math.max(0, v.tax) / 100;
        if (price <= 0) return 'Enter a price greater than 0.';

        const taxAmount = price * rate;
        const total = price + taxAmount;
        const preTaxFromTotal = total / (1 + rate);
        return `Tax: $${taxAmount.toFixed(2)} | Total: $${total.toFixed(2)} | Effective Rate: ${(rate * 100).toFixed(2)}% | Pre-tax from total: $${preTaxFromTotal.toFixed(2)}`;
      },
    },
    'discount-calculator': {
      fields: [{ id: 'price', label: 'Original Price ($)', placeholder: '100' }, { id: 'discount', label: 'Discount (%)', placeholder: '20' }],
      compute: (v) => `Savings: $${(v.price * v.discount / 100).toFixed(2)} | Final: $${(v.price * (1 - v.discount / 100)).toFixed(2)}`,
    },
    'simple-interest-calculator': {
      fields: [{ id: 'principal', label: 'Principal ($)', placeholder: '1000' }, { id: 'rate', label: 'Annual Rate (%)', placeholder: '5' }, { id: 'time', label: 'Time (years)', placeholder: '3' }],
      compute: (v) => `Interest: $${(v.principal * v.rate / 100 * v.time).toFixed(2)} | Total: $${(v.principal + v.principal * v.rate / 100 * v.time).toFixed(2)}`,
    },
    'debt-ratio-calculator': {
      fields: [{ id: 'monthlyDebt', label: 'Monthly Debt Payments ($)', placeholder: '1200' }, { id: 'monthlyIncome', label: 'Gross Monthly Income ($)', placeholder: '5000' }],
      compute: (v) => {
        const debt = Math.max(0, v.monthlyDebt);
        const income = Math.max(0, v.monthlyIncome);
        if (income <= 0) return 'Enter monthly income greater than 0.';
        const dti = (debt / income) * 100;
        const status = dti < 36 ? 'Healthy' : dti <= 43 ? 'Borderline' : 'High risk';
        return `Debt-to-Income (DTI): ${dti.toFixed(2)}% | Status: ${status} | Remaining income after debt: $${(income - debt).toFixed(2)}`;
      },
    },
    'take-home-pay-calculator': {
      fields: [{ id: 'salary', label: 'Annual Gross Salary ($)', placeholder: '80000' }, { id: 'federal', label: 'Federal Tax Rate (%)', placeholder: '18' }, { id: 'state', label: 'State Tax Rate (%)', placeholder: '5' }, { id: 'fica', label: 'FICA Rate (%)', placeholder: '7.65' }],
      compute: (v) => {
        const annual = Math.max(0, v.salary);
        const taxRate = Math.max(0, v.federal + v.state + v.fica) / 100;
        const netAnnual = annual * (1 - taxRate);
        return `Net Annual: $${netAnnual.toFixed(2)} | Net Monthly: $${(netAnnual / 12).toFixed(2)} | Net Bi-weekly: $${(netAnnual / 26).toFixed(2)} | Effective total tax: ${(taxRate * 100).toFixed(2)}%`;
      },
    },
    'long-division-calculator': {
      fields: [{ id: 'dividend', label: 'Dividend', placeholder: '125' }, { id: 'divisor', label: 'Divisor', placeholder: '8' }],
      compute: (v) => {
        const dividend = Math.trunc(v.dividend);
        const divisor = Math.trunc(v.divisor);
        if (divisor === 0) return 'Division by zero is undefined. Please enter a non-zero divisor.';
        const quotient = Math.trunc(dividend / divisor);
        const remainder = Math.abs(dividend % divisor);
        return `Quotient: ${quotient} | Remainder: ${remainder} | Decimal value: ${(dividend / divisor).toFixed(8).replace(/\.?0+$/, '')}`;
      },
    },
    'p-value-calculator': {
      fields: [{ id: 'z', label: 'Z-score', placeholder: '1.96' }, { id: 'tails', label: 'Tails (1 or 2)', placeholder: '2' }],
      compute: (v) => {
        const z = Math.abs(v.z);
        const tails = v.tails >= 2 ? 2 : 1;
        // Abramowitz-Stegun approximation for normal CDF
        const t = 1 / (1 + 0.2316419 * z);
        const d = Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
        const cdf = 1 - d * (0.319381530 * t - 0.356563782 * t * t + 1.781477937 * t * t * t - 1.821255978 * t * t * t * t + 1.330274429 * t * t * t * t * t);
        const oneTail = 1 - cdf;
        const p = Math.min(1, tails === 2 ? oneTail * 2 : oneTail);
        return `Approx p-value (${tails}-tailed): ${p.toFixed(6)} | Significance: ${p < 0.01 ? 'Strongly significant (<0.01)' : p < 0.05 ? 'Significant (<0.05)' : 'Not significant (>=0.05)'}`;
      },
    },
    'percent-off-calculator': {
      fields: [{ id: 'price', label: 'Original Price ($)', placeholder: '80' }, { id: 'percent', label: 'Percent Off (%)', placeholder: '25' }],
      compute: (v) => `You save: $${(v.price * v.percent / 100).toFixed(2)} | Final price: $${(v.price * (1 - v.percent / 100)).toFixed(2)}`,
    },
    'roi-calculator': {
      fields: [{ id: 'initial', label: 'Initial Investment ($)', placeholder: '10000' }, { id: 'final', label: 'Final Value ($)', placeholder: '14000' }],
      compute: (v) => `ROI: ${(((v.final - v.initial) / v.initial) * 100).toFixed(2)}% | Profit: $${(v.final - v.initial).toLocaleString()}`,
    },
    'speed-calculator': {
      fields: [{ id: 'distance', label: 'Distance (miles)', placeholder: '100' }, { id: 'time', label: 'Time (hours)', placeholder: '2' }],
      compute: (v) => `Speed: ${(v.distance / v.time).toFixed(2)} mph`,
    },
    'density-calculator': {
      fields: [{ id: 'mass', label: 'Mass (kg)', placeholder: '10' }, { id: 'volume', label: 'Volume (m³)', placeholder: '2' }],
      compute: (v) => `Density: ${(v.mass / v.volume).toFixed(4)} kg/m³`,
    },
    'slope-calculator': {
      fields: [{ id: 'x1', label: 'x₁', placeholder: '1' }, { id: 'y1', label: 'y₁', placeholder: '2' }, { id: 'x2', label: 'x₂', placeholder: '4' }, { id: 'y2', label: 'y₂', placeholder: '8' }],
      compute: (v) => `Slope (m) = ${((v.y2 - v.y1) / (v.x2 - v.x1)).toFixed(4)}`,
    },
    'distance-calculator': {
      fields: [{ id: 'x1', label: 'x₁', placeholder: '0' }, { id: 'y1', label: 'y₁', placeholder: '0' }, { id: 'x2', label: 'x₂', placeholder: '3' }, { id: 'y2', label: 'y₂', placeholder: '4' }],
      compute: (v) => `Distance = ${Math.sqrt(Math.pow(v.x2 - v.x1, 2) + Math.pow(v.y2 - v.y1, 2)).toFixed(4)}`,
    },
    'circle-calculator': {
      fields: [{ id: 'radius', label: 'Radius', placeholder: '5' }],
      compute: (v) => `Area: ${(Math.PI * v.radius * v.radius).toFixed(4)} | Circumference: ${(2 * Math.PI * v.radius).toFixed(4)} | Diameter: ${(2 * v.radius)}`,
    },
    'pythagorean-theorem-calculator': {
      fields: [{ id: 'a', label: 'Side a', placeholder: '3' }, { id: 'b', label: 'Side b', placeholder: '4' }],
      compute: (v) => `Hypotenuse c = ${Math.sqrt(v.a * v.a + v.b * v.b).toFixed(4)}`,
    },
    'exponent-calculator': {
      fields: [{ id: 'base', label: 'Base', placeholder: '2' }, { id: 'exp', label: 'Exponent', placeholder: '10' }],
      compute: (v) => `${v.base}^${v.exp} = ${Math.pow(v.base, v.exp)}`,
    },
    'average-calculator': {
      fields: [{ id: 'sum', label: 'Sum of Numbers', placeholder: '150' }, { id: 'count', label: 'Count of Numbers', placeholder: '5' }],
      compute: (v) => `Average = ${(v.sum / v.count).toFixed(4)}`,
    },
    'percent-error-calculator': {
      fields: [{ id: 'experimental', label: 'Experimental Value', placeholder: '9.8' }, { id: 'theoretical', label: 'Theoretical Value', placeholder: '10' }],
      compute: (v) => `Percent Error = ${(Math.abs((v.experimental - v.theoretical) / v.theoretical) * 100).toFixed(2)}%`,
    },
    'square-footage-calculator': {
      fields: [{ id: 'length', label: 'Length (ft)', placeholder: '20' }, { id: 'width', label: 'Width (ft)', placeholder: '15' }],
      compute: (v) => `Square Footage = ${(v.length * v.width).toFixed(2)} sq ft`,
    },
    'paint-calculator': {
      fields: [{ id: 'length', label: 'Room Length (ft)', placeholder: '12' }, { id: 'width', label: 'Room Width (ft)', placeholder: '10' }, { id: 'height', label: 'Wall Height (ft)', placeholder: '8' }],
      compute: (v) => { const area = 2 * (v.length + v.width) * v.height; return `Wall area: ${area.toFixed(0)} sq ft | Gallons needed (2 coats): ${(area / 200 * 2).toFixed(1)}`; },
    },
    'fuel-cost-calculator': {
      fields: [{ id: 'distance', label: 'Distance (miles)', placeholder: '300' }, { id: 'mpg', label: 'Fuel Economy (MPG)', placeholder: '30' }, { id: 'price', label: 'Fuel Price ($/gal)', placeholder: '3.50' }],
      compute: (v) => `Gallons needed: ${(v.distance / v.mpg).toFixed(2)} | Total cost: $${((v.distance / v.mpg) * v.price).toFixed(2)}`,
    },
    'electricity-calculator': {
      fields: [{ id: 'watts', label: 'Power (Watts)', placeholder: '100' }, { id: 'hours', label: 'Hours per Day', placeholder: '8' }, { id: 'rate', label: 'Rate (¢/kWh)', placeholder: '12' }],
      compute: (v) => { const kwh = v.watts / 1000 * v.hours; return `Daily: ${kwh.toFixed(3)} kWh ($${(kwh * v.rate / 100).toFixed(4)}) | Monthly: ${(kwh * 30).toFixed(2)} kWh ($${(kwh * 30 * v.rate / 100).toFixed(2)})`; },
    },
    'btu-calculator': {
      fields: [{ id: 'length', label: 'Room Length (ft)', placeholder: '15' }, { id: 'width', label: 'Room Width (ft)', placeholder: '12' }, { id: 'height', label: 'Ceiling Height (ft)', placeholder: '8' }],
      compute: (v) => `Estimated BTU needed: ${Math.round(v.length * v.width * v.height * 4)} BTU/hr`,
    },
    'concrete-calculator': {
      fields: [{ id: 'length', label: 'Length (ft)', placeholder: '10' }, { id: 'width', label: 'Width (ft)', placeholder: '10' }, { id: 'depth', label: 'Depth (inches)', placeholder: '4' }],
      compute: (v) => { const cy = (v.length * v.width * (v.depth / 12)) / 27; return `Cubic yards: ${cy.toFixed(2)} | Cubic feet: ${(cy * 27).toFixed(2)}`; },
    },
    'tile-calculator': {
      fields: [{ id: 'area', label: 'Room Area (sq ft)', placeholder: '100' }, { id: 'tile', label: 'Tile Size (sq ft)', placeholder: '1' }, { id: 'waste', label: 'Waste Factor (%)', placeholder: '10' }],
      compute: (v) => `Tiles needed: ${Math.ceil(v.area / v.tile * (1 + v.waste / 100))}`,
    },
    'ohms-law-calculator': {
      fields: [{ id: 'voltage', label: 'Voltage (V)', placeholder: '12' }, { id: 'resistance', label: 'Resistance (Ω)', placeholder: '4' }],
      compute: (v) => `Current (I) = ${(v.voltage / v.resistance).toFixed(4)} A | Power (P) = ${(v.voltage * v.voltage / v.resistance).toFixed(4)} W`,
    },
    'wind-chill-calculator': {
      fields: [{ id: 'temp', label: 'Temperature (°F)', placeholder: '20' }, { id: 'wind', label: 'Wind Speed (mph)', placeholder: '15' }],
      compute: (v) => `Wind Chill = ${(35.74 + 0.6215 * v.temp - 35.75 * Math.pow(v.wind, 0.16) + 0.4275 * v.temp * Math.pow(v.wind, 0.16)).toFixed(1)}°F`,
    },
    'sleep-calculator': {
      fields: [{ id: 'hour', label: 'Wake-up Hour (0-23)', placeholder: '7' }, { id: 'min', label: 'Wake-up Minute (0-59)', placeholder: '0' }],
      compute: (v) => {
        const wakeMin = v.hour * 60 + v.min;
        const cycles = [6, 5, 4];
        return cycles.map(c => {
          let bedMin = wakeMin - c * 90 - 15;
          if (bedMin < 0) bedMin += 24 * 60;
          const h = Math.floor(bedMin / 60) % 24;
          const m = bedMin % 60;
          return `${c} cycles → ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
        }).join(' | ');
      },
    },
    // Financial calculators
    'auto-loan-calculator': {
      fields: [{ id: 'price', label: 'Vehicle Price ($)', placeholder: '30000' }, { id: 'down', label: 'Down Payment ($)', placeholder: '5000' }, { id: 'rate', label: 'Annual Rate (%)', placeholder: '6.5' }, { id: 'term', label: 'Term (months)', placeholder: '60' }],
      compute: (v) => { const P = v.price - v.down; const r = v.rate / 100 / 12; const n = v.term; const m = (P * r * Math.pow(1+r,n)) / (Math.pow(1+r,n)-1); return `Monthly: $${m.toFixed(2)} | Total: $${(m*n).toFixed(2)} | Interest: $${(m*n-P).toFixed(2)}`; },
    },
    'interest-calculator': {
      fields: [
        { id: 'principal', label: 'Initial Investment ($)', placeholder: '20000' },
        { id: 'annualContrib', label: 'Annual Contribution ($)', placeholder: '5000' },
        { id: 'rate', label: 'Annual Interest Rate (%)', placeholder: '5' },
        { id: 'years', label: 'Investment Length (years)', placeholder: '5' },
        { id: 'compound', label: 'Compounds Per Year (1,4,12,365)', placeholder: '12' },
        { id: 'tax', label: 'Tax Rate on Interest (%)', placeholder: '0' },
        { id: 'inflation', label: 'Inflation Rate (%)', placeholder: '3' },
      ],
      compute: (v) => {
        const principal = Math.max(0, v.principal);
        const annualContrib = Math.max(0, v.annualContrib);
        const years = Math.max(0, v.years);
        const comp = Math.max(1, Math.round(v.compound || 12));
        const r = v.rate / 100;
        const tax = Math.max(0, v.tax) / 100;
        const inflation = Math.max(0, v.inflation) / 100;

        const grossEnd = principal * Math.pow(1 + r / comp, comp * years);
        const contribFv = annualContrib > 0
          ? annualContrib * ((Math.pow(1 + r, years) - 1) / (r === 0 ? 1 : r))
          : 0;
        const nominalEnd = r === 0 ? principal + annualContrib * years : grossEnd + contribFv;

        const totalContrib = principal + annualContrib * years;
        const grossInterest = nominalEnd - totalContrib;
        const afterTaxInterest = grossInterest * (1 - tax);
        const afterTaxEnd = totalContrib + afterTaxInterest;
        const inflationAdjusted = afterTaxEnd / Math.pow(1 + inflation, years || 1);

        return `Ending Balance: $${afterTaxEnd.toFixed(2)} | Total Contributions: $${totalContrib.toFixed(2)} | Total Interest: $${afterTaxInterest.toFixed(2)} | Inflation-Adjusted Value: $${inflationAdjusted.toFixed(2)}`;
      },
    },
    'payment-calculator': {
      fields: [
        { id: 'amount', label: 'Loan Amount ($)', placeholder: '200000' },
        { id: 'rate', label: 'Annual Rate (%)', placeholder: '6' },
        { id: 'term', label: 'Term (months)', placeholder: '180' },
        { id: 'payment', label: 'Fixed Monthly Payment ($, optional)', placeholder: '1700' },
      ],
      compute: (v) => {
        const P = Math.max(0, v.amount);
        const r = Math.max(0, v.rate) / 100 / 12;
        const n = Math.max(1, Math.round(v.term));
        if (P <= 0) return 'Enter a valid loan amount greater than 0.';

        const fixedTermPayment = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const fixedTermTotal = fixedTermPayment * n;
        const fixedTermInterest = fixedTermTotal - P;

        if (v.payment > 0) {
          const userPayment = Math.max(0, v.payment);
          if (r > 0 && userPayment <= P * r) {
            return `Fixed payment is too low to cover monthly interest. Increase monthly payment above $${(P * r).toFixed(2)}.`;
          }

          let bal = P;
          let payoffMonths = 0;
          let interestPaid = 0;
          while (bal > 0.01 && payoffMonths < 1200) {
            const monthlyInterest = bal * r;
            const principalPaid = Math.min(userPayment - monthlyInterest, bal);
            if (principalPaid <= 0) {
              return `Fixed payment is too low to reduce principal. Increase monthly payment above $${(monthlyInterest + 1).toFixed(2)}.`;
            }
            bal -= principalPaid;
            interestPaid += monthlyInterest;
            payoffMonths++;
          }

          if (payoffMonths >= 1200) return 'Payoff horizon exceeds 100 years with the current fixed payment.';

          const payoffTotal = P + interestPaid;
          const years = Math.floor(payoffMonths / 12);
          const months = payoffMonths % 12;
          const interestSaved = Math.max(0, fixedTermInterest - interestPaid);
          return `Fixed-Term Monthly: $${fixedTermPayment.toFixed(2)} | Fixed-Payment Payoff: ${payoffMonths} months (${years}y ${months}m) | Total Paid: $${payoffTotal.toFixed(2)} | Interest: $${interestPaid.toFixed(2)} | Interest Saved vs Term: $${interestSaved.toFixed(2)}`;
        }

        return `Fixed-Term Monthly: $${fixedTermPayment.toFixed(2)} | Total of Payments: $${fixedTermTotal.toFixed(2)} | Total Interest: $${fixedTermInterest.toFixed(2)}`;
      },
    },
    'inflation-calculator': {
      fields: [{ id: 'amount', label: 'Current Amount ($)', placeholder: '1000' }, { id: 'rate', label: 'Inflation Rate (%)', placeholder: '3' }, { id: 'years', label: 'Years', placeholder: '10' }],
      compute: (v) => {
        const amount = Math.max(0, v.amount);
        const annualInflation = Math.max(0, v.rate) / 100;
        const years = Math.max(0, v.years);

        const inflationFactor = Math.pow(1 + annualInflation, years);
        const futureCost = amount * inflationFactor;
        const currentBuyingPower = inflationFactor === 0 ? 0 : amount / inflationFactor;
        const cumulativeInflationPct = (inflationFactor - 1) * 100;
        const monthlyInflationPct = (Math.pow(1 + annualInflation, 1 / 12) - 1) * 100;

        return `Future cost: $${futureCost.toFixed(2)} | Current buying power of this amount after ${years.toFixed(1)}y: $${currentBuyingPower.toFixed(2)} | Cumulative inflation: ${cumulativeInflationPct.toFixed(2)}% | Monthly-equivalent inflation: ${monthlyInflationPct.toFixed(4)}% | Required nominal return to preserve value: ${(annualInflation * 100).toFixed(2)}%/yr`;
      },
    },
    'income-tax-calculator': {
      fields: [{ id: 'income', label: 'Taxable Income ($)', placeholder: '75000' }, { id: 'state', label: 'State Tax Rate (%)', placeholder: '5' }],
      compute: (v) => {
        const income = Math.max(0, v.income);
        const stateRate = Math.max(0, v.state) / 100;
        if (income <= 0) return 'Enter taxable income greater than 0.';

        const brackets: [number, number][] = [[11000, 0.10], [44725, 0.12], [95375, 0.22], [182100, 0.24], [231250, 0.32], [578125, 0.35], [Infinity, 0.37]];
        let federal = 0;
        let prev = 0;
        let marginal = 0.10;
        for (const [limit, rate] of brackets) {
          if (income > prev) {
            const taxed = Math.min(income, limit) - prev;
            federal += taxed * rate;
            marginal = rate;
          }
          prev = limit;
          if (income <= limit) break;
        }

        const state = income * stateRate;
        const totalTax = federal + state;
        const effectiveRate = (totalTax / income) * 100;
        const netIncome = income - totalTax;
        return `Federal: $${federal.toFixed(2)} | State: $${state.toFixed(2)} | Total Tax: $${totalTax.toFixed(2)} | Effective Rate: ${effectiveRate.toFixed(2)}% | Marginal Federal Rate: ${(marginal * 100).toFixed(0)}% | Net Income: $${netIncome.toFixed(2)}`;
      },
    },
    'salary-calculator': {
      fields: [{ id: 'salary', label: 'Annual Salary ($)', placeholder: '60000' }, { id: 'hours', label: 'Hours per Week', placeholder: '40' }],
      compute: (v) => {
        const annual = Math.max(0, v.salary);
        const hours = Math.max(1, v.hours);
        const hourly = annual / (hours * 52);
        return `Hourly: $${hourly.toFixed(2)} | Monthly: $${(annual/12).toFixed(2)} | Bi-weekly: $${(annual/26).toFixed(2)} | Weekly: $${(annual/52).toFixed(2)}`;
      },
    },
    '401k-calculator': {
      fields: [{ id: 'salary', label: 'Annual Salary ($)', placeholder: '70000' }, { id: 'contrib', label: 'Contribution (%)', placeholder: '6' }, { id: 'match', label: 'Employer Match (%)', placeholder: '3' }, { id: 'rate', label: 'Annual Return (%)', placeholder: '7' }, { id: 'years', label: 'Years to Retirement', placeholder: '30' }],
      compute: (v) => {
        const salary = Math.max(0, v.salary);
        const contrib = Math.max(0, v.contrib);
        const match = Math.max(0, v.match);
        const years = Math.max(0, v.years);
        const annual = salary * (contrib + match) / 100;
        const monthly = annual / 12;
        const r = Math.max(0, v.rate) / 100 / 12;
        const n = years * 12;
        const fv = n <= 0
          ? 0
          : r === 0
            ? monthly * n
            : monthly * (Math.pow(1+r,n)-1) / r;
        return `Monthly contribution: $${monthly.toFixed(2)} | Annual contribution: $${annual.toFixed(2)} | Projected balance: $${Math.round(fv).toLocaleString()}`;
      },
    },
    'interest-rate-calculator': {
      fields: [{ id: 'pv', label: 'Present Value ($)', placeholder: '10000' }, { id: 'fv', label: 'Future Value ($)', placeholder: '15000' }, { id: 'years', label: 'Years', placeholder: '5' }],
      compute: (v) => {
        const pv = Math.max(0, v.pv);
        const fv = Math.max(0, v.fv);
        const years = Math.max(0, v.years);
        if (pv <= 0 || fv <= 0 || years <= 0) return 'Enter present value, future value, and years greater than 0.';
        const r = (Math.pow(fv / pv, 1 / years) - 1) * 100;
        return `Required Annual Rate (CAGR): ${r.toFixed(4)}%`;
      },
    },
    'house-affordability-calculator': {
      fields: [{ id: 'income', label: 'Annual Income ($)', placeholder: '80000' }, { id: 'debt', label: 'Monthly Debts ($)', placeholder: '500' }, { id: 'down', label: 'Down Payment ($)', placeholder: '40000' }, { id: 'rate', label: 'Interest Rate (%)', placeholder: '7' }],
      compute: (v) => {
        const maxPayment = v.income / 12 * 0.28;
        const maxWithDebt = v.income / 12 * 0.36 - v.debt;
        const payment = Math.min(maxPayment, maxWithDebt);
        const r = v.rate / 100 / 12, n = 360;
        const loanMax = payment * (Math.pow(1+r,n)-1) / (r * Math.pow(1+r,n));
        return `Max home price: $${Math.round(loanMax + v.down).toLocaleString()} | Max loan: $${Math.round(loanMax).toLocaleString()} | Max payment: $${payment.toFixed(2)}/mo`;
      },
    },
    'rent-calculator': {
      fields: [{ id: 'income', label: 'Monthly Income ($)', placeholder: '5000' }, { id: 'percent', label: 'Rent % of Income', placeholder: '30' }],
      compute: (v) => `Affordable rent: $${(v.income * v.percent / 100).toFixed(2)}/mo (${v.percent}% rule) | Annual rent budget: $${(v.income * v.percent / 100 * 12).toFixed(2)}`,
    },
    'vat-calculator': {
      fields: [{ id: 'amount', label: 'Amount ($)', placeholder: '100' }, { id: 'rate', label: 'VAT Rate (%)', placeholder: '20' }],
      compute: (v) => { const vat = v.amount * v.rate / 100; return `VAT: $${vat.toFixed(2)} | Price excl. VAT: $${v.amount.toFixed(2)} | Price incl. VAT: $${(v.amount + vat).toFixed(2)}`; },
    },
    'auto-lease-calculator': {
      fields: [{ id: 'price', label: 'Vehicle Price ($)', placeholder: '35000' }, { id: 'residual', label: 'Residual Value ($)', placeholder: '20000' }, { id: 'factor', label: 'Money Factor (×0.0001)', placeholder: '25' }, { id: 'term', label: 'Term (months)', placeholder: '36' }],
      compute: (v) => {
        const depreciation = (v.price - v.residual) / v.term;
        const finance = (v.price + v.residual) * (v.factor / 10000);
        const monthly = depreciation + finance;
        return `Monthly payment: $${monthly.toFixed(2)} | Total: $${(monthly * v.term).toFixed(2)}`;
      },
    },
    'depreciation-calculator': {
      fields: [{ id: 'cost', label: 'Asset Cost ($)', placeholder: '50000' }, { id: 'salvage', label: 'Salvage Value ($)', placeholder: '5000' }, { id: 'life', label: 'Useful Life (years)', placeholder: '10' }],
      compute: (v) => {
        const sl = (v.cost - v.salvage) / v.life;
        const ddb = (2 / v.life) * v.cost;
        return `Straight-Line: $${sl.toFixed(2)}/yr | Double-Declining (Year 1): $${ddb.toFixed(2)}`;
      },
    },
    'margin-calculator': {
      fields: [{ id: 'cost', label: 'Cost ($)', placeholder: '50' }, { id: 'price', label: 'Selling Price ($)', placeholder: '80' }],
      compute: (v) => { const profit = v.price - v.cost; const margin = (profit / v.price) * 100; const markup = (profit / v.cost) * 100; return `Profit: $${profit.toFixed(2)} | Gross Margin: ${margin.toFixed(2)}% | Markup: ${markup.toFixed(2)}%`; },
    },
    'apr-calculator': {
      fields: [{ id: 'loan', label: 'Loan Amount ($)', placeholder: '20000' }, { id: 'fees', label: 'Total Fees ($)', placeholder: '500' }, { id: 'rate', label: 'Nominal Rate (%)', placeholder: '6' }, { id: 'term', label: 'Term (months)', placeholder: '60' }],
      compute: (v) => {
        const r = v.rate / 100 / 12, n = v.term;
        const m = (v.loan * r * Math.pow(1+r,n)) / (Math.pow(1+r,n)-1);
        return `APR (approx.): ${(v.rate + (v.fees / v.loan * 100 / (n/12))).toFixed(3)}% | Monthly Payment: $${m.toFixed(2)}`;
      },
    },
    'present-value-calculator': {
      fields: [{ id: 'fv', label: 'Future Value ($)', placeholder: '10000' }, { id: 'rate', label: 'Discount Rate (%)', placeholder: '8' }, { id: 'years', label: 'Years', placeholder: '5' }],
      compute: (v) => { const pv = v.fv / Math.pow(1 + v.rate/100, v.years); return `Present Value: $${pv.toFixed(2)}`; },
    },
    'future-value-calculator': {
      fields: [{ id: 'pv', label: 'Present Value ($)', placeholder: '10000' }, { id: 'rate', label: 'Annual Rate (%)', placeholder: '8' }, { id: 'years', label: 'Years', placeholder: '10' }],
      compute: (v) => { const fv = v.pv * Math.pow(1 + v.rate/100, v.years); return `Future Value: $${fv.toFixed(2)}`; },
    },
    'commission-calculator': {
      fields: [{ id: 'sales', label: 'Total Sales ($)', placeholder: '50000' }, { id: 'rate', label: 'Commission Rate (%)', placeholder: '5' }],
      compute: (v) => `Commission: $${(v.sales * v.rate / 100).toFixed(2)} | Take-home from $${v.sales.toLocaleString()} in sales`,
    },
    'debt-to-income-ratio-calculator': {
      fields: [{ id: 'debt', label: 'Monthly Debt Payments ($)', placeholder: '1500' }, { id: 'income', label: 'Gross Monthly Income ($)', placeholder: '6000' }],
      compute: (v) => { const dti = (v.debt / v.income) * 100; return `DTI Ratio: ${dti.toFixed(1)}% (${dti <= 36 ? 'Good ✓' : dti <= 43 ? 'Acceptable' : 'High ✗'})`; },
    },
    'payback-period-calculator': {
      fields: [{ id: 'cost', label: 'Initial Investment ($)', placeholder: '50000' }, { id: 'cashflow', label: 'Annual Cash Flow ($)', placeholder: '15000' }],
      compute: (v) => { const pp = v.cost / v.cashflow; return `Payback Period: ${pp.toFixed(2)} years (${Math.floor(pp)} years ${Math.round((pp % 1) * 12)} months)`; },
    },
    'cd-calculator': {
      fields: [{ id: 'principal', label: 'Deposit ($)', placeholder: '10000' }, { id: 'apy', label: 'APY (%)', placeholder: '5' }, { id: 'months', label: 'Term (months)', placeholder: '12' }],
      compute: (v) => { const t = v.months / 12; const fv = v.principal * Math.pow(1 + v.apy/100, t); return `Final Value: $${fv.toFixed(2)} | Interest: $${(fv - v.principal).toFixed(2)}`; },
    },
    'down-payment-calculator': {
      fields: [{ id: 'price', label: 'Home Price ($)', placeholder: '400000' }, { id: 'percent', label: 'Down Payment (%)', placeholder: '20' }],
      compute: (v) => { const dp = v.price * v.percent / 100; return `Down Payment: $${dp.toLocaleString()} | Loan Amount: $${(v.price - dp).toLocaleString()}`; },
    },
    'refinance-calculator': {
      fields: [{ id: 'balance', label: 'Remaining Balance ($)', placeholder: '200000' }, { id: 'oldRate', label: 'Current Rate (%)', placeholder: '7.5' }, { id: 'newRate', label: 'New Rate (%)', placeholder: '6.5' }, { id: 'term', label: 'New Term (years)', placeholder: '30' }, { id: 'costs', label: 'Closing Costs ($)', placeholder: '3000' }],
      compute: (v) => {
        const oldM = v.balance * (v.oldRate/100/12) * Math.pow(1+v.oldRate/100/12, v.term*12) / (Math.pow(1+v.oldRate/100/12, v.term*12)-1);
        const newM = v.balance * (v.newRate/100/12) * Math.pow(1+v.newRate/100/12, v.term*12) / (Math.pow(1+v.newRate/100/12, v.term*12)-1);
        const savings = oldM - newM;
        const breakeven = savings > 0 ? Math.ceil(v.costs / savings) : 0;
        return `Old payment: $${oldM.toFixed(2)} | New payment: $${newM.toFixed(2)} | Monthly savings: $${savings.toFixed(2)} | Break-even: ${breakeven} months`;
      },
    },
    // Health calculators
    'body-fat-calculator': {
      fields: [{ id: 'weight', label: 'Weight (kg)', placeholder: '80' }, { id: 'bmi', label: 'BMI', placeholder: '25' }, { id: 'age', label: 'Age (years)', placeholder: '35' }],
      compute: (v) => { const bodyFat = 1.2 * v.bmi + 0.23 * v.age - 10.8 - 5.4; return `Est. Body Fat: ${bodyFat.toFixed(1)}% (${bodyFat < 20 ? 'Athletic' : bodyFat < 25 ? 'Fitness' : bodyFat < 30 ? 'Average' : 'Obese'})`; },
    },
    'ideal-weight-calculator': {
      fields: [{ id: 'height', label: 'Height (cm)', placeholder: '175' }],
      compute: (v) => {
        const hm = v.height / 100;
        const low = 18.5 * hm * hm;
        const high = 24.9 * hm * hm;
        return `Ideal Weight Range: ${low.toFixed(1)} – ${high.toFixed(1)} kg (${(low * 2.205).toFixed(1)} – ${(high * 2.205).toFixed(1)} lbs)`;
      },
    },
    'calories-burned-calculator': {
      fields: [{ id: 'weight', label: 'Weight (kg)', placeholder: '70' }, { id: 'duration', label: 'Duration (minutes)', placeholder: '30' }, { id: 'met', label: 'MET Value (walking=3.5, running=9)', placeholder: '3.5' }],
      compute: (v) => { const cal = v.met * v.weight * (v.duration / 60); return `Calories Burned: ${cal.toFixed(0)} kcal`; },
    },
    'one-rep-max-calculator': {
      fields: [{ id: 'weight', label: 'Weight Lifted (lbs)', placeholder: '225' }, { id: 'reps', label: 'Reps Performed', placeholder: '5' }],
      compute: (v) => {
        const epley = v.weight * (1 + v.reps / 30);
        const brzycki = v.weight * (36 / (37 - v.reps));
        return `Epley: ${epley.toFixed(0)} lbs | Brzycki: ${brzycki.toFixed(0)} lbs | Avg 1RM: ${((epley+brzycki)/2).toFixed(0)} lbs`;
      },
    },
    'target-heart-rate-calculator': {
      fields: [{ id: 'age', label: 'Age (years)', placeholder: '30' }, { id: 'rhr', label: 'Resting Heart Rate (bpm)', placeholder: '65' }],
      compute: (v) => {
        const mhr = 220 - v.age;
        const low = Math.round(v.rhr + 0.50 * (mhr - v.rhr));
        const high = Math.round(v.rhr + 0.85 * (mhr - v.rhr));
        return `Max HR: ${mhr} bpm | Target Zone (50–85%): ${low}–${high} bpm`;
      },
    },
    'protein-calculator': {
      fields: [{ id: 'weight', label: 'Body Weight (kg)', placeholder: '70' }, { id: 'activity', label: 'Activity (1=sedentary, 2=active, 3=athlete)', placeholder: '2' }],
      compute: (v) => {
        const factors = [1.2, 1.6, 2.2];
        const f = factors[Math.min(Math.round(v.activity) - 1, 2)] || 1.6;
        const protein = v.weight * f;
        return `Recommended: ${protein.toFixed(0)} g/day (${f}g per kg body weight)`;
      },
    },
    'tdee-calculator': {
      fields: [{ id: 'bmr', label: 'BMR (cal/day)', placeholder: '1700' }, { id: 'activity', label: 'Activity Factor (1.2–1.9)', placeholder: '1.55' }],
      compute: (v) => { const tdee = v.bmr * v.activity; return `TDEE: ${Math.round(tdee)} cal/day | Weight loss: ${Math.round(tdee-500)} | Weight gain: ${Math.round(tdee+500)}`; },
    },
    'bac-calculator': {
      fields: [{ id: 'drinks', label: 'Standard Drinks', placeholder: '3' }, { id: 'weight', label: 'Body Weight (lbs)', placeholder: '160' }, { id: 'hours', label: 'Hours Drinking', placeholder: '2' }],
      compute: (v) => {
        const bac = (v.drinks * 14 / (v.weight * 0.454 * 0.68)) * 100 - v.hours * 0.015;
        const bacs = Math.max(0, bac);
        return `Estimated BAC: ${bacs.toFixed(3)}% (${bacs < 0.04 ? 'Sober' : bacs < 0.08 ? 'Impaired' : 'Legally drunk'})`;
      },
    },
    'lean-body-mass-calculator': {
      fields: [{ id: 'weight', label: 'Weight (kg)', placeholder: '80' }, { id: 'bodyfat', label: 'Body Fat (%)', placeholder: '20' }],
      compute: (v) => { const lbm = v.weight * (1 - v.bodyfat/100); return `Lean Body Mass: ${lbm.toFixed(1)} kg (${(lbm * 2.205).toFixed(1)} lbs) | Fat Mass: ${(v.weight - lbm).toFixed(1)} kg`; },
    },
    'gfr-calculator': {
      fields: [{ id: 'creatinine', label: 'Serum Creatinine (mg/dL)', placeholder: '1.0' }, { id: 'age', label: 'Age (years)', placeholder: '45' }],
      compute: (v) => {
        const gfr = 186 * Math.pow(v.creatinine, -1.154) * Math.pow(v.age, -0.203) * 0.742;
        const stage = gfr >= 90 ? 'G1 Normal' : gfr >= 60 ? 'G2 Mildly Decreased' : gfr >= 45 ? 'G3a' : gfr >= 30 ? 'G3b' : gfr >= 15 ? 'G4 Severely Decreased' : 'G5 Kidney Failure';
        return `eGFR: ${gfr.toFixed(1)} mL/min/1.73m² | Stage: ${stage}`;
      },
    },
    'body-surface-area-calculator': {
      fields: [{ id: 'weight', label: 'Weight (kg)', placeholder: '70' }, { id: 'height', label: 'Height (cm)', placeholder: '175' }],
      compute: (v) => { const bsa = 0.007184 * Math.pow(v.weight, 0.425) * Math.pow(v.height, 0.725); return `Body Surface Area (Dubois): ${bsa.toFixed(4)} m²`; },
    },
    'pace-calculator': {
      fields: [{ id: 'distance', label: 'Distance (miles)', placeholder: '3.1' }, { id: 'hours', label: 'Hours', placeholder: '0' }, { id: 'minutes', label: 'Minutes', placeholder: '30' }, { id: 'seconds', label: 'Seconds', placeholder: '0' }],
      compute: (v) => {
        const totalSec = v.hours * 3600 + v.minutes * 60 + v.seconds;
        const paceSec = totalSec / v.distance;
        const pm = Math.floor(paceSec / 60), ps = Math.round(paceSec % 60);
        const speedMph = v.distance / (totalSec / 3600);
        return `Pace: ${pm}:${String(ps).padStart(2,'0')} /mile | Speed: ${speedMph.toFixed(2)} mph`;
      },
    },
    'overweight-calculator': {
      fields: [{ id: 'weight', label: 'Weight (lbs)', placeholder: '185' }, { id: 'height', label: 'Height (inches)', placeholder: '70' }],
      compute: (v) => { const bmi = (v.weight / (v.height * v.height)) * 703; const excess = v.weight - 24.9 * (v.height * v.height) / 703; return `BMI: ${bmi.toFixed(1)} | ${bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal weight ✓' : bmi < 30 ? `Overweight by ${excess.toFixed(0)} lbs` : `Obese by ${excess.toFixed(0)} lbs`}`; },
    },
    // Math calculators
    'triangle-calculator': {
      fields: [{ id: 'a', label: 'Side a', placeholder: '3' }, { id: 'b', label: 'Side b', placeholder: '4' }, { id: 'c', label: 'Side c', placeholder: '5' }],
      compute: (v) => {
        const s = (v.a + v.b + v.c) / 2;
        const area = Math.sqrt(s * (s-v.a) * (s-v.b) * (s-v.c));
        const A = Math.acos((v.b*v.b+v.c*v.c-v.a*v.a)/(2*v.b*v.c)) * 180/Math.PI;
        const B = Math.acos((v.a*v.a+v.c*v.c-v.b*v.b)/(2*v.a*v.c)) * 180/Math.PI;
        return `Perimeter: ${(v.a+v.b+v.c).toFixed(2)} | Area: ${area.toFixed(4)} | Angles: A=${A.toFixed(1)}°, B=${B.toFixed(1)}°, C=${(180-A-B).toFixed(1)}°`;
      },
    },
    'volume-calculator': {
      fields: [{ id: 'length', label: 'Length / Radius', placeholder: '5' }, { id: 'width', label: 'Width / Height', placeholder: '4' }, { id: 'height', label: 'Height (for box)', placeholder: '3' }],
      compute: (v) => {
        const box = v.length * v.width * v.height;
        const sphere = (4/3) * Math.PI * Math.pow(v.length, 3);
        const cylinder = Math.PI * v.length * v.length * v.width;
        return `Box: ${box.toFixed(2)} | Sphere (r=${v.length}): ${sphere.toFixed(2)} | Cylinder (r=${v.length},h=${v.width}): ${cylinder.toFixed(2)}`;
      },
    },
    'half-life-calculator': {
      fields: [{ id: 'initial', label: 'Initial Amount', placeholder: '100' }, { id: 'halfLife', label: 'Half-Life (same unit as time)', placeholder: '5730' }, { id: 'time', label: 'Elapsed Time', placeholder: '1000' }],
      compute: (v) => { const remaining = v.initial * Math.pow(0.5, v.time / v.halfLife); return `Remaining: ${remaining.toFixed(4)} | Decayed: ${(v.initial - remaining).toFixed(4)} | ${((remaining/v.initial)*100).toFixed(2)}% remains`; },
    },
    'log-calculator': {
      fields: [{ id: 'value', label: 'Value', placeholder: '100' }, { id: 'base', label: 'Base (0 = natural log)', placeholder: '10' }],
      compute: (v) => {
        const ln = Math.log(v.value);
        const log10 = Math.log10(v.value);
        const logb = v.base > 0 ? Math.log(v.value) / Math.log(v.base) : ln;
        return `ln(${v.value}) = ${ln.toFixed(6)} | log₁₀(${v.value}) = ${log10.toFixed(6)} | log_${v.base > 0 ? v.base : 'e'} = ${logb.toFixed(6)}`;
      },
    },
    'area-calculator': {
      fields: [{ id: 'length', label: 'Length / Radius', placeholder: '10' }, { id: 'width', label: 'Width / Height', placeholder: '8' }],
      compute: (v) => {
        const rect = v.length * v.width;
        const tri = 0.5 * v.length * v.width;
        const circle = Math.PI * v.length * v.length;
        return `Rectangle: ${rect.toFixed(4)} | Triangle: ${tri.toFixed(4)} | Circle (r=${v.length}): ${circle.toFixed(4)}`;
      },
    },
    'sample-size-calculator': {
      fields: [{ id: 'confidence', label: 'Confidence Level (90/95/99)', placeholder: '95' }, { id: 'margin', label: 'Margin of Error (%)', placeholder: '5' }, { id: 'population', label: 'Population Size (0=infinite)', placeholder: '0' }],
      compute: (v) => {
        const z = v.confidence === 90 ? 1.645 : v.confidence === 99 ? 2.576 : 1.96;
        const p = 0.5, e = v.margin / 100;
        let n = (z * z * p * (1-p)) / (e * e);
        if (v.population > 0) n = n / (1 + (n - 1) / v.population);
        return `Required sample size: ${Math.ceil(n)}`;
      },
    },
    'probability-calculator': {
      fields: [{ id: 'favorable', label: 'Favorable Outcomes', placeholder: '5' }, { id: 'total', label: 'Total Outcomes', placeholder: '20' }],
      compute: (v) => {
        const p = v.favorable / v.total;
        return `P(event) = ${p.toFixed(4)} = ${(p*100).toFixed(2)}% | Odds = ${v.favorable}:${v.total - v.favorable}`;
      },
    },
    'permutation-combination-calculator': {
      fields: [{ id: 'n', label: 'n (total items)', placeholder: '10' }, { id: 'r', label: 'r (chosen items)', placeholder: '3' }],
      compute: (v) => {
        if (v.n > 20 || v.r > v.n || v.r < 0) return 'n must be ≤ 20 and r must be between 0 and n';
        const fact = (x: number): number => { let r = 1; for (let i = 2; i <= x; i++) r *= i; return r; };
        const nPr = fact(v.n) / fact(v.n - v.r);
        const nCr = fact(v.n) / (fact(v.r) * fact(v.n - v.r));
        return `P(${v.n},${v.r}) = ${nPr.toLocaleString()} | C(${v.n},${v.r}) = ${nCr.toLocaleString()}`;
      },
    },
    'z-score-calculator': {
      fields: [{ id: 'x', label: 'Value (x)', placeholder: '75' }, { id: 'mean', label: 'Mean (μ)', placeholder: '70' }, { id: 'sd', label: 'Std Deviation (σ)', placeholder: '10' }],
      compute: (v) => { const z = (v.x - v.mean) / v.sd; return `Z-score: ${z.toFixed(4)} | Value is ${Math.abs(z).toFixed(2)} standard deviations ${z >= 0 ? 'above' : 'below'} the mean`; },
    },
    'confidence-interval-calculator': {
      fields: [{ id: 'mean', label: 'Sample Mean', placeholder: '50' }, { id: 'sd', label: 'Std Deviation', placeholder: '10' }, { id: 'n', label: 'Sample Size', placeholder: '30' }],
      compute: (v) => {
        const se = v.sd / Math.sqrt(v.n);
        const ci95 = 1.96 * se;
        return `95% CI: ${(v.mean - ci95).toFixed(2)} to ${(v.mean + ci95).toFixed(2)} | SE: ${se.toFixed(4)}`;
      },
    },
    'ratio-calculator': {
      fields: [{ id: 'a', label: 'Value A', placeholder: '12' }, { id: 'b', label: 'Value B', placeholder: '16' }],
      compute: (v) => {
        const gcdFn = (a: number, b: number): number => b === 0 ? a : gcdFn(b, a % b);
        const g = gcdFn(v.a, v.b);
        return `Ratio: ${v.a/g}:${v.b/g} | As fraction: ${v.a/g}/${v.b/g} = ${(v.a/v.b).toFixed(4)}`;
      },
    },
    'surface-area-calculator': {
      fields: [{ id: 'length', label: 'Length / Radius', placeholder: '5' }, { id: 'width', label: 'Width / Height', placeholder: '4' }, { id: 'boxH', label: 'Height (for box)', placeholder: '3' }],
      compute: (v) => {
        const box = 2*(v.length*v.width + v.width*v.boxH + v.length*v.boxH);
        const sphere = 4 * Math.PI * v.length * v.length;
        const cylinder = 2 * Math.PI * v.length * (v.length + v.width);
        return `Box: ${box.toFixed(2)} | Sphere (r=${v.length}): ${sphere.toFixed(2)} | Cylinder (r=${v.length},h=${v.width}): ${cylinder.toFixed(2)}`;
      },
    },
    'right-triangle-calculator': {
      fields: [{ id: 'a', label: 'Side a (leg)', placeholder: '3' }, { id: 'b', label: 'Side b (leg)', placeholder: '4' }],
      compute: (v) => {
        const c = Math.sqrt(v.a*v.a + v.b*v.b);
        const A = Math.atan(v.a/v.b) * 180 / Math.PI;
        return `Hypotenuse: ${c.toFixed(4)} | Angle A: ${A.toFixed(2)}° | Angle B: ${(90-A).toFixed(2)}° | Perimeter: ${(v.a+v.b+c).toFixed(2)} | Area: ${(0.5*v.a*v.b).toFixed(2)}`;
      },
    },
    'root-calculator': {
      fields: [{ id: 'value', label: 'Number', placeholder: '64' }, { id: 'root', label: 'Root (2=square, 3=cube)', placeholder: '2' }],
      compute: (v) => {
        const r = Math.pow(v.value, 1/v.root);
        return `${v.root}th root of ${v.value} = ${r.toFixed(6)} | √${v.value} = ${Math.sqrt(v.value).toFixed(6)} | ∛${v.value} = ${Math.cbrt(v.value).toFixed(6)}`;
      },
    },
    'lcm-calculator': {
      fields: [{ id: 'a', label: 'First Number', placeholder: '12' }, { id: 'b', label: 'Second Number', placeholder: '18' }],
      compute: (v) => {
        const gcdFn = (a: number, b: number): number => b === 0 ? a : gcdFn(b, a % b);
        const g = gcdFn(v.a, v.b);
        return `GCF: ${g} | LCM: ${(v.a * v.b / g).toFixed(0)}`;
      },
    },
    'gcf-calculator': {
      fields: [{ id: 'a', label: 'First Number', placeholder: '48' }, { id: 'b', label: 'Second Number', placeholder: '36' }],
      compute: (v) => {
        const gcdFn = (a: number, b: number): number => b === 0 ? a : gcdFn(b, a % b);
        const g = gcdFn(v.a, v.b);
        return `GCF/GCD: ${g} | LCM: ${(v.a * v.b / g).toFixed(0)}`;
      },
    },
    'factor-calculator': {
      fields: [{ id: 'n', label: 'Number', placeholder: '60' }],
      compute: (v) => {
        const n = Math.abs(Math.round(v.n));
        const factors: number[] = [];
        for (let i = 1; i <= Math.sqrt(n); i++) { if (n % i === 0) { factors.push(i); if (i !== n/i) factors.push(n/i); } }
        return `Factors of ${n}: ${factors.sort((a,b)=>a-b).join(', ')}`;
      },
    },
    'rounding-calculator': {
      fields: [{ id: 'value', label: 'Number', placeholder: '3.14159' }, { id: 'places', label: 'Decimal Places', placeholder: '2' }],
      compute: (v) => {
        const factor = Math.pow(10, v.places);
        const rounded = Math.round(v.value * factor) / factor;
        return `Rounded: ${rounded} | Floor: ${Math.floor(v.value * factor) / factor} | Ceiling: ${Math.ceil(v.value * factor) / factor}`;
      },
    },
    'scientific-notation-calculator': {
      fields: [{ id: 'value', label: 'Number', placeholder: '123456789' }],
      compute: (v) => `Scientific: ${v.value.toExponential(4)} | Engineering: ${v.value.toExponential()} | Full: ${v.value.toLocaleString()}`,
    },
    'prime-factorization-calculator': {
      fields: [{ id: 'n', label: 'Number', placeholder: '360' }],
      compute: (v) => {
        let n = Math.abs(Math.round(v.n));
        const factors: number[] = [];
        for (let i = 2; i <= Math.sqrt(n); i++) { while (n % i === 0) { factors.push(i); n /= i; } }
        if (n > 1) factors.push(n);
        return `Prime Factorization: ${factors.length ? factors.join(' × ') : '1'} = ${v.n}`;
      },
    },
    // Utility calculators
    'gpa-calculator': {
      fields: [{ id: 'total', label: 'Total Grade Points', placeholder: '35' }, { id: 'credits', label: 'Total Credit Hours', placeholder: '12' }],
      compute: (v) => `GPA: ${(v.total / v.credits).toFixed(2)}`,
    },
    'grade-calculator': {
      fields: [{ id: 'earned', label: 'Points Earned', placeholder: '92' }, { id: 'total', label: 'Total Points', placeholder: '100' }],
      compute: (v) => `Grade: ${((v.earned / v.total) * 100).toFixed(1)}%`,
    },
    'time-duration-calculator': {
      fields: [{ id: 'h1', label: 'Start Hour (0-23)', placeholder: '9' }, { id: 'm1', label: 'Start Minute', placeholder: '30' }, { id: 'h2', label: 'End Hour (0-23)', placeholder: '17' }, { id: 'm2', label: 'End Minute', placeholder: '15' }],
      compute: (v) => {
        let mins = (v.h2 * 60 + v.m2) - (v.h1 * 60 + v.m1);
        if (mins < 0) mins += 24 * 60;
        return `Duration: ${Math.floor(mins/60)} hours ${mins%60} minutes (${mins} total minutes)`;
      },
    },
    'day-counter': {
      fields: [{ id: 'year1', label: 'Start Year', placeholder: '2024' }, { id: 'month1', label: 'Start Month (1-12)', placeholder: '1' }, { id: 'day1', label: 'Start Day', placeholder: '1' }, { id: 'year2', label: 'End Year', placeholder: '2025' }, { id: 'month2', label: 'End Month (1-12)', placeholder: '1' }, { id: 'day2', label: 'End Day', placeholder: '1' }],
      compute: (v) => {
        const d1 = new Date(v.year1, v.month1 - 1, v.day1);
        const d2 = new Date(v.year2, v.month2 - 1, v.day2);
        const days = Math.abs(Math.round((d2.getTime() - d1.getTime()) / 86400000));
        return `Days between: ${days} | Weeks: ${Math.floor(days/7)} | Months: ~${Math.floor(days/30.44)}`;
      },
    },
    'horsepower-calculator': {
      fields: [{ id: 'torque', label: 'Torque (lb-ft)', placeholder: '300' }, { id: 'rpm', label: 'RPM', placeholder: '5000' }],
      compute: (v) => { const hp = v.torque * v.rpm / 5252; return `Horsepower: ${hp.toFixed(2)} HP | Kilowatts: ${(hp * 0.7457).toFixed(2)} kW`; },
    },
    'gas-mileage-calculator': {
      fields: [{ id: 'miles', label: 'Miles Driven', placeholder: '300' }, { id: 'gallons', label: 'Gallons Used', placeholder: '10' }],
      compute: (v) => { const mpg = v.miles / v.gallons; return `MPG: ${mpg.toFixed(2)} | L/100km: ${(235.21/mpg).toFixed(2)}`; },
    },
    'voltage-drop-calculator': {
      fields: [{ id: 'current', label: 'Current (Amps)', placeholder: '20' }, { id: 'resistance', label: 'Wire Resistance (Ω/1000ft)', placeholder: '1.24' }, { id: 'length', label: 'One-way Length (ft)', placeholder: '100' }],
      compute: (v) => { const drop = v.current * (v.resistance / 1000) * v.length * 2; return `Voltage Drop: ${drop.toFixed(2)} V`; },
    },
    'stair-calculator': {
      fields: [{ id: 'totalRise', label: 'Total Rise (inches)', placeholder: '108' }, { id: 'riserHeight', label: 'Desired Riser Height (inches)', placeholder: '7.5' }],
      compute: (v) => {
        const numStairs = Math.round(v.totalRise / v.riserHeight);
        const actualRiser = v.totalRise / numStairs;
        const tread = 17.5 - actualRiser;
        return `Number of stairs: ${numStairs} | Riser height: ${actualRiser.toFixed(2)}" | Tread depth: ${tread.toFixed(2)}"`;
      },
    },
    'resistor-calculator': {
      fields: [{ id: 'r1', label: 'Resistor 1 (Ω)', placeholder: '100' }, { id: 'r2', label: 'Resistor 2 (Ω)', placeholder: '220' }, { id: 'r3', label: 'Resistor 3 (Ω, optional)', placeholder: '0' }],
      compute: (v) => {
        const series = v.r1 + v.r2 + (v.r3 || 0);
        const parallelInv = 1/v.r1 + 1/v.r2 + (v.r3 ? 1/v.r3 : 0);
        return `Series: ${series.toFixed(2)} Ω | Parallel: ${(1/parallelInv).toFixed(2)} Ω`;
      },
    },
    'molarity-calculator': {
      fields: [{ id: 'moles', label: 'Moles of Solute (mol)', placeholder: '0.5' }, { id: 'volume', label: 'Volume of Solution (L)', placeholder: '1' }],
      compute: (v) => `Molarity: ${(v.moles / v.volume).toFixed(4)} M (mol/L)`,
    },
    'mileage-calculator': {
      fields: [{ id: 'start', label: 'Starting Odometer', placeholder: '45000' }, { id: 'end', label: 'Ending Odometer', placeholder: '45300' }, { id: 'gallons', label: 'Gallons Used', placeholder: '10' }],
      compute: (v) => { const miles = v.end - v.start; const mpg = miles / v.gallons; return `Miles driven: ${miles} | MPG: ${mpg.toFixed(2)}`; },
    },
    'mass-calculator': {
      fields: [{ id: 'density', label: 'Density (kg/m³)', placeholder: '1000' }, { id: 'volume', label: 'Volume (m³)', placeholder: '2' }],
      compute: (v) => { const mass = v.density * v.volume; return `Mass: ${mass.toFixed(4)} kg = ${(mass * 2.205).toFixed(4)} lbs`; },
    },
    'weight-calculator': {
      fields: [{ id: 'kg', label: 'Weight (kg)', placeholder: '70' }],
      compute: (v) => `${v.kg} kg = ${(v.kg * 2.20462).toFixed(3)} lbs = ${(v.kg * 35.274).toFixed(3)} oz = ${(v.kg * 1000).toFixed(0)} g`,
    },
    'golf-handicap-calculator': {
      fields: [{ id: 'score', label: 'Adjusted Gross Score', placeholder: '90' }, { id: 'rating', label: 'Course Rating', placeholder: '72.0' }, { id: 'slope', label: 'Slope Rating', placeholder: '130' }],
      compute: (v) => { const diff = ((v.score - v.rating) * 113) / v.slope; return `Handicap Differential: ${diff.toFixed(1)}`; },
    },
    'roofing-calculator': {
      fields: [{ id: 'length', label: 'Roof Length (ft)', placeholder: '40' }, { id: 'width', label: 'Roof Width (ft)', placeholder: '30' }, { id: 'pitch', label: 'Roof Pitch (rise/12)', placeholder: '6' }],
      compute: (v) => {
        const pitchFactor = Math.sqrt(1 + Math.pow(v.pitch/12, 2));
        const area = v.length * v.width * pitchFactor;
        const squares = area / 100;
        return `Roof area: ${area.toFixed(0)} sq ft | Squares needed: ${(squares * 1.1).toFixed(1)} (10% waste)`;
      },
    },
    'mulch-calculator': {
      fields: [{ id: 'length', label: 'Area Length (ft)', placeholder: '20' }, { id: 'width', label: 'Area Width (ft)', placeholder: '10' }, { id: 'depth', label: 'Depth (inches)', placeholder: '3' }],
      compute: (v) => { const cy = (v.length * v.width * v.depth / 12) / 27; return `Cubic yards: ${cy.toFixed(2)} | Cubic feet: ${(v.length * v.width * v.depth/12).toFixed(2)}`; },
    },
    'gravel-calculator': {
      fields: [{ id: 'length', label: 'Length (ft)', placeholder: '20' }, { id: 'width', label: 'Width (ft)', placeholder: '10' }, { id: 'depth', label: 'Depth (inches)', placeholder: '4' }],
      compute: (v) => { const cy = (v.length * v.width * v.depth / 12) / 27; const tons = cy * 1.35; return `Cubic yards: ${cy.toFixed(2)} | Estimated tons: ${tons.toFixed(2)}`; },
    },
    'heat-index-calculator': {
      fields: [{ id: 'temp', label: 'Temperature (°F)', placeholder: '95' }, { id: 'humidity', label: 'Relative Humidity (%)', placeholder: '60' }],
      compute: (v) => {
        const T = v.temp, R = v.humidity;
        const HI = -42.379 + 2.04901523*T + 10.14333127*R - 0.22475541*T*R - 0.00683783*T*T - 0.05481717*R*R + 0.00122874*T*T*R + 0.00085282*T*R*R - 0.00000199*T*T*R*R;
        return `Heat Index: ${HI.toFixed(1)}°F (${((HI-32)*5/9).toFixed(1)}°C)`;
      },
    },
    'dew-point-calculator': {
      fields: [{ id: 'temp', label: 'Temperature (°C)', placeholder: '20' }, { id: 'humidity', label: 'Relative Humidity (%)', placeholder: '60' }],
      compute: (v) => {
        const a = 17.27, b = 237.7;
        const alpha = (a * v.temp / (b + v.temp)) + Math.log(v.humidity / 100);
        const dp = (b * alpha) / (a - alpha);
        return `Dew Point: ${dp.toFixed(1)}°C (${(dp*9/5+32).toFixed(1)}°F)`;
      },
    },
    'bandwidth-calculator': {
      fields: [{ id: 'size', label: 'File Size (MB)', placeholder: '500' }, { id: 'speed', label: 'Download Speed (Mbps)', placeholder: '100' }],
      compute: (v) => {
        const secs = (v.size * 8) / v.speed;
        return `Download time: ${secs.toFixed(1)} seconds (${(secs/60).toFixed(1)} min)`;
      },
    },
    'time-card-calculator': {
      fields: [{ id: 'monIn', label: 'Mon In (hour, 0-23)', placeholder: '9' }, { id: 'monOut', label: 'Mon Out (hour, 0-23)', placeholder: '17' }, { id: 'rate', label: 'Hourly Rate ($)', placeholder: '25' }],
      compute: (v) => {
        const hours = v.monOut - v.monIn;
        const weekHours = hours * 5;
        return `Daily hours: ${hours.toFixed(2)} | Estimated weekly: ${weekHours.toFixed(2)} hrs | Pay: $${(weekHours * v.rate).toFixed(2)}`;
      },
    },
    'love-calculator': {
      fields: [{ id: 'name1len', label: 'Your name length (letters)', placeholder: '5' }, { id: 'name2len', label: 'Partner name length (letters)', placeholder: '6' }],
      compute: (v) => {
        const score = Math.round(((v.name1len + v.name2len) * 7) % 100);
        const msg = score > 80 ? 'Perfect Match! ❤️' : score > 60 ? 'Great Compatibility 💕' : score > 40 ? 'Good Match 💛' : 'Keep working at it 💪';
        return `Love Score: ${score}% — ${msg}`;
      },
    },
    'gdp-calculator': {
      fields: [{ id: 'consumption', label: 'Consumption ($B)', placeholder: '14000' }, { id: 'investment', label: 'Investment ($B)', placeholder: '3000' }, { id: 'government', label: 'Government Spending ($B)', placeholder: '3500' }, { id: 'exports', label: 'Exports ($B)', placeholder: '2500' }, { id: 'imports', label: 'Imports ($B)', placeholder: '3000' }],
      compute: (v) => { const gdp = v.consumption + v.investment + v.government + (v.exports - v.imports); return `GDP: $${gdp.toLocaleString()}B | Net Exports: $${(v.exports-v.imports).toLocaleString()}B`; },
    },
    'engine-horsepower-calculator': {
      fields: [{ id: 'et', label: 'Quarter-mile ET (seconds)', placeholder: '13.5' }, { id: 'weight', label: 'Vehicle Weight (lbs)', placeholder: '3500' }],
      compute: (v) => { const hp = Math.pow(v.weight / v.et, 3) / 1000; return `Estimated HP: ${hp.toFixed(0)} (Hale formula)`; },
    },
    'shoe-size-calculator': {
      fields: [{ id: 'foot', label: 'Foot Length (cm)', placeholder: '26' }],
      compute: (v) => {
        const us = (v.foot - 14.81) / 0.846 + 1;
        const eu = (v.foot / 0.667) + 2;
        const uk = us - 0.5;
        return `US: ${us.toFixed(1)} | EU: ${eu.toFixed(0)} | UK: ${uk.toFixed(1)}`;
      },
    },
    'conversion-calculator': {
      fields: [{ id: 'celsius', label: 'Celsius (°C)', placeholder: '100' }],
      compute: (v) => { const f = v.celsius * 9/5 + 32; const k = v.celsius + 273.15; return `${v.celsius}°C = ${f.toFixed(2)}°F = ${k.toFixed(2)}K`; },
    },
    'day-of-week-calculator': {
      fields: [{ id: 'year', label: 'Year', placeholder: '2024' }, { id: 'month', label: 'Month (1-12)', placeholder: '7' }, { id: 'day', label: 'Day', placeholder: '4' }],
      compute: (v) => {
        const date = new Date(v.year, v.month - 1, v.day);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return `${date.toLocaleDateString('en-US', {month:'long',day:'numeric',year:'numeric'})} is a ${days[date.getDay()]}`;
      },
    },
    'tire-size-calculator': {
      fields: [{ id: 'width', label: 'Tire Width (mm)', placeholder: '225' }, { id: 'aspect', label: 'Aspect Ratio', placeholder: '45' }, { id: 'rim', label: 'Rim Diameter (inches)', placeholder: '17' }],
      compute: (v) => {
        const sidewall = v.width * v.aspect / 100;
        const diameter = (v.rim * 25.4) + 2 * sidewall;
        const circumference = Math.PI * diameter;
        return `Overall diameter: ${(diameter/25.4).toFixed(2)}" | Circumference: ${(circumference/25.4).toFixed(2)}" | Sidewall: ${sidewall.toFixed(1)}mm`;
      },
    },
    'roman-numeral-converter': {
      fields: [{ id: 'number', label: 'Arabic Number (1-3999)', placeholder: '2024' }],
      compute: (v) => {
        const n = Math.round(v.number);
        const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
        const syms = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
        let result = '', num = n;
        for (let i = 0; i < vals.length; i++) { while (num >= vals[i]) { result += syms[i]; num -= vals[i]; } }
        return `${n} = ${result}`;
      },
    },
    'ip-subnet-calculator': {
      fields: [{ id: 'ip4', label: '4th octet of IP (0-255)', placeholder: '100' }, { id: 'prefix', label: 'Prefix length (e.g. 24)', placeholder: '24' }],
      compute: (v) => {
        const hosts = Math.pow(2, 32 - v.prefix) - 2;
        return `Usable hosts: ${Math.max(0, hosts).toLocaleString()} | CIDR: /${v.prefix} | Subnets per class C: ${Math.pow(2, v.prefix - 24).toFixed(0)}`;
      },
    },
    'bra-size-calculator': {
      fields: [{ id: 'underbust', label: 'Underbust (inches)', placeholder: '32' }, { id: 'bust', label: 'Bust (inches)', placeholder: '36' }],
      compute: (v) => {
        const bandSize = v.underbust % 2 === 0 ? v.underbust + 2 : v.underbust + 1;
        const cupDiff = v.bust - bandSize;
        const cups = ['AA','A','B','C','D','DD','DDD/E','F','G'];
        const cup = cups[Math.max(0, Math.min(Math.round(cupDiff), cups.length - 1))];
        return `Bra Size: ${bandSize}${cup} (US)`;
      },
    },
    'molecular-weight-calculator': {
      fields: [{ id: 'carbon', label: 'Carbon atoms (C)', placeholder: '2' }, { id: 'hydrogen', label: 'Hydrogen atoms (H)', placeholder: '6' }, { id: 'oxygen', label: 'Oxygen atoms (O)', placeholder: '1' }],
      compute: (v) => { const mw = v.carbon * 12.011 + v.hydrogen * 1.008 + v.oxygen * 15.999; return `Molecular Weight: ${mw.toFixed(3)} g/mol (C${v.carbon}H${v.hydrogen}O${v.oxygen})`; },
    },
    // Additional financial calculators
    'currency-calculator': {
      fields: [
        { id: 'amount', label: 'Amount (Source Currency)', placeholder: '100' },
        { id: 'sourceRate', label: 'Source per USD (e.g. USD=1, EUR=0.92)', placeholder: '1' },
        { id: 'targetRate', label: 'Target per USD (e.g. JPY=155)', placeholder: '0.92' },
        { id: 'fee', label: 'Exchange Fee / Spread (%)', placeholder: '1.5' },
      ],
      compute: (v) => {
        const amount = Math.max(0, v.amount);
        const sourceRate = Math.max(0.0000001, v.sourceRate || 1);
        const targetRate = Math.max(0.0000001, v.targetRate || 1);
        const feePct = Math.max(0, v.fee) / 100;

        const crossRate = targetRate / sourceRate;
        const inverseRate = sourceRate / targetRate;

        const grossQuote = amount * crossRate;
        const netQuote = grossQuote * (1 - feePct);
        const effectiveRate = netQuote / (amount || 1);
        const feeCost = grossQuote - netQuote;

        return `Market cross-rate: 1 source = ${crossRate.toFixed(6)} target | Converted (gross): ${grossQuote.toFixed(4)} target | Fee cost: ${feeCost.toFixed(4)} target | Converted (after fee): ${netQuote.toFixed(4)} target | Effective customer rate: ${effectiveRate.toFixed(6)} | Inverse market rate: 1 target = ${inverseRate.toFixed(6)} source`;
      },
    },
    'finance-calculator': {
      fields: [
        { id: 'pv', label: 'Present Value ($)', placeholder: '0' },
        { id: 'rate', label: 'Annual Rate (%)', placeholder: '6' },
        { id: 'n', label: 'Periods (months)', placeholder: '60' },
        { id: 'pmt', label: 'Payment ($, optional)', placeholder: '0' },
        { id: 'targetFv', label: 'Target Future Value ($, optional)', placeholder: '100000' },
      ],
      compute: (v) => {
        const pv = Math.max(0, v.pv);
        const r = Math.max(0, v.rate) / 100 / 12;
        const periods = Math.max(0, Math.round(v.n));
        const payment = Math.max(0, v.pmt);
        const targetFv = Math.max(0, v.targetFv || 0);

        if (periods <= 0) return 'Enter periods greater than 0.';

        const growthFactor = r === 0 ? periods : ((Math.pow(1 + r, periods) - 1) / r);
        const fv = r === 0
          ? pv + payment * periods
          : pv * Math.pow(1 + r, periods) + (payment > 0 ? payment * growthFactor : 0);

        const requiredPaymentForTarget = targetFv > 0
          ? Math.max(0, (targetFv - (r === 0 ? pv : pv * Math.pow(1 + r, periods))) / (growthFactor || periods || 1))
          : 0;
        const targetGap = targetFv > 0 ? targetFv - fv : 0;

        const totalContributions = pv + payment * periods;
        const growth = fv - totalContributions;
        const ear = Math.pow(1 + r, 12) - 1;

        if (targetFv > 0) {
          return `Projected FV: $${fv.toFixed(2)} | Target FV: $${targetFv.toFixed(2)} | ${targetGap <= 0 ? `Status: Ahead by $${Math.abs(targetGap).toFixed(2)}` : `Status: Short by $${targetGap.toFixed(2)}`} | Required payment for target: $${requiredPaymentForTarget.toFixed(2)}/period | Total Contributions (current inputs): $${totalContributions.toFixed(2)} | Growth: $${growth.toFixed(2)} | Effective Annual Rate: ${(ear * 100).toFixed(2)}%`;
        }

        return `Future Value: $${fv.toFixed(2)} | Total Contributions: $${totalContributions.toFixed(2)} | Growth: $${growth.toFixed(2)} | Effective Annual Rate: ${(ear * 100).toFixed(2)}%`;
      },
    },
    'mortgage-payoff-calculator': {
      fields: [{ id: 'balance', label: 'Remaining Balance ($)', placeholder: '250000' }, { id: 'rate', label: 'Interest Rate (%)', placeholder: '6.5' }, { id: 'payment', label: 'Current Monthly Payment ($)', placeholder: '1580' }, { id: 'extra', label: 'Extra Monthly Payment ($)', placeholder: '200' }],
      compute: (v) => {
        const balance = Math.max(0, v.balance);
        const r = Math.max(0, v.rate) / 100 / 12;
        const payment = Math.max(0, v.payment);
        const extra = Math.max(0, v.extra);
        if (balance <= 0 || payment <= 0) return 'Enter a valid balance and payment greater than 0.';

        const simulate = (pmt: number) => {
          let b = balance;
          let m = 0;
          let totalInterest = 0;
          while (b > 0.01 && m < 1200) {
            const interest = b * r;
            const principal = pmt - interest;
            if (principal <= 0) return { months: 0, interest: 0, feasible: false };
            b = Math.max(0, b - principal);
            totalInterest += interest;
            m++;
          }
          return { months: m, interest: totalInterest, feasible: true };
        };

        const orig = simulate(payment);
        if (!orig.feasible) return `Payment is too low to cover monthly interest. Increase payment above $${(balance * r).toFixed(2)}.`;
        const fast = simulate(payment + extra);
        if (!fast.feasible) return 'Extra-payment scenario is not feasible with current inputs.';

        const monthsSaved = Math.max(0, orig.months - fast.months);
        const interestSaved = Math.max(0, orig.interest - fast.interest);
        return `Original payoff: ${orig.months} months (${(orig.months/12).toFixed(1)} yrs) | With extra $${extra.toFixed(2)}/mo: ${fast.months} months (${(fast.months/12).toFixed(1)} yrs) | Time saved: ${monthsSaved} months | Interest saved: $${interestSaved.toFixed(2)}`;
      },
    },
    'marriage-tax-calculator': {
      fields: [{ id: 'income1', label: 'Spouse 1 Income ($)', placeholder: '60000' }, { id: 'income2', label: 'Spouse 2 Income ($)', placeholder: '40000' }],
      compute: (v) => {
        const calcTax = (inc: number, std: number) => {
          const t = Math.max(0, inc - std);
          const b = [[11000,0.10],[44725,0.12],[95375,0.22],[201050,0.24],[383900,0.32],[487450,0.35],[Infinity,0.37]];
          let tax = 0, prev = 0;
          for (const [lim, r] of b) { if (t <= prev) break; tax += (Math.min(t, lim as number) - prev) * (r as number); prev = lim as number; }
          return tax;
        };
        const single1 = calcTax(v.income1, 13850);
        const single2 = calcTax(v.income2, 13850);
        const married = calcTax(v.income1 + v.income2, 27700);
        const diff = married - (single1 + single2);
        return `Single taxes: $${(single1+single2).toFixed(0)} | Married filing jointly: $${married.toFixed(0)} | ${diff > 0 ? 'Marriage Penalty' : 'Marriage Bonus'}: $${Math.abs(diff).toFixed(0)}`;
      },
    },
    'estate-tax-calculator': {
      fields: [{ id: 'estate', label: 'Estate Value ($)', placeholder: '15000000' }, { id: 'exemption', label: 'Federal Exemption ($)', placeholder: '12920000' }],
      compute: (v) => {
        const taxable = Math.max(0, v.estate - v.exemption);
        const tax = taxable * 0.40;
        return `Taxable Estate: $${taxable.toLocaleString()} | Estimated Tax (40%): $${Math.round(tax).toLocaleString()} | After Tax: $${Math.round(v.estate - tax).toLocaleString()}`;
      },
    },
    'social-security-calculator': {
      fields: [{ id: 'pia', label: 'Primary Insurance Amount ($)', placeholder: '2000' }, { id: 'age', label: 'Claiming Age', placeholder: '67' }],
      compute: (v) => {
        const fra = 67;
        let benefit = v.pia;
        if (v.age < fra) benefit *= (1 - 0.067 * (fra - v.age));
        else if (v.age > fra) benefit *= (1 + 0.08 * (v.age - fra));
        return `Estimated Monthly: $${benefit.toFixed(0)} | Annual: $${(benefit * 12).toFixed(0)} | 20-yr Total: $${(benefit * 12 * 20).toFixed(0)}`;
      },
    },
    'annuity-calculator': {
      fields: [{ id: 'principal', label: 'Principal ($)', placeholder: '100000' }, { id: 'rate', label: 'Annual Rate (%)', placeholder: '5' }, { id: 'years', label: 'Years', placeholder: '20' }],
      compute: (v) => {
        const r = v.rate / 100 / 12, n = v.years * 12;
        const pmt = v.principal * r / (1 - Math.pow(1+r, -n));
        return `Monthly Payout: $${pmt.toFixed(2)} | Annual: $${(pmt*12).toFixed(2)} | Total: $${(pmt*n).toFixed(2)}`;
      },
    },
    'annuity-payout-calculator': {
      fields: [{ id: 'balance', label: 'Account Balance ($)', placeholder: '500000' }, { id: 'rate', label: 'Annual Return (%)', placeholder: '4' }, { id: 'years', label: 'Payout Years', placeholder: '25' }],
      compute: (v) => {
        const r = v.rate / 100 / 12, n = v.years * 12;
        const pmt = v.balance * r / (1 - Math.pow(1+r, -n));
        return `Monthly Income: $${pmt.toFixed(2)} | Annual: $${(pmt*12).toFixed(2)} | Total Received: $${(pmt*n).toFixed(2)}`;
      },
    },
    'debt-consolidation-calculator': {
      fields: [{ id: 'debt', label: 'Total Debt ($)', placeholder: '25000' }, { id: 'currentRate', label: 'Current Avg Rate (%)', placeholder: '19.99' }, { id: 'newRate', label: 'New Rate (%)', placeholder: '9.99' }, { id: 'years', label: 'Term (years)', placeholder: '5' }],
      compute: (v) => {
        const calc = (r: number) => { const mr = r/100/12; const n = v.years*12; return (v.debt * mr * Math.pow(1+mr,n)) / (Math.pow(1+mr,n) - 1); };
        const old = calc(v.currentRate), nw = calc(v.newRate);
        return `Old Payment: $${old.toFixed(2)}/mo | New Payment: $${nw.toFixed(2)}/mo | Monthly Savings: $${(old-nw).toFixed(2)} | Total Savings: $${((old-nw)*v.years*12).toFixed(0)}`;
      },
    },
    'repayment-calculator': {
      fields: [{ id: 'amount', label: 'Loan Amount ($)', placeholder: '15000' }, { id: 'rate', label: 'Annual Rate (%)', placeholder: '8' }, { id: 'years', label: 'Repayment Period (years)', placeholder: '5' }],
      compute: (v) => {
        const r = v.rate/100/12, n = v.years*12;
        const m = (v.amount * r * Math.pow(1+r,n)) / (Math.pow(1+r,n) - 1);
        return `Monthly: $${m.toFixed(2)} | Total: $${(m*n).toFixed(2)} | Interest: $${(m*n - v.amount).toFixed(2)}`;
      },
    },
    'student-loan-calculator': {
      fields: [{ id: 'balance', label: 'Loan Balance ($)', placeholder: '35000' }, { id: 'rate', label: 'Interest Rate (%)', placeholder: '5.5' }, { id: 'years', label: 'Repayment Years', placeholder: '10' }],
      compute: (v) => {
        const r = v.rate/100/12, n = v.years*12;
        const m = (v.balance * r * Math.pow(1+r,n)) / (Math.pow(1+r,n) - 1);
        return `Monthly: $${m.toFixed(2)} | Total Paid: $${(m*n).toFixed(2)} | Total Interest: $${(m*n - v.balance).toFixed(2)}`;
      },
    },
    'college-cost-calculator': {
      fields: [{ id: 'annual', label: 'Current Annual Cost ($)', placeholder: '35000' }, { id: 'inflation', label: 'Tuition Inflation (%)', placeholder: '4' }, { id: 'years', label: 'Years Until Enrollment', placeholder: '5' }, { id: 'duration', label: 'Years in College', placeholder: '4' }],
      compute: (v) => {
        let total = 0;
        for (let i = 0; i < v.duration; i++) {
          total += v.annual * Math.pow(1 + v.inflation/100, v.years + i);
        }
        return `Total 4-Year Cost (future $): $${Math.round(total).toLocaleString()} | Avg Year: $${Math.round(total/v.duration).toLocaleString()}`;
      },
    },
    'bond-calculator': {
      fields: [{ id: 'face', label: 'Face Value ($)', placeholder: '1000' }, { id: 'coupon', label: 'Coupon Rate (%)', placeholder: '5' }, { id: 'years', label: 'Years to Maturity', placeholder: '10' }, { id: 'ytm', label: 'Yield to Maturity (%)', placeholder: '6' }],
      compute: (v) => {
        const r = v.ytm/100, c = v.face * v.coupon/100;
        const price = c * (1 - Math.pow(1+r,-v.years)) / r + v.face * Math.pow(1+r,-v.years);
        const annualIncome = c;
        return `Bond Price: $${price.toFixed(2)} | Annual Income: $${annualIncome.toFixed(2)} | Current Yield: ${((c/price)*100).toFixed(2)}%`;
      },
    },
    'rmd-calculator': {
      fields: [{ id: 'balance', label: 'Account Balance ($)', placeholder: '500000' }, { id: 'age', label: 'Your Age', placeholder: '73' }],
      compute: (v) => {
        const factors: Record<number, number> = {72:27.4,73:26.5,74:25.5,75:24.6,76:23.7,77:22.9,78:22.0,79:21.1,80:20.2,81:19.4,82:18.5,83:17.7,84:16.8,85:16.0};
        const factor = factors[Math.round(v.age)] ?? (v.age < 72 ? 28.0 : 15.0);
        const rmd = v.balance / factor;
        return `Required RMD: $${rmd.toFixed(0)} | Distribution Period: ${factor} years | Monthly: $${(rmd/12).toFixed(0)}`;
      },
    },
    'cash-back-calculator': {
      fields: [{ id: 'balance', label: 'Card Balance ($)', placeholder: '5000' }, { id: 'cashBack', label: 'Cash Back Rate (%)', placeholder: '2' }, { id: 'lowRate', label: 'Low APR (%)', placeholder: '14.99' }, { id: 'highRate', label: 'Current APR (%)', placeholder: '24.99' }],
      compute: (v) => {
        const cashRewards = v.balance * v.cashBack / 100;
        const interestSavings = v.balance * (v.highRate - v.lowRate) / 100;
        return `Annual Cash Back: $${cashRewards.toFixed(2)} | Annual Interest Savings (low APR card): $${interestSavings.toFixed(2)} | Better choice: ${interestSavings > cashRewards ? 'Low APR card' : 'Cash Back card'}`;
      },
    },
    'average-return-calculator': {
      fields: [{ id: 'initial', label: 'Initial Investment ($)', placeholder: '10000' }, { id: 'final', label: 'Final Value ($)', placeholder: '20000' }, { id: 'years', label: 'Investment Period (years)', placeholder: '10' }],
      compute: (v) => {
        const cagr = (Math.pow(v.final / v.initial, 1 / v.years) - 1) * 100;
        const totalReturn = ((v.final - v.initial) / v.initial) * 100;
        return `CAGR: ${cagr.toFixed(2)}% | Total Return: ${totalReturn.toFixed(1)}% | Gain: $${(v.final - v.initial).toLocaleString()}`;
      },
    },
    'business-loan-calculator': {
      fields: [{ id: 'amount', label: 'Loan Amount ($)', placeholder: '100000' }, { id: 'rate', label: 'Annual Rate (%)', placeholder: '8.5' }, { id: 'years', label: 'Term (years)', placeholder: '5' }],
      compute: (v) => {
        const r = v.rate/100/12, n = v.years*12;
        const m = (v.amount * r * Math.pow(1+r,n)) / (Math.pow(1+r,n) - 1);
        return `Monthly: $${m.toFixed(2)} | Total: $${(m*n).toFixed(2)} | Interest: $${(m*n - v.amount).toFixed(2)}`;
      },
    },
    'real-estate-calculator': {
      fields: [{ id: 'price', label: 'Property Price ($)', placeholder: '300000' }, { id: 'rent', label: 'Monthly Rent ($)', placeholder: '1800' }, { id: 'expenses', label: 'Annual Expenses ($)', placeholder: '6000' }, { id: 'down', label: 'Down Payment (%)', placeholder: '20' }],
      compute: (v) => {
        const annualRent = v.rent * 12;
        const noi = annualRent - v.expenses;
        const capRate = (noi / v.price) * 100;
        const cashInvested = v.price * v.down / 100;
        const cashReturn = (noi / cashInvested) * 100;
        return `NOI: $${noi.toLocaleString()} | Cap Rate: ${capRate.toFixed(2)}% | Cash-on-Cash: ${cashReturn.toFixed(2)}% | GRM: ${(v.price/annualRent).toFixed(1)}x`;
      },
    },
    'take-home-paycheck-calculator': {
      fields: [{ id: 'gross', label: 'Gross Pay ($)', placeholder: '5000' }, { id: 'federal', label: 'Federal Tax Rate (%)', placeholder: '22' }, { id: 'state', label: 'State Tax Rate (%)', placeholder: '5' }, { id: 'fica', label: 'FICA/Social Security (%)', placeholder: '7.65' }, { id: 'other', label: 'Other Deductions ($)', placeholder: '0' }],
      compute: (v) => {
        const deductions = v.gross * (v.federal + v.state + v.fica) / 100 + v.other;
        const net = v.gross - deductions;
        return `Net Pay: $${net.toFixed(2)} | Deductions: $${deductions.toFixed(2)} | Annual Net: $${(net*26).toFixed(0)} (bi-weekly)`;
      },
    },
    'personal-loan-calculator': {
      fields: [{ id: 'amount', label: 'Loan Amount ($)', placeholder: '15000' }, { id: 'rate', label: 'APR (%)', placeholder: '12' }, { id: 'months', label: 'Term (months)', placeholder: '48' }],
      compute: (v) => {
        const r = v.rate/100/12;
        const m = (v.amount * r * Math.pow(1+r, v.months)) / (Math.pow(1+r, v.months) - 1);
        return `Monthly: $${m.toFixed(2)} | Total: $${(m * v.months).toFixed(2)} | Interest: $${(m * v.months - v.amount).toFixed(2)}`;
      },
    },
    'boat-loan-calculator': {
      fields: [{ id: 'price', label: 'Boat Price ($)', placeholder: '50000' }, { id: 'down', label: 'Down Payment ($)', placeholder: '10000' }, { id: 'rate', label: 'Annual Rate (%)', placeholder: '8' }, { id: 'years', label: 'Term (years)', placeholder: '10' }],
      compute: (v) => {
        const P = v.price - v.down, r = v.rate/100/12, n = v.years*12;
        const m = (P * r * Math.pow(1+r,n)) / (Math.pow(1+r,n) - 1);
        return `Monthly: $${m.toFixed(2)} | Total: $${(m*n).toFixed(2)} | Interest: $${(m*n - P).toFixed(2)}`;
      },
    },
    'lease-calculator': {
      fields: [{ id: 'value', label: 'Asset Value ($)', placeholder: '30000' }, { id: 'residual', label: 'Residual Value ($)', placeholder: '18000' }, { id: 'rate', label: 'Annual Rate (%)', placeholder: '6' }, { id: 'months', label: 'Lease Term (months)', placeholder: '36' }],
      compute: (v) => {
        const r = v.rate/100/12;
        const monthly = (v.value - v.residual * Math.pow(1+r,-v.months)) * r / (1 - Math.pow(1+r,-v.months));
        return `Monthly Payment: $${monthly.toFixed(2)} | Total: $${(monthly * v.months).toFixed(2)} | Total Interest: $${(monthly * v.months - (v.value - v.residual)).toFixed(2)}`;
      },
    },
    'budget-calculator': {
      fields: [{ id: 'income', label: 'Monthly Income ($)', placeholder: '5000' }, { id: 'housing', label: 'Housing ($)', placeholder: '1500' }, { id: 'food', label: 'Food ($)', placeholder: '400' }, { id: 'transport', label: 'Transport ($)', placeholder: '300' }, { id: 'other', label: 'Other Expenses ($)', placeholder: '500' }],
      compute: (v) => {
        const expenses = v.housing + v.food + v.transport + v.other;
        const savings = v.income - expenses;
        const savingsRate = (savings / v.income) * 100;
        return `Total Expenses: $${expenses.toFixed(0)} | Savings: $${savings.toFixed(0)} | Savings Rate: ${savingsRate.toFixed(1)}% | ${savings >= 0 ? '✅ Budget OK' : '❌ Over Budget'}`;
      },
    },
    'rental-property-calculator': {
      fields: [{ id: 'price', label: 'Purchase Price ($)', placeholder: '300000' }, { id: 'rent', label: 'Monthly Rent ($)', placeholder: '2000' }, { id: 'expenses', label: 'Monthly Expenses ($)', placeholder: '800' }, { id: 'down', label: 'Down Payment ($)', placeholder: '60000' }, { id: 'rate', label: 'Mortgage Rate (%)', placeholder: '7' }],
      compute: (v) => {
        const loan = v.price - v.down, r = v.rate/100/12, n = 360;
        const mortgage = (loan * r * Math.pow(1+r,n)) / (Math.pow(1+r,n) - 1);
        const cashFlow = v.rent - v.expenses - mortgage;
        const coc = (cashFlow * 12 / v.down) * 100;
        return `Mortgage: $${mortgage.toFixed(0)}/mo | Cash Flow: $${cashFlow.toFixed(0)}/mo | Cash-on-Cash: ${coc.toFixed(1)}% | ${cashFlow > 0 ? '✅ Positive' : '❌ Negative'} cash flow`;
      },
    },
    'irr-calculator': {
      fields: [{ id: 'initial', label: 'Initial Investment ($)', placeholder: '10000' }, { id: 'y1', label: 'Year 1 Cash Flow ($)', placeholder: '3000' }, { id: 'y2', label: 'Year 2 Cash Flow ($)', placeholder: '4000' }, { id: 'y3', label: 'Year 3 Cash Flow ($)', placeholder: '5000' }],
      compute: (v) => {
        const flows = [-v.initial, v.y1, v.y2, v.y3];
        let r = 0.1;
        for (let iter = 0; iter < 100; iter++) {
          let npv = 0, dnpv = 0;
          flows.forEach((cf, t) => { npv += cf / Math.pow(1+r, t); dnpv += -t * cf / Math.pow(1+r, t+1); });
          r = r - npv / dnpv;
        }
        const npv = flows.reduce((acc, cf, t) => acc + cf / Math.pow(1.1, t), 0);
        return `IRR: ${(r * 100).toFixed(2)}% | NPV @10%: $${npv.toFixed(0)}`;
      },
    },
    'fha-loan-calculator': {
      fields: [{ id: 'price', label: 'Home Price ($)', placeholder: '300000' }, { id: 'down', label: 'Down Payment (%, min 3.5)', placeholder: '3.5' }, { id: 'rate', label: 'Interest Rate (%)', placeholder: '7' }, { id: 'years', label: 'Term (years)', placeholder: '30' }],
      compute: (v) => {
        const downAmt = v.price * v.down / 100;
        const upfrontMip = (v.price - downAmt) * 0.0175;
        const loan = v.price - downAmt + upfrontMip;
        const r = v.rate/100/12, n = v.years*12;
        const m = (loan * r * Math.pow(1+r,n)) / (Math.pow(1+r,n) - 1);
        const annualMip = (v.price - downAmt) * 0.0055 / 12;
        return `Down: $${downAmt.toFixed(0)} | P&I: $${m.toFixed(2)}/mo | Annual MIP: $${annualMip.toFixed(2)}/mo | Total: $${(m + annualMip).toFixed(2)}/mo`;
      },
    },
    'va-mortgage-calculator': {
      fields: [{ id: 'price', label: 'Home Price ($)', placeholder: '300000' }, { id: 'rate', label: 'Interest Rate (%)', placeholder: '6.5' }, { id: 'years', label: 'Term (years)', placeholder: '30' }, { id: 'fundingFee', label: 'Funding Fee (%)', placeholder: '2.3' }],
      compute: (v) => {
        const fee = v.price * v.fundingFee / 100;
        const loan = v.price + fee;
        const r = v.rate/100/12, n = v.years*12;
        const m = (loan * r * Math.pow(1+r,n)) / (Math.pow(1+r,n) - 1);
        return `Loan (with fee): $${Math.round(loan).toLocaleString()} | Monthly: $${m.toFixed(2)} | VA Funding Fee: $${fee.toFixed(0)} | No PMI required ✅`;
      },
    },
    'home-equity-loan-calculator': {
      fields: [{ id: 'homeValue', label: 'Home Value ($)', placeholder: '400000' }, { id: 'mortgage', label: 'Mortgage Balance ($)', placeholder: '250000' }, { id: 'rate', label: 'Loan Rate (%)', placeholder: '8.5' }, { id: 'years', label: 'Term (years)', placeholder: '10' }],
      compute: (v) => {
        const equity = v.homeValue - v.mortgage;
        const maxLoan = equity * 0.85;
        const r = v.rate/100/12, n = v.years*12;
        const m = (maxLoan * r * Math.pow(1+r,n)) / (Math.pow(1+r,n) - 1);
        return `Home Equity: $${equity.toLocaleString()} | Max Loan (85%): $${maxLoan.toLocaleString()} | Monthly: $${m.toFixed(2)} | LTV: ${((v.mortgage/v.homeValue)*100).toFixed(1)}%`;
      },
    },
    'heloc-calculator': {
      fields: [{ id: 'homeValue', label: 'Home Value ($)', placeholder: '400000' }, { id: 'mortgage', label: 'Mortgage Balance ($)', placeholder: '250000' }, { id: 'rate', label: 'HELOC Rate (%)', placeholder: '9' }, { id: 'draw', label: 'Amount to Draw ($)', placeholder: '50000' }],
      compute: (v) => {
        const equity = v.homeValue - v.mortgage;
        const maxLine = equity * 0.85;
        const monthlyInterest = v.draw * v.rate / 100 / 12;
        return `Available Equity: $${equity.toLocaleString()} | Max Credit Line (85%): $${maxLine.toLocaleString()} | Monthly Interest-Only on Draw: $${monthlyInterest.toFixed(2)}`;
      },
    },
    'rent-vs-buy-calculator': {
      fields: [{ id: 'homePrice', label: 'Home Price ($)', placeholder: '400000' }, { id: 'rent', label: 'Monthly Rent ($)', placeholder: '2000' }, { id: 'rate', label: 'Mortgage Rate (%)', placeholder: '7' }, { id: 'years', label: 'Horizon (years)', placeholder: '7' }],
      compute: (v) => {
        const down = v.homePrice * 0.20, loan = v.homePrice - down;
        const r = v.rate/100/12, n = 360;
        const m = (loan * r * Math.pow(1+r,n)) / (Math.pow(1+r,n) - 1);
        const totalBuy = down + m * v.years * 12;
        const totalRent = v.rent * v.years * 12;
        const equity = v.homePrice * Math.pow(1.03, v.years) - loan;
        const buyCost = totalBuy - equity;
        return `Monthly Mortgage: $${m.toFixed(0)} | Total Buy Cost: $${buyCost.toFixed(0)} | Total Rent: $${totalRent.toFixed(0)} | ${buyCost < totalRent ? 'Buying' : 'Renting'} is cheaper over ${v.years} yrs`;
      },
    },
    'mortgage-calculator-uk': {
      fields: [{ id: 'price', label: 'Property Price (£)', placeholder: '300000' }, { id: 'deposit', label: 'Deposit (%)', placeholder: '10' }, { id: 'rate', label: 'Interest Rate (%)', placeholder: '5.5' }, { id: 'years', label: 'Term (years)', placeholder: '25' }],
      compute: (v) => {
        const loan = v.price * (1 - v.deposit/100), r = v.rate/100/12, n = v.years*12;
        const m = (loan * r * Math.pow(1+r,n)) / (Math.pow(1+r,n) - 1);
        const stampDuty = v.price > 250000 ? (v.price - 250000) * 0.05 + (Math.min(v.price, 925000) - 250000 < 0 ? 0 : 0) : 0;
        return `Monthly: £${m.toFixed(2)} | Total: £${(m*n).toFixed(2)} | Interest: £${(m*n - loan).toFixed(2)} | Est. Stamp Duty: £${stampDuty.toFixed(0)}`;
      },
    },
    'canadian-mortgage-calculator': {
      fields: [{ id: 'price', label: 'Purchase Price (CAD $)', placeholder: '600000' }, { id: 'down', label: 'Down Payment (%)', placeholder: '20' }, { id: 'rate', label: 'Annual Rate (%)', placeholder: '5.5' }, { id: 'years', label: 'Amortization (years)', placeholder: '25' }],
      compute: (v) => {
        const loan = v.price * (1 - v.down/100);
        const r = Math.pow(1 + v.rate/100/2, 1/6) - 1;
        const n = v.years * 12;
        const m = (loan * r * Math.pow(1+r,n)) / (Math.pow(1+r,n) - 1);
        const cmhc = v.down < 20 ? loan * 0.028 : 0;
        return `Monthly: $${m.toFixed(2)} | CMHC Insurance: $${cmhc.toFixed(0)} | Total Interest: $${(m*n - loan).toFixed(0)} | Semi-annual compounding used`;
      },
    },
    'army-body-fat-calculator': {
      fields: [{ id: 'height', label: 'Height (inches)', placeholder: '70' }, { id: 'neck', label: 'Neck (inches)', placeholder: '15' }, { id: 'waist', label: 'Waist (inches)', placeholder: '34' }],
      compute: (v) => {
        const bf = 86.010 * Math.log10(v.waist - v.neck) - 70.041 * Math.log10(v.height) + 36.76;
        const standard = bf <= 20 ? '✅ Meets standard' : bf <= 26 ? '⚠️ Borderline' : '❌ Over standard (male)';
        return `Body Fat: ${Math.max(0, bf).toFixed(1)}% | Army Standard: ${standard}`;
      },
    },
    'carbohydrate-calculator': {
      fields: [{ id: 'calories', label: 'Daily Calorie Target', placeholder: '2000' }, { id: 'percent', label: 'Carb Percentage (%)', placeholder: '50' }],
      compute: (v) => {
        const carbCals = v.calories * v.percent / 100;
        const grams = carbCals / 4;
        return `Daily Carbs: ${grams.toFixed(0)}g (${carbCals.toFixed(0)} calories) | Per Meal (3 meals): ${(grams/3).toFixed(0)}g`;
      },
    },
    'healthy-weight-calculator': {
      fields: [{ id: 'heightFt', label: 'Height Feet', placeholder: '5' }, { id: 'heightIn', label: 'Height Inches', placeholder: '10' }],
      compute: (v) => {
        const totalIn = v.heightFt * 12 + v.heightIn;
        const lowBmi = 18.5, highBmi = 24.9;
        const low = (lowBmi * totalIn * totalIn / 703).toFixed(1);
        const high = (highBmi * totalIn * totalIn / 703).toFixed(1);
        return `Healthy Weight Range: ${low} – ${high} lbs (BMI 18.5–24.9) for ${v.heightFt}'${v.heightIn}" height`;
      },
    },
    'body-type-calculator': {
      fields: [{ id: 'shoulder', label: 'Shoulder Width (inches)', placeholder: '17' }, { id: 'waist', label: 'Waist (inches)', placeholder: '32' }, { id: 'hip', label: 'Hip (inches)', placeholder: '38' }],
      compute: (v) => {
        const sw = v.shoulder / v.waist, hw = v.hip / v.waist;
        const type = sw > 1.15 && hw < 1.10 ? 'Inverted Triangle (Athletic)' : sw < 1.05 && hw < 1.05 ? 'Rectangle (Athletic/Ectomorph)' : hw > 1.15 ? 'Pear / Triangle' : 'Hourglass / Oval';
        return `Shoulder/Waist Ratio: ${sw.toFixed(2)} | Hip/Waist Ratio: ${hw.toFixed(2)} | Body Shape: ${type}`;
      },
    },
    'weight-watchers-points-calculator': {
      fields: [{ id: 'calories', label: 'Calories', placeholder: '300' }, { id: 'fat', label: 'Fat (g)', placeholder: '10' }, { id: 'fiber', label: 'Fiber (g)', placeholder: '5' }, { id: 'protein', label: 'Protein (g)', placeholder: '15' }],
      compute: (v) => {
        const points = Math.max(0, Math.round((v.calories / 50 + v.fat / 12 - v.fiber / 5)));
        const smartpoints = Math.max(0, Math.round((v.calories * 0.0305 + v.fat * 0.275 + v.protein * -0.21)));
        return `Old Points: ${points} | SmartPoints: ${smartpoints} | PointsPlus: ${Math.max(0, Math.round((v.fat * 0.036 + v.protein * 0.035 + v.fiber * -0.017)))}`;
      },
    },
    'binary-calculator': {
      fields: [{ id: 'decimal', label: 'Decimal Number', placeholder: '255' }],
      compute: (v) => {
        const n = Math.round(v.decimal);
        return `Decimal: ${n} | Binary: ${n.toString(2)} | Octal: ${n.toString(8)} | Hex: 0x${n.toString(16).toUpperCase()}`;
      },
    },
    'hex-calculator': {
      fields: [{ id: 'decimal', label: 'Decimal Number', placeholder: '255' }],
      compute: (v) => {
        const n = Math.round(v.decimal);
        return `Hex: 0x${n.toString(16).toUpperCase()} | Binary: ${n.toString(2)} | Octal: ${n.toString(8)} | Decimal: ${n}`;
      },
    },
    'big-number-calculator': {
      fields: [{ id: 'a', label: 'Number A', placeholder: '999999999' }, { id: 'b', label: 'Number B', placeholder: '888888888' }],
      compute: (v) => {
        const sum = v.a + v.b, diff = v.a - v.b, prod = v.a * v.b, quot = v.a / v.b;
        return `A+B = ${sum.toLocaleString()} | A-B = ${diff.toLocaleString()} | A×B = ${prod.toLocaleString()} | A÷B = ${quot.toFixed(6)}`;
      },
    },
    'matrix-calculator': {
      fields: [{ id: 'a', label: 'Matrix A [a,b;c,d] — Enter a', placeholder: '1' }, { id: 'b', label: 'b', placeholder: '2' }, { id: 'c', label: 'c', placeholder: '3' }, { id: 'd', label: 'd', placeholder: '4' }],
      compute: (v) => {
        const det = v.a * v.d - v.b * v.c;
        const trace = v.a + v.d;
        const inv = det !== 0 ? `[${(v.d/det).toFixed(2)}, ${(-v.b/det).toFixed(2)}; ${(-v.c/det).toFixed(2)}, ${(v.a/det).toFixed(2)}]` : 'Not invertible';
        return `Determinant: ${det} | Trace: ${trace} | Inverse: ${inv}`;
      },
    },
    'time-calculator': {
      fields: [{ id: 'h1', label: 'Time 1 – Hours', placeholder: '2' }, { id: 'm1', label: 'Time 1 – Minutes', placeholder: '30' }, { id: 'h2', label: 'Time 2 – Hours', placeholder: '1' }, { id: 'm2', label: 'Time 2 – Minutes', placeholder: '45' }],
      compute: (v) => {
        const total = (v.h1 + v.h2) * 60 + v.m1 + v.m2;
        const diff = Math.abs((v.h1 * 60 + v.m1) - (v.h2 * 60 + v.m2));
        return `Sum: ${Math.floor(total/60)}h ${total%60}m | Difference: ${Math.floor(diff/60)}h ${diff%60}m | Total minutes: ${total}`;
      },
    },
    'hours-calculator': {
      fields: [{ id: 'startH', label: 'Start Hour (0-23)', placeholder: '9' }, { id: 'startM', label: 'Start Minute', placeholder: '0' }, { id: 'endH', label: 'End Hour (0-23)', placeholder: '17' }, { id: 'endM', label: 'End Minute', placeholder: '0' }, { id: 'break', label: 'Break (minutes)', placeholder: '30' }, { id: 'rate', label: 'Hourly Rate ($)', placeholder: '25' }],
      compute: (v) => {
        let mins = (v.endH * 60 + v.endM) - (v.startH * 60 + v.startM) - v.break;
        if (mins < 0) mins += 24 * 60;
        const hrs = mins / 60;
        return `Hours: ${hrs.toFixed(2)} | Pay: $${(hrs * v.rate).toFixed(2)} | Weekly (5 days): ${(hrs*5).toFixed(2)}h = $${(hrs*5*v.rate).toFixed(2)}`;
      },
    },
    'construction-calculator': {
      fields: [{ id: 'length', label: 'Length (ft)', placeholder: '20' }, { id: 'width', label: 'Width (ft)', placeholder: '15' }, { id: 'height', label: 'Height (ft)', placeholder: '9' }],
      compute: (v) => {
        const area = v.length * v.width;
        const perimeter = 2 * (v.length + v.width);
        const volume = area * v.height;
        const wallArea = perimeter * v.height;
        return `Floor Area: ${area.toFixed(1)} sq ft | Perimeter: ${perimeter.toFixed(1)} ft | Volume: ${volume.toFixed(1)} cu ft | Wall Area: ${wallArea.toFixed(1)} sq ft`;
      },
    },
  };

  const config = configs[slug];
  const fields = config?.fields ?? [{ id: 'value1', label: 'Value 1', placeholder: '0' }, { id: 'value2', label: 'Value 2', placeholder: '0' }];

  const handleCalculate = () => {
    if (config) {
      const vals: Record<string, number> = {};
      for (const f of fields) { vals[f.id] = parseFloat(inputs[f.id] ?? '0') || 0; }
      try {
        const computed = config.compute(vals);
        if (!computed || /\b(NaN|Infinity|-Infinity)\b/.test(computed)) {
          setResult('Invalid input combination — please review values (for example, avoid division by zero).');
          return;
        }
        setResult(computed);
      } catch {
        setResult('Invalid input — please check your values.');
      }
    } else {
      setResult(`Calculation complete for ${name}. Enter values and calculate.`);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(f => (
          <div key={f.id}>
            <label htmlFor={`input-${slug}-${f.id}`} className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{f.label}</label>
            <input
              id={`input-${slug}-${f.id}`}
              type="number"
              value={inputs[f.id] ?? ''}
              onChange={e => setInputs(p => ({ ...p, [f.id]: e.target.value }))}
              placeholder={f.placeholder}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        ))}
      </div>
      <button onClick={handleCalculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate</button>
      {result && (
        <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded-xl p-5 text-center text-base font-semibold text-indigo-700 dark:text-indigo-300 leading-relaxed">
          {result}
        </div>
      )}
    </div>
  );
}

// ── main CalculatorEngine export ─────────────────────────────────────────────

interface CalculatorEngineProps {
  calc: Calculator;
}

// Per-calculator SEO content: how-to, formula, FAQ
const calcContent: Record<string, { howTo: string; formula?: string; faqs: { q: string; a: string }[]; sections?: { title: string; content: string }[] }> = {
  'age-calculator': {
    howTo: 'Enter your date of birth and optionally choose an "age as of" date (leave blank to use today). Click Calculate Age to see your exact age in years, months, and days, plus total weeks, days, and hours lived, your next birthday countdown, and the weekday you were born. Use the Compare mode to find the age difference between two people.',
    formula: 'Age = Reference Date − Date of Birth (calendar-accurate, accounting for leap years and varying month lengths).',
    faqs: [
      { q: 'How is age calculated accurately?', a: 'The calculator subtracts the birth date from the reference date, adjusting for different month lengths and leap years — not just dividing by 365.' },
      { q: 'What does "total hours lived" mean?', a: 'It multiplies total calendar days lived by 24 to give a rough total-hours figure (does not account for daylight saving time shifts).' },
      { q: 'Can I calculate age at a past or future date?', a: 'Yes — enter any date in the "Age As Of Date" field, including future dates, and the calculator will compute your age on that day.' },
    ],
  },
  'date-calculator': {
    howTo: 'Use the Date Difference tab to find how many days, weeks, months, and business days lie between two dates. Toggle "Include end date" to count inclusively. Switch to the Add / Subtract tab to add or remove years, months, weeks, or days from any starting date.',
    formula: 'Date difference = |End Date − Start Date| in milliseconds ÷ 86,400,000. Business days exclude Saturdays and Sundays.',
    faqs: [
      { q: 'What counts as a business day?', a: 'The calculator counts every weekday (Monday–Friday) between the two dates, excluding Saturdays and Sundays. It does not automatically exclude public holidays.' },
      { q: 'Does "include end date" matter?', a: 'Yes. For example, Jan 1 to Jan 3 is 2 days without the end date or 3 days with it included (counting both endpoints).' },
    ],
  },
  'volume-calculator': {
    howTo: 'Select the shape you want to evaluate and enter required dimensions. The calculator can estimate volume for common solids such as cubes, rectangular prisms, cylinders, and spheres. Use consistent units for all dimensions to keep output meaningful.',
    formula: 'Common formulas: Box = l*w*h, Cylinder = pi*r^2*h, Sphere = (4/3)*pi*r^3, Cone = (1/3)*pi*r^2*h.',
    faqs: [
      { q: 'What is volume?', a: 'Volume measures 3D space occupied by an object, expressed in cubic units such as cm^3, m^3, or ft^3.' },
      { q: 'Can I mix units like inches and feet?', a: 'Use one unit system per calculation. Convert dimensions first, then calculate to avoid incorrect results.' },
      { q: 'How do I find cylinder volume?', a: 'Multiply base area by height: pi*r^2*h.' },
      { q: 'How do I find sphere volume?', a: 'Use (4/3)*pi*r^3 where r is the radius.' },
      { q: 'What is the difference between area and volume?', a: 'Area is 2D surface size (square units), while volume is 3D capacity (cubic units).' },
      { q: 'Can this help with construction material planning?', a: 'Yes. Volume estimates are useful for concrete, soil, gravel, and storage capacity planning.' },
      { q: 'Why are my results too large?', a: 'Dimension unit mismatch and entering diameter as radius are common causes of overestimation.' },
      { q: 'Is pi rounded in calculations?', a: 'Yes, calculators use a numeric approximation of pi for practical computation.' },
      { q: 'How do I convert cubic feet to cubic meters?', a: 'Multiply cubic feet by 0.0283168 to get cubic meters.' },
      { q: 'Should I include waste factor for projects?', a: 'For real-world jobs, adding a safety margin for waste and tolerance is recommended.' },
    ],
    sections: [
      { title: 'Volume Fundamentals', content: 'Volume links geometric dimensions to real capacity, making it central in engineering, logistics, and construction decisions.' },
      { title: 'Shape Selection Matters', content: 'Accurate volume output depends on selecting the correct geometric model that matches the real object.' },
      { title: 'Unit Consistency Rule', content: 'Keep all inputs in a single unit system before calculation to prevent scale errors.' },
      { title: 'Applied Project Use', content: 'Volume estimates support procurement decisions, cost estimation, and transport capacity planning.' },
      { title: 'Validation Practices', content: 'Cross-check dimensions and run a quick rough estimate before relying on final numbers for purchasing.' },
    ],
  },
  'standard-deviation-calculator': {
    howTo: 'Enter your dataset values and calculate to measure dispersion around the mean. Use population mode when the dataset represents the full group, and sample mode when values represent a subset.',
    formula: 'Population SD: sigma = sqrt(sum((x-mu)^2)/N). Sample SD: s = sqrt(sum((x-xbar)^2)/(n-1)).',
    faqs: [
      { q: 'What does standard deviation measure?', a: 'It measures how spread out values are around their average. Higher SD indicates greater variability.' },
      { q: 'When should I use sample vs population SD?', a: 'Use population SD for complete datasets and sample SD for partial datasets used to infer a larger population.' },
      { q: 'Can standard deviation be zero?', a: 'Yes. If all values are identical, dispersion is zero.' },
      { q: 'How is SD different from variance?', a: 'Variance is squared dispersion; standard deviation is its square root and uses original data units.' },
      { q: 'Does SD show data quality?', a: 'SD shows spread, not correctness. Outliers, bias, and collection methods still matter.' },
      { q: 'Can I compare SD across different units?', a: 'Not directly. Use normalized metrics like coefficient of variation when scales differ.' },
      { q: 'Why is n-1 used for sample SD?', a: 'It applies Bessel correction to reduce bias when estimating population variance from a sample.' },
      { q: 'How do outliers affect SD?', a: 'Outliers can inflate SD significantly because squared deviations give large errors more weight.' },
      { q: 'Is SD enough for full analysis?', a: 'No. Combine with median, quartiles, distribution shape, and domain context.' },
      { q: 'Where is SD used in practice?', a: 'It is widely used in finance, quality control, A/B testing, forecasting, and scientific reporting.' },
    ],
    sections: [
      { title: 'Dispersion as Decision Signal', content: 'Standard deviation quantifies consistency and uncertainty, helping evaluate reliability of averages.' },
      { title: 'Sample vs Population Choice', content: 'Selecting the correct formula is essential for statistically valid interpretation.' },
      { title: 'Outlier Sensitivity', content: 'Because deviations are squared, extreme values can dominate SD and should be reviewed carefully.' },
      { title: 'Interpreting Magnitude', content: 'SD should be interpreted relative to data scale, mean level, and practical domain thresholds.' },
      { title: 'Complementary Statistics', content: 'Pair SD with median, IQR, and visual plots for a more complete understanding of data behavior.' },
    ],
  },
  'random-number-generator': {
    howTo: 'Set minimum and maximum bounds, choose quantity, and generate random values for simulations, sampling, testing, or games. Optional uniqueness constraints can prevent duplicate results in a set.',
    formula: 'Uniform integer generation often uses: value = floor(random() * (max - min + 1)) + min.',
    faqs: [
      { q: 'Are generated numbers truly random?', a: 'Most web tools use pseudorandom algorithms, which are suitable for general use but not cryptographic security.' },
      { q: 'Can I avoid duplicate values?', a: 'Yes, if unique mode is supported and requested count does not exceed available range size.' },
      { q: 'How do I generate numbers between 1 and 100?', a: 'Set minimum to 1 and maximum to 100, then choose how many values you need.' },
      { q: 'What is a random seed?', a: 'A seed initializes the random sequence. Same seed produces repeatable sequences in deterministic generators.' },
      { q: 'Is this suitable for passwords?', a: 'Use dedicated cryptographic password generators for security-sensitive use cases.' },
      { q: 'Can random generators support simulations?', a: 'Yes. They are commonly used for Monte Carlo analysis and test-case generation.' },
      { q: 'Why do repeats happen?', a: 'Uniform random selection allows repeats unless uniqueness is explicitly enforced.' },
      { q: 'Can I generate decimal random values?', a: 'Many tools support decimal mode by specifying precision and range.' },
      { q: 'How do I verify fairness?', a: 'Large sample distributions should appear approximately uniform across the allowed range.' },
      { q: 'When do I need cryptographic randomness?', a: 'Use cryptographic randomness for security tokens, authentication, and sensitive key generation.' },
    ],
    sections: [
      { title: 'Randomness Use Cases', content: 'Random values power testing, simulation, gaming, educational sampling, and experimental design workflows.' },
      { title: 'Uniform Range Behavior', content: 'Correct range configuration ensures each valid value has comparable chance of selection.' },
      { title: 'Uniqueness Constraints', content: 'Sampling without replacement is useful for lotteries, assignments, and non-repeating selection tasks.' },
      { title: 'Deterministic Reproducibility', content: 'Seeded random workflows enable reproducible experiments and debugging in technical systems.' },
      { title: 'Security Boundary', content: 'General RNGs are convenient but should not replace cryptographic randomness for secure operations.' },
    ],
  },
  'time-calculator': {
    howTo: 'Enter two time values to compute total duration and difference. Use hour and minute fields for quick time arithmetic such as planning schedules, comparing tasks, and estimating elapsed time.',
    formula: 'Total minutes = (h1*60 + m1) + (h2*60 + m2). Difference minutes = abs((h1*60 + m1) - (h2*60 + m2)).',
    faqs: [
      { q: 'What can a time calculator do?', a: 'It can add times, subtract times, and convert duration results into hours and minutes.' },
      { q: 'Can I use this for schedule planning?', a: 'Yes. It is useful for work blocks, travel plans, and activity timing comparisons.' },
      { q: 'How is difference between two times computed?', a: 'Both times are converted to minutes first, then absolute difference is calculated and reformatted.' },
      { q: 'What if minutes exceed 59?', a: 'Minutes are normalized through total-minute conversion, then displayed as hours plus remaining minutes.' },
      { q: 'Can it handle midnight crossover?', a: 'Basic difference mode may require dedicated day-boundary context; use advanced duration tools for multi-day spans.' },
      { q: 'Is this the same as a timezone calculator?', a: 'No. This tool handles arithmetic on durations, not geographic timezone conversions.' },
      { q: 'Can I add more than two durations?', a: 'Yes, by chaining calculations or using total-minute aggregation workflows.' },
      { q: 'Why is total minutes shown?', a: 'Minute totals simplify downstream calculations such as payroll, scheduling, and optimization tasks.' },
      { q: 'How accurate is it for payroll?', a: 'It is useful for estimates; payroll rules may include rounding policies and compliance constraints.' },
      { q: 'What is best practice for reliability?', a: 'Use consistent 24-hour input style and verify boundary cases like midnight and break deductions.' },
    ],
    sections: [
      { title: 'Time Arithmetic Basics', content: 'Converting inputs to minutes first creates a robust base for addition and subtraction operations.' },
      { title: 'Planning and Productivity', content: 'Duration calculations improve workload planning and reduce manual scheduling errors.' },
      { title: 'Normalization Approach', content: 'Reformatting total minutes back to hours and minutes keeps output human-readable and actionable.' },
      { title: 'Operational Use Cases', content: 'Teams use time calculations for staffing, shift design, task estimation, and progress tracking.' },
      { title: 'Edge Case Awareness', content: 'Midnight crossover, break policies, and timezone effects should be considered in advanced scenarios.' },
    ],
  },
  'hours-calculator': {
    howTo: 'Enter shift start and end times, break duration, and hourly rate. The calculator estimates paid hours, daily pay, and weekly projection for quick payroll planning.',
    formula: 'Worked minutes = (end - start) - break. If negative, add 24*60 for overnight shifts. Hours = worked minutes / 60. Pay = Hours * Rate.',
    faqs: [
      { q: 'What is an hours calculator used for?', a: 'It estimates worked hours and pay from shift timing and break deductions.' },
      { q: 'Can it handle overnight shifts?', a: 'Yes. Overnight adjustment is done by adding one day when end time is earlier than start time.' },
      { q: 'How is break time applied?', a: 'Break minutes are subtracted from gross shift minutes before calculating paid time.' },
      { q: 'Can I estimate weekly pay?', a: 'Yes. Daily hours and pay can be projected across workdays for rough weekly totals.' },
      { q: 'Does this include overtime rules?', a: 'Not by default. Overtime thresholds vary by region and contract.' },
      { q: 'What if my employer rounds time?', a: 'Payroll systems may round clock times differently, which can create small differences from manual estimates.' },
      { q: 'Can I use decimal hourly rates?', a: 'Yes. Decimal rates are supported and reflected in pay output.' },
      { q: 'How do I reduce entry mistakes?', a: 'Use 24-hour format and verify start/end fields before finalizing calculations.' },
      { q: 'Is this valid for invoicing freelance work?', a: 'Yes for basic billing estimation, though invoicing policies may require additional detail.' },
      { q: 'When should I use payroll software instead?', a: 'Use dedicated payroll systems for compliance, tax withholding, overtime laws, and audited reporting.' },
    ],
    sections: [
      { title: 'Shift Calculation Workflow', content: 'Converting times to minutes and subtracting breaks provides a transparent method for paid-hour computation.' },
      { title: 'Overnight Shift Handling', content: 'Cross-midnight logic prevents negative duration errors and improves real-world shift accuracy.' },
      { title: 'Compensation Estimation', content: 'Combining worked hours with rate helps forecast earnings before formal payroll processing.' },
      { title: 'Operational Planning', content: 'Hours estimates support staffing plans, budget checks, and weekly workload balancing.' },
      { title: 'Compliance Considerations', content: 'For legal payroll outcomes, align outputs with regional labor rules, overtime policies, and employer systems.' },
    ],
  },
  'gpa-calculator': {
    howTo: 'Enter each course grade and credit hours, then calculate cumulative GPA. Include all completed terms for overall GPA or a subset to estimate semester GPA.',
    formula: 'GPA = sum(grade points * course credits) / sum(course credits).',
    faqs: [
      { q: 'What is GPA?', a: 'GPA (Grade Point Average) summarizes academic performance by weighting grades with course credits.' },
      { q: 'How are grades converted to points?', a: 'Schools use grade-to-point scales (for example A=4.0). Always follow your institution scale.' },
      { q: 'Do credit hours matter?', a: 'Yes. Higher-credit courses contribute more to GPA than lower-credit courses.' },
      { q: 'What is cumulative vs semester GPA?', a: 'Semester GPA covers one term; cumulative GPA includes all completed terms.' },
      { q: 'Can repeated courses affect GPA?', a: 'Yes. Policies differ by institution (replacement, averaging, or both attempts counted).' },
      { q: 'How can I raise my GPA?', a: 'Improving grades in higher-credit courses usually has the strongest impact.' },
      { q: 'Does pass/fail count in GPA?', a: 'Often no, but rules vary by institution and transcript policy.' },
      { q: 'Can this estimate target GPA goals?', a: 'Yes. You can test scenarios using expected grades and planned credits.' },
      { q: 'Why does my calculated GPA differ from school portal?', a: 'Differences usually come from grade scale, repeated-course policy, or excluded coursework categories.' },
      { q: 'Should I round GPA each course or at end?', a: 'Best practice is rounding at final aggregate step unless institution rules specify otherwise.' },
    ],
    sections: [
      { title: 'Credit-Weighted Framework', content: 'GPA is a weighted average, so course credit distribution strongly influences final outcomes.' },
      { title: 'Planning Academic Targets', content: 'Scenario modeling helps determine what grades are needed to reach scholarship or progression thresholds.' },
      { title: 'Policy Variability', content: 'Institution-specific grade scales and repeat rules can materially change computed GPA.' },
      { title: 'Trend Monitoring', content: 'Tracking term-by-term GPA trends helps identify academic momentum and intervention timing.' },
      { title: 'Decision Use Cases', content: 'GPA estimates support advising discussions, transfer planning, and eligibility review workflows.' },
    ],
  },
  'grade-calculator': {
    howTo: 'Enter assignment, quiz, exam, and project scores with weights to calculate current grade and required final exam score scenarios.',
    formula: 'Weighted Grade = sum(component score * component weight). Required final score solves for unknown in weighted-average equation.',
    faqs: [
      { q: 'What is a weighted grade?', a: 'A weighted grade assigns different importance to each assessment category (for example exams 40%, homework 20%).' },
      { q: 'How do I find required final exam score?', a: 'Set target overall grade, plug known components, and solve for final exam contribution.' },
      { q: 'Do all weights need to total 100?', a: 'Yes. If weights do not sum to 100%, output may be inaccurate unless normalized.' },
      { q: 'Can extra credit be included?', a: 'Yes, if treated as additional points or weighted adjustments per course policy.' },
      { q: 'Why is my grade lower than expected?', a: 'Common reasons include high-weight low scores, missing assignments, or incorrect category weights.' },
      { q: 'Can this help prioritize study effort?', a: 'Yes. Focusing on high-weight categories usually improves grade outcomes most efficiently.' },
      { q: 'What if grading scheme changes mid-term?', a: 'Update weights and recalculate to reflect latest syllabus rules.' },
      { q: 'Should percentage and points systems be mixed?', a: 'Only if converted consistently into one weighted framework.' },
      { q: 'Can this be used for pass/fail forecasting?', a: 'Yes. Set pass threshold and test required upcoming performance.' },
      { q: 'How often should I update grade tracking?', a: 'Update after each major assessment for accurate trajectory monitoring.' },
    ],
    sections: [
      { title: 'Weighted Assessment Logic', content: 'Weighted grading emphasizes major evaluations, so understanding component impact is essential.' },
      { title: 'Final Exam Scenario Planning', content: 'Required-score modeling helps set realistic preparation targets before high-stakes assessments.' },
      { title: 'Priority-Based Study Strategy', content: 'Grade calculators reveal where effort yields highest marginal improvement.' },
      { title: 'Policy Alignment', content: 'Always align calculator setup with current syllabus definitions and instructor rules.' },
      { title: 'Progress Visibility', content: 'Frequent recalculation reduces surprises and supports timely academic decisions.' },
    ],
  },
  'height-calculator': {
    howTo: 'Enter height in your preferred unit (feet/inches, centimeters, or meters) to convert across common formats and compare standardized representations.',
    formula: 'Key conversions: 1 inch = 2.54 cm, 1 foot = 12 inches, 1 meter = 100 cm.',
    faqs: [
      { q: 'How do I convert feet and inches to centimeters?', a: 'First convert total inches, then multiply by 2.54 to get centimeters.' },
      { q: 'How do I convert centimeters to feet and inches?', a: 'Divide centimeters by 2.54 for inches, then split into feet and remaining inches.' },
      { q: 'Can this help with medical forms?', a: 'Yes. It is useful when forms require a different unit than your usual system.' },
      { q: 'Why are rounding differences common?', a: 'Conversions may round at different steps, causing minor output differences.' },
      { q: 'What is the best precision level?', a: 'For everyday use, one decimal in cm or nearest quarter inch is often sufficient.' },
      { q: 'Can I use this for child growth tracking?', a: 'Yes, with consistent measurement technique and regular intervals.' },
      { q: 'Does posture affect measured height?', a: 'Yes. Measurement time, posture, and footwear can affect observed value.' },
      { q: 'Should I measure morning or evening?', a: 'Height can vary slightly during the day; consistent timing improves comparability.' },
      { q: 'Is meter input supported?', a: 'Yes, meter values can be converted to cm and imperial formats.' },
      { q: 'Can this integrate with BMI tools?', a: 'Yes. Accurate height conversion improves BMI and related health metric calculations.' },
    ],
    sections: [
      { title: 'Unit Conversion Essentials', content: 'Consistent conversion formulas ensure reliable cross-system height reporting.' },
      { title: 'Measurement Consistency', content: 'Standardized measurement conditions reduce noise in trend tracking and documentation.' },
      { title: 'Health and Fitness Context', content: 'Height accuracy supports better outputs for BMI and body-composition-related tools.' },
      { title: 'Form and Documentation Utility', content: 'Conversion tools simplify international forms, records, and profile standardization.' },
      { title: 'Precision Management', content: 'Choose practical rounding based on use case: clinical, athletic, or general-reference contexts.' },
    ],
  },
  'concrete-calculator': {
    howTo: 'Enter slab, footing, or column dimensions to estimate concrete volume and material requirement. Choose consistent units and include project overage margin for waste.',
    formula: 'Volume = length * width * depth (or shape-specific equivalent). Convert cubic volume to cubic yards when needed.',
    faqs: [
      { q: 'How is concrete volume calculated?', a: 'For rectangular slabs, multiply length by width by depth, then convert to your required unit.' },
      { q: 'How do I convert cubic feet to cubic yards?', a: 'Divide cubic feet by 27 to get cubic yards.' },
      { q: 'Should I add extra concrete?', a: 'Yes. A waste/overage margin is typically added for form variation, spillage, and uneven grade.' },
      { q: 'Can this be used for footings and columns?', a: 'Yes, if dimensions are entered with correct geometric formula and unit consistency.' },
      { q: 'Does reinforcement change volume?', a: 'Rebar does not usually change gross concrete volume materially for basic estimation.' },
      { q: 'Why is delivered volume different from estimate?', a: 'Site conditions, form tolerances, and subgrade variation can increase actual demand.' },
      { q: 'Can this help cost estimation?', a: 'Yes. Multiply required volume by local ready-mix price and add labor/finishing allowances.' },
      { q: 'What depth mistakes are common?', a: 'Entering inches as feet (or vice versa) is a frequent cause of large overestimation.' },
      { q: 'Do I need different formulas for circular pours?', a: 'Yes. Circular areas use pi*r^2 for area before multiplying by depth.' },
      { q: 'Is this enough for structural design?', a: 'No. Structural design requires engineering review beyond volume estimation.' },
    ],
    sections: [
      { title: 'Volume-First Estimation', content: 'Concrete planning starts with accurate geometric volume under consistent units.' },
      { title: 'Unit Conversion Discipline', content: 'Most ordering errors come from incorrect depth or conversion assumptions.' },
      { title: 'Procurement Planning', content: 'Including overage and staging constraints improves delivery efficiency and reduces downtime.' },
      { title: 'Cost and Logistics Link', content: 'Volume estimates feed directly into budgeting, truck scheduling, and workforce planning.' },
      { title: 'Field Validation', content: 'Always verify forms and subgrade conditions before final order confirmation.' },
    ],
  },
  'ip-subnet-calculator': {
    howTo: 'Enter an IPv4 address and CIDR prefix to calculate subnet mask, network address, broadcast address, usable host range, and host capacity.',
    formula: 'Hosts per subnet (IPv4) = 2^(32-prefix) - 2 for most conventional subnets; network and broadcast consume two addresses.',
    faqs: [
      { q: 'What is CIDR?', a: 'CIDR expresses subnet size using prefix length, such as /24, indicating how many bits are network bits.' },
      { q: 'How do I find usable host count?', a: 'For most IPv4 subnets, usable hosts are total addresses minus network and broadcast addresses.' },
      { q: 'What is a subnet mask?', a: 'A subnet mask marks network vs host bits in dotted decimal form (for example /24 = 255.255.255.0).' },
      { q: 'What is broadcast address?', a: 'It is the highest address in a subnet, used to reach all hosts in that subnet.' },
      { q: 'Why are /31 and /32 special?', a: 'These prefixes have special routing/use cases and may not follow standard usable-host assumptions.' },
      { q: 'Can this help with VLSM planning?', a: 'Yes. It supports subnet sizing decisions for variable-length subnet masks.' },
      { q: 'How do I avoid IP overlap?', a: 'Plan contiguous address blocks and verify network boundaries for each subnet.' },
      { q: 'Is this for IPv4 only?', a: 'Most basic subnet calculators focus on IPv4; IPv6 uses different addressing scale and conventions.' },
      { q: 'Can I use this for firewall rules?', a: 'Yes. Subnet outputs are useful when defining network objects and policy scopes.' },
      { q: 'What is default gateway in subnet context?', a: 'It is typically a designated usable host address in the subnet used for routing traffic outside the local segment.' },
    ],
    sections: [
      { title: 'Subnetting Fundamentals', content: 'Subnetting divides larger networks into smaller segments for control, security, and efficient address allocation.' },
      { title: 'Capacity Planning', content: 'Prefix selection balances host capacity, growth room, and routing simplicity.' },
      { title: 'Operational Accuracy', content: 'Correct network, broadcast, and host-range calculations reduce deployment and troubleshooting errors.' },
      { title: 'Security and Segmentation', content: 'Subnet boundaries support isolation strategies and cleaner policy enforcement.' },
      { title: 'Network Design Workflow', content: 'Use subnet calculators early during design, then validate with route and ACL planning before production rollout.' },
    ],
  },
  'house-affordability-calculator': {
    howTo: 'Enter household income, down payment, loan term, interest rate, property tax, insurance, and debt obligations. The calculator estimates an affordable home price range and monthly housing payment under common debt-to-income assumptions.',
    formula: 'Affordable payment is constrained by debt-to-income targets. Approximate loan amount is solved from mortgage payment formula, then adjusted by down payment to estimate purchase price.',
    faqs: [
      { q: 'What is house affordability?', a: 'It estimates how much home you can reasonably buy based on income, debt, rates, and recurring ownership costs.' },
      { q: 'Why does debt-to-income ratio matter?', a: 'Lenders use DTI to assess repayment capacity. Higher existing debt usually lowers affordable home price.' },
      { q: 'Does affordability equal lender approval amount?', a: 'Not always. Personal budget comfort and lender underwriting criteria can differ.' },
      { q: 'Should I include property tax and insurance?', a: 'Yes. True monthly housing cost includes principal, interest, taxes, insurance, and often HOA fees.' },
      { q: 'How does down payment affect affordability?', a: 'A larger down payment reduces loan size, payment burden, and potentially mortgage insurance costs.' },
      { q: 'What interest rate should I use?', a: 'Use realistic market rates and test higher-rate scenarios for risk awareness.' },
      { q: 'Can this include HOA dues?', a: 'Yes, recurring fees should be included for accurate monthly affordability estimates.' },
      { q: 'Is 28/36 rule mandatory?', a: 'It is a guideline, not a universal rule. Program-specific underwriting can vary.' },
      { q: 'How much emergency reserve is recommended?', a: 'Many planners suggest maintaining reserves for repairs, vacancies, or income shocks after purchase.' },
      { q: 'Can affordability change quickly?', a: 'Yes. Rate changes, income shifts, and debt changes can materially alter affordability in short time.' },
    ],
    sections: [
      { title: 'Income-to-Payment Framework', content: 'Affordability begins with sustainable monthly payment capacity, not maximum headline loan size.' },
      { title: 'Ownership Cost Completeness', content: 'Including taxes, insurance, HOA, and maintenance improves realism versus principal-interest-only estimates.' },
      { title: 'Rate Sensitivity', content: 'Small rate moves can cause large affordability swings, so stress testing is essential.' },
      { title: 'Risk-Adjusted Buying Decision', content: 'Affordability should preserve cash flow for savings, emergencies, and lifestyle stability.' },
      { title: 'Pre-Approval Preparation', content: 'Improving credit, reducing debt, and saving larger down payment typically expands favorable options.' },
    ],
  },
  'savings-calculator': {
    howTo: 'Enter starting balance, regular contribution amount, expected annual return, compounding frequency, and timeline. Calculate to project future value, total contributions, and interest earned.',
    formula: 'Future value with recurring deposits: FV = P(1+r/n)^(nt) + PMT * [((1+r/n)^(nt)-1)/(r/n)].',
    faqs: [
      { q: 'What does a savings calculator estimate?', a: 'It estimates growth of current savings plus recurring deposits over time at an assumed return rate.' },
      { q: 'How do contributions affect outcome?', a: 'Consistent contributions often drive a large share of ending balance, especially early in the plan.' },
      { q: 'Why does compounding frequency matter?', a: 'More frequent compounding slightly increases effective growth at the same nominal rate.' },
      { q: 'Should I use nominal or real return?', a: 'Use both scenarios. Real-return assumptions account for inflation and are better for purchasing-power planning.' },
      { q: 'Can I model irregular contributions?', a: 'Base calculators assume regular contributions; irregular deposits can be approximated by scenario testing.' },
      { q: 'How can I set a target savings date?', a: 'Run scenarios by adjusting monthly contributions and expected return until target amount and date align.' },
      { q: 'What is the impact of starting earlier?', a: 'Time amplifies compounding; earlier starts usually outperform higher late contributions.' },
      { q: 'Should emergency fund be separate?', a: 'Yes. Keep short-term emergency liquidity separate from long-term growth assumptions.' },
      { q: 'Can this include taxes and fees?', a: 'Not always directly; adjust assumed return downward to reflect expected drag.' },
      { q: 'How often should I revisit savings assumptions?', a: 'Review periodically as income, goals, market conditions, and inflation expectations change.' },
    ],
    sections: [
      { title: 'Compound Growth Mechanics', content: 'Savings growth combines principal accumulation and reinvested earnings over time.' },
      { title: 'Contribution Discipline', content: 'Automated recurring deposits create consistency and reduce behavioral friction.' },
      { title: 'Goal-Based Forecasting', content: 'Scenario modeling helps align savings behavior with timeline-based financial goals.' },
      { title: 'Inflation Awareness', content: 'Nominal balances can overstate real progress if inflation is ignored.' },
      { title: 'Adaptive Planning', content: 'Periodic recalibration improves plan reliability under changing financial conditions.' },
    ],
  },
  'conversion-calculator': {
    howTo: 'Choose source and target units, enter a value, and calculate instant conversions for length, weight, volume, temperature, and other common categories.',
    formula: 'Converted value = input value * unit conversion factor (or category-specific transform such as temperature equations).',
    faqs: [
      { q: 'What does a conversion calculator do?', a: 'It transforms values between unit systems such as metric and imperial for consistent interpretation.' },
      { q: 'Can I convert temperature and distance in same mode?', a: 'Usually categories are handled separately because conversion logic differs by measurement type.' },
      { q: 'Why do some conversions need formulas instead of factors?', a: 'Temperature conversions require offset adjustments (for example C to F), not only scaling factors.' },
      { q: 'How accurate are conversion outputs?', a: 'Accuracy depends on precision of factors and rounding settings used in the calculator.' },
      { q: 'When should I keep extra decimal places?', a: 'Engineering, lab, and financial workflows often require more precision than everyday usage.' },
      { q: 'Can conversion rounding cause discrepancies?', a: 'Yes. Different rounding stages can produce small visible differences.' },
      { q: 'Is this useful for travel and shopping?', a: 'Yes. It helps interpret foreign units for speed, fuel, weight, and size comparisons.' },
      { q: 'How do I verify critical conversions?', a: 'Cross-check with trusted references and retain higher precision for safety-critical work.' },
      { q: 'Can I convert very large and very small values?', a: 'Yes, but scientific notation may be useful for readability.' },
      { q: 'What is best practice for reporting converted values?', a: 'Report value, unit, and rounding precision together for clear communication.' },
    ],
    sections: [
      { title: 'Unit Normalization', content: 'Conversion tools create consistent units across mixed data sources and workflows.' },
      { title: 'Category-Specific Logic', content: 'Some categories use simple factors while others use affine transforms and specialized formulas.' },
      { title: 'Precision Strategy', content: 'Retaining sufficient precision during conversion reduces downstream calculation error.' },
      { title: 'Operational Use Cases', content: 'Conversions are central in engineering, logistics, healthcare, education, and international commerce.' },
      { title: 'Verification Habits', content: 'Critical decisions should use validated factors and independent checks to avoid unit mistakes.' },
    ],
  },
  'bra-size-calculator': {
    howTo: 'Enter underbust and bust measurements using a flexible measuring tape. The calculator estimates a starting bra size by combining band size and cup-size difference.',
    formula: 'Band size is estimated from underbust measurement; cup size is derived from bust-underbust difference using sizing tables.',
    faqs: [
      { q: 'How is bra size estimated?', a: 'It combines estimated band size from ribcage measurement and cup index from bust-to-underbust difference.' },
      { q: 'Why does size vary by brand?', a: 'Brand grading, shape assumptions, and manufacturing tolerances differ across brands and lines.' },
      { q: 'What is sister sizing?', a: 'Sister sizes keep similar cup volume while changing band size, such as 34C and 36B.' },
      { q: 'Should I measure with or without bra?', a: 'Measurement method depends on tool guidance, but consistency and proper tape position are key.' },
      { q: 'Can body changes affect fit quickly?', a: 'Yes. Weight changes, hormonal cycles, and life stages can alter fit requirements.' },
      { q: 'Why is the calculated size only a starting point?', a: 'Fit depends on breast shape, strap design, and cup construction beyond numeric size.' },
      { q: 'How often should I remeasure?', a: 'Periodic remeasurement is helpful, especially after noticeable body or wardrobe changes.' },
      { q: 'Does this work for sports bras?', a: 'Sports-bra fitting often uses additional support and compression preferences beyond standard sizing.' },
      { q: 'Can this replace professional fitting?', a: 'No. Professional fitting can refine comfort and support with style-specific adjustments.' },
      { q: 'What are common measurement mistakes?', a: 'Loose tape, incorrect level placement, and inconsistent breathing posture are frequent errors.' },
    ],
    sections: [
      { title: 'Band and Cup Framework', content: 'Bra sizing combines horizontal band support with cup-volume estimation from measurement differences.' },
      { title: 'Fit Beyond Numbers', content: 'True comfort depends on strap tension, wire shape, cup depth, and movement support.' },
      { title: 'Brand Variability', content: 'Equivalent labels can fit differently across brands due to pattern and material differences.' },
      { title: 'Reassessment Timing', content: 'Regular fit checks help maintain comfort and support as body measurements evolve.' },
      { title: 'Practical Fitting Workflow', content: 'Use calculator estimate as baseline, then test nearby sizes and sister sizes for best real fit.' },
    ],
  },
  'password-generator': {
    howTo: 'Choose password length and character sets (uppercase, lowercase, numbers, symbols), then generate secure random passwords for accounts and applications.',
    formula: 'Password strength is related to entropy, approximated by log2(character set size ^ length).',
    faqs: [
      { q: 'What makes a password strong?', a: 'Long length plus diverse character set and randomness generally produce stronger passwords.' },
      { q: 'How long should passwords be?', a: 'Longer is better. Many security recommendations favor at least 12-16 characters for strong protection.' },
      { q: 'Should I use symbols?', a: 'Yes, when allowed. Expanded character set improves entropy.' },
      { q: 'Can I reuse generated passwords?', a: 'No. Use unique passwords per account to limit breach impact.' },
      { q: 'Are generated passwords safe to store in browser notes?', a: 'Use a reputable password manager for secure storage and retrieval.' },
      { q: 'What is entropy in password context?', a: 'Entropy estimates unpredictability; higher entropy generally means harder brute-force cracking.' },
      { q: 'Should I rotate passwords regularly?', a: 'Rotate when compromised or policy requires; prioritize uniqueness and breach monitoring.' },
      { q: 'Are passphrases better?', a: 'Long, random passphrases can be both secure and easier to remember than short complex strings.' },
      { q: 'Can this generate API secrets?', a: 'For sensitive keys, use cryptographically secure generators and platform-specific secret tooling.' },
      { q: 'What else improves account security?', a: 'Enable multi-factor authentication and monitor breach alerts in addition to strong passwords.' },
    ],
    sections: [
      { title: 'Entropy-Centered Security', content: 'Password resilience grows with randomness and length, reducing brute-force feasibility.' },
      { title: 'Uniqueness Strategy', content: 'Unique credentials per service contain risk when one provider is compromised.' },
      { title: 'Storage Discipline', content: 'Password managers improve security and usability by reducing unsafe reuse behavior.' },
      { title: 'Operational Hardening', content: 'Strong passwords should be paired with MFA and account recovery hygiene.' },
      { title: 'Security Scope Awareness', content: 'For high-sensitivity systems, use cryptographic secret-management workflows beyond basic generators.' },
    ],
  },
  'dice-roller': {
    howTo: 'Choose number of dice and sides per die, then roll to get random outcomes. Use it for board games, probability exercises, and simulation scenarios.',
    formula: 'For fair dice, each face has probability 1/sides. Sum distributions follow discrete convolution across rolled dice.',
    faqs: [
      { q: 'How does a dice roller work?', a: 'It generates random integers within the die face range for each die rolled.' },
      { q: 'Can I roll multiple dice at once?', a: 'Yes. Most dice rollers support multiple dice and total-sum output.' },
      { q: 'Is the distribution fair?', a: 'If the random generator is unbiased, each face should be approximately equally likely over many rolls.' },
      { q: 'Why do repeated numbers occur?', a: 'Random processes naturally include streaks and repeats, especially in small sample sizes.' },
      { q: 'Can this be used for RPG notation like 2d6?', a: 'Yes. Dice rollers commonly support notation where NdS means N dice with S sides.' },
      { q: 'How do probabilities change with more dice?', a: 'Totals become less uniform and more centered around mean values as dice count increases.' },
      { q: 'Can I test custom game mechanics?', a: 'Yes. Multiple-roll mode helps explore expected outcomes and balancing effects.' },
      { q: 'Is this suitable for classroom probability demos?', a: 'Yes. It provides fast repeated trials for empirical probability teaching.' },
      { q: 'Can I log roll history?', a: 'Many implementations support history to verify sequences and analyze trends.' },
      { q: 'What if I need cryptographic randomness?', a: 'Use cryptographic RNG tools for security-sensitive randomness requirements.' },
    ],
    sections: [
      { title: 'Random Outcome Modeling', content: 'Dice rolling demonstrates discrete randomness and probability behavior in a simple form.' },
      { title: 'Game Design Utility', content: 'Roll simulations help calibrate balance, difficulty curves, and expected outcome spread.' },
      { title: 'Probability Education', content: 'Repeated digital trials illustrate law of large numbers and distribution convergence.' },
      { title: 'Notation and Flexibility', content: 'Support for multi-dice notation improves workflow for tabletop and rule-heavy systems.' },
      { title: 'Fairness Expectations', content: 'Short streaks can look biased, but long-run frequency should approach uniform probabilities.' },
    ],
  },
  'rent-calculator': {
    howTo: 'Enter monthly rent, renter insurance, utilities, and optional annual increase assumptions to estimate total housing spend over time.',
    formula: 'Total rent over period = sum(monthly rent per month). With escalation, rent evolves by annual increase factor.',
    faqs: [
      { q: 'What does a rent calculator estimate?', a: 'It estimates monthly and long-term renting costs including recurring housing-related expenses.' },
      { q: 'Should utilities be included?', a: 'Yes. Utilities and renter insurance improve realism versus base rent-only comparisons.' },
      { q: 'How do annual increases affect total cost?', a: 'Even small annual rent increases can significantly raise multi-year housing expenses.' },
      { q: 'Can this compare rent vs buy?', a: 'It can support one side of analysis; compare against ownership costs for full decision context.' },
      { q: 'What if lease has concessions?', a: 'Adjust effective monthly rent by spreading concessions across lease duration.' },
      { q: 'Should I include moving costs?', a: 'For long-term planning, include deposits, moving, and setup costs as separate line items.' },
      { q: 'How often should rent assumptions be updated?', a: 'Revisit assumptions at renewal periods or when local market conditions shift.' },
      { q: 'Can this include roommates?', a: 'Yes, divide shared costs by occupant count after applying total monthly housing expense.' },
      { q: 'Why does rent burden ratio matter?', a: 'It helps evaluate affordability and cash-flow resilience under income changes.' },
      { q: 'Is lower rent always better?', a: 'Not always; commute time, safety, and quality-of-life factors can justify higher rent in some cases.' },
    ],
    sections: [
      { title: 'Total Housing Cost View', content: 'Rent decisions should include all recurring costs, not only advertised monthly base rent.' },
      { title: 'Escalation Sensitivity', content: 'Projected annual increases reveal long-term affordability risk in tight rental markets.' },
      { title: 'Cash-Flow Planning', content: 'Rent budgeting should preserve emergency capacity and savings consistency.' },
      { title: 'Scenario Comparison', content: 'Testing multiple rent paths improves negotiation and relocation decision quality.' },
      { title: 'Lifestyle Trade-Offs', content: 'Cost should be balanced with commute, access, safety, and household priorities.' },
    ],
  },
  'marriage-tax-calculator': {
    howTo: 'Enter incomes, filing assumptions, and tax rates to compare potential tax outcomes for marriage scenarios versus separate-filing style estimates.',
    formula: 'Estimated tax is computed under selected assumptions and compared across filing scenarios to identify marriage bonus or penalty tendency.',
    faqs: [
      { q: 'What is marriage tax penalty?', a: 'It occurs when combined filing leads to higher total tax than two separate comparable filings under specific structures.' },
      { q: 'What is marriage tax bonus?', a: 'It occurs when combined filing reduces total tax relative to separate filings.' },
      { q: 'Why do outcomes vary widely?', a: 'Income distribution, deductions, credits, and bracket interactions all influence final result.' },
      { q: 'Can this replace professional tax advice?', a: 'No. It is a planning estimate and cannot capture all jurisdiction-specific rules.' },
      { q: 'Should I include non-wage income?', a: 'Yes. Include all relevant taxable income sources for meaningful comparison.' },
      { q: 'Do state taxes matter?', a: 'Yes. State tax rules can materially change marriage-related tax impact.' },
      { q: 'How often should scenarios be updated?', a: 'Update after salary changes, relocation, policy updates, or major deduction changes.' },
      { q: 'Can this inform withholding setup?', a: 'It can guide planning, but payroll withholding should be finalized with official forms and guidance.' },
      { q: 'Are credits handled fully?', a: 'Simplified calculators often approximate credits; complete return-level tools are needed for precision.' },
      { q: 'What is the best use of this tool?', a: 'Use it for scenario awareness and budgeting, then validate with detailed tax preparation.' },
    ],
    sections: [
      { title: 'Filing Scenario Comparison', content: 'Side-by-side filing simulations reveal directional impact of marriage on tax outcomes.' },
      { title: 'Income Distribution Effects', content: 'Relative earnings between partners strongly influences whether bonus or penalty appears.' },
      { title: 'Planning Applications', content: 'Outputs can support household budgeting, withholding tuning, and annual tax readiness.' },
      { title: 'Policy and Jurisdiction Sensitivity', content: 'Rule differences across years and states can materially alter expected outcomes.' },
      { title: 'Validation Workflow', content: 'Use this as pre-planning, then confirm with authoritative tax software or licensed professionals.' },
    ],
  },
  'marriage-calculator': {
    howTo: 'Use this calculator to estimate potential marriage-related tax effect by entering both partners\' taxable income and assumptions.',
    formula: 'Uses comparative filing assumptions to estimate potential marriage bonus/penalty direction.',
    faqs: [
      { q: 'Is this the same as marriage-tax calculator?', a: 'Yes. This tool represents marriage-related tax comparison scenarios.' },
      { q: 'Can it predict exact future tax?', a: 'No. It provides directional estimates based on simplified assumptions.' },
      { q: 'Should deductions be included?', a: 'Yes, where possible, because deductions can shift scenario outcomes materially.' },
      { q: 'Why use scenario ranges?', a: 'Ranges account for uncertainty in future earnings and policy changes.' },
      { q: 'Can this help financial planning before marriage?', a: 'Yes, it helps set realistic cash-flow expectations and tax planning discussions.' },
      { q: 'Does it include local taxes?', a: 'Local impacts depend on model setup; include local assumptions when relevant.' },
      { q: 'How often should we recalculate?', a: 'Recalculate when income, residence, or tax law changes.' },
      { q: 'Is professional review necessary?', a: 'Recommended for complex households and high-variance income profiles.' },
      { q: 'Can this include investment income?', a: 'Yes, include it in taxable income assumptions for better realism.' },
      { q: 'What output should we focus on most?', a: 'Focus on expected total-tax difference and cash-flow implications.' },
    ],
    sections: [
      { title: 'Household Tax Coordination', content: 'Marriage-related tax planning can improve budgeting and withholding alignment.' },
      { title: 'Income Mix Considerations', content: 'Wage balance and non-wage income sources drive many outcome differences.' },
      { title: 'Risk-Managed Forecasting', content: 'Using conservative assumptions helps avoid under-withholding surprises.' },
      { title: 'Decision Support Role', content: 'This calculator supports planning discussions but should be validated before filing.' },
      { title: 'Ongoing Review', content: 'Annual updates keep assumptions aligned with life and policy changes.' },
    ],
  },
  'estate-tax-calculator': {
    howTo: 'Enter estimated estate value, liabilities, exemptions, and taxable transfers to estimate potential estate-tax exposure under chosen assumptions.',
    formula: 'Estimated taxable estate = gross estate - deductions - exemptions. Estimated tax = taxable estate * applicable tax rate schedule approximation.',
    faqs: [
      { q: 'What is estate tax?', a: 'Estate tax is a tax on transfer of wealth at death above applicable exemption thresholds.' },
      { q: 'Why are exemptions important?', a: 'Exemptions determine how much estate value is shielded from taxation.' },
      { q: 'Do state estate taxes differ from federal?', a: 'Yes. State thresholds and rates can differ significantly from federal rules.' },
      { q: 'Can debts reduce taxable estate?', a: 'Generally, eligible debts and expenses can reduce net taxable estate.' },
      { q: 'Does gifting affect estate tax?', a: 'Lifetime gifting strategies may affect taxable estate depending on jurisdiction and reporting rules.' },
      { q: 'Can trusts change outcomes?', a: 'Trust structures can influence tax treatment and transfer timing.' },
      { q: 'Is this a legal planning tool?', a: 'No. It is an estimate model and not legal advice.' },
      { q: 'How often should estate estimates be updated?', a: 'Review after major asset changes, policy changes, or life events.' },
      { q: 'Should inflation be considered?', a: 'Yes. Asset growth and inflation assumptions can materially affect long-term exposure.' },
      { q: 'Who should verify final plan?', a: 'Estate attorneys and tax professionals should validate final structures and filings.' },
    ],
    sections: [
      { title: 'Taxable Estate Estimation', content: 'Accurate net-estate estimation is the foundation of meaningful estate-tax planning.' },
      { title: 'Threshold and Rate Dynamics', content: 'Exemption levels and progressive rates create non-linear exposure patterns.' },
      { title: 'Planning Instruments', content: 'Gifts, trusts, and charitable structures can influence long-term transfer outcomes.' },
      { title: 'Jurisdictional Complexity', content: 'Federal and state rules interact, requiring localized assumptions for useful forecasts.' },
      { title: 'Professional Validation', content: 'Complex estates should be reviewed by qualified professionals for legal and tax compliance.' },
    ],
  },
  'pension-calculator': {
    howTo: 'Enter years of service, final average salary, accrual rate, and retirement age assumptions to estimate pension income under a defined-benefit style model.',
    formula: 'Typical defined-benefit estimate: Annual pension = final average salary * accrual rate * years of service.',
    faqs: [
      { q: 'What is a pension calculator used for?', a: 'It estimates expected retirement income from defined-benefit pension structures.' },
      { q: 'What is accrual rate?', a: 'Accrual rate is the percentage of salary earned toward pension benefit per service year.' },
      { q: 'Why does retirement age matter?', a: 'Early or delayed retirement can change benefit level due to reductions or credits.' },
      { q: 'Can cost-of-living adjustments be included?', a: 'Some plans include COLA; assumptions should reflect plan-specific rules.' },
      { q: 'What is final average salary?', a: 'It is often average salary over a plan-defined period near retirement.' },
      { q: 'Can this include survivor options?', a: 'Basic estimates may not; survivor election can reduce primary payout for joint benefits.' },
      { q: 'How does vesting affect pension?', a: 'Benefits are usually payable only after meeting vesting requirements.' },
      { q: 'Can inflation reduce real pension value?', a: 'Yes, especially for plans without sufficient inflation adjustment.' },
      { q: 'Should I combine pension with other income sources?', a: 'Yes. Retirement planning should integrate pension, savings, and social benefits.' },
      { q: 'Where do I verify official amounts?', a: 'Use plan statements and administrator projections as authoritative sources.' },
    ],
    sections: [
      { title: 'Defined-Benefit Structure', content: 'Pension outcomes depend on service years, salary base, and plan accrual design.' },
      { title: 'Retirement Timing Effects', content: 'Claim timing influences payout level and lifetime income stability.' },
      { title: 'Inflation and Purchasing Power', content: 'Nominal pension values should be evaluated against long-term inflation assumptions.' },
      { title: 'Integrated Retirement Planning', content: 'Pension estimates are strongest when combined with savings and social benefit projections.' },
      { title: 'Document-Based Verification', content: 'Final planning should use official plan documents and administrator-confirmed figures.' },
    ],
  },
  'social-security-calculator': {
    howTo: 'Enter estimated earnings profile and target claim age to project social-security-style benefit outcomes under simplified assumptions.',
    formula: 'Benefit estimation is based on indexed earnings assumptions and claim-age adjustments relative to full retirement age.',
    faqs: [
      { q: 'How does claim age affect benefit?', a: 'Claiming early usually reduces monthly benefit, while delayed claiming can increase it.' },
      { q: 'What is full retirement age?', a: 'It is the plan-defined age at which unreduced primary benefit is payable.' },
      { q: 'Can I work while claiming benefits?', a: 'Yes, but earnings limits and withholding rules may apply before full retirement age.' },
      { q: 'Are estimates guaranteed?', a: 'No. They are projections based on current assumptions and policy rules.' },
      { q: 'Should spouse benefits be considered?', a: 'Yes. Household strategies can change optimal claim timing.' },
      { q: 'How does inflation adjustment matter?', a: 'Cost-of-living adjustments help preserve real purchasing power over retirement.' },
      { q: 'Can this include future wage growth?', a: 'Scenario assumptions can approximate growth, but actual records determine official outcomes.' },
      { q: 'Is this enough for retirement planning?', a: 'No. Combine with pension and personal savings plans for full retirement strategy.' },
      { q: 'Where can I verify official estimates?', a: 'Official government benefit statements and portals provide authoritative estimates.' },
      { q: 'How often should I reassess claim strategy?', a: 'Reassess with major life, health, or policy changes and near retirement milestones.' },
    ],
    sections: [
      { title: 'Claim-Timing Trade-Off', content: 'Monthly benefit level and lifetime payout potential depend heavily on claim timing decisions.' },
      { title: 'Household Strategy Lens', content: 'Spousal and survivor dynamics can materially influence optimal claiming approach.' },
      { title: 'Projection Uncertainty', content: 'Policy evolution and earnings variability create uncertainty around long-range estimates.' },
      { title: 'Integration With Other Income', content: 'Best outcomes come from combining social benefits with pensions and personal savings plans.' },
      { title: 'Authoritative Data Sources', content: 'Use official account statements for final planning assumptions and decision validation.' },
    ],
  },
  'annuity-calculator': {
    howTo: 'Enter present value, contribution or premium amount, expected return, payout timing, and term assumptions. Calculate to estimate future annuity value or required premium for target income.',
    formula: 'Common forms: FV = P(1+r)^n for lump sum growth; annuity future value adds periodic contributions. Payout estimates depend on discount rate and term.',
    faqs: [
      { q: 'What is an annuity?', a: 'An annuity is a financial product that converts capital into future periodic payments or accumulation value.' },
      { q: 'What is immediate vs deferred annuity?', a: 'Immediate annuities begin payouts soon after funding; deferred annuities accumulate first and pay later.' },
      { q: 'How does interest rate affect annuity value?', a: 'Higher assumed rates generally increase projected future value and can improve estimated payout capacity.' },
      { q: 'Can annuity income be fixed?', a: 'Yes, fixed annuities target stable payouts, while variable annuities can fluctuate with investment performance.' },
      { q: 'What is annuitization?', a: 'Annuitization is the process of converting account value into scheduled income payments.' },
      { q: 'How does inflation affect annuity income?', a: 'Inflation can reduce purchasing power unless payouts include inflation adjustment features.' },
      { q: 'Are fees important in annuity planning?', a: 'Yes, fees can materially reduce long-term net outcomes and should be modeled conservatively.' },
      { q: 'Can this calculator replace product illustrations?', a: 'No. Use official insurer projections and disclosures for final decisions.' },
      { q: 'Should annuities be combined with other retirement income?', a: 'Yes. Integrating annuities with pensions, savings, and social benefits improves planning robustness.' },
      { q: 'When should assumptions be updated?', a: 'Revisit inputs with market-rate changes, product options, or retirement timeline changes.' },
    ],
    sections: [
      { title: 'Accumulation vs Income Phase', content: 'Annuity planning requires separate modeling for growth years and payout years.' },
      { title: 'Rate and Term Sensitivity', content: 'Small assumption differences can significantly change long-horizon annuity projections.' },
      { title: 'Income Stability Goals', content: 'Annuities are often used to reduce longevity risk through predictable cash-flow support.' },
      { title: 'Cost and Product Structure', content: 'Fees, riders, and guarantee structure should be evaluated alongside projected returns.' },
      { title: 'Portfolio Integration', content: 'Annuity decisions are strongest when coordinated with total retirement-income strategy.' },
    ],
  },
  'annuity-payout-calculator': {
    howTo: 'Enter annuity balance, expected return during payout, and payout duration to estimate periodic withdrawal amount and sustainability.',
    formula: 'Level payout estimate: PMT = PV * [r / (1 - (1+r)^-n)] for period rate r and periods n.',
    faqs: [
      { q: 'What does annuity payout mean?', a: 'It is the periodic income amount an annuity can distribute over a selected period or lifetime basis.' },
      { q: 'How does payout duration affect income?', a: 'Longer payout duration lowers periodic payment for the same starting balance.' },
      { q: 'Can payout continue for life?', a: 'Some products offer lifetime options with insurer terms and trade-offs.' },
      { q: 'What is period-certain payout?', a: 'It guarantees payments for a fixed number of years regardless of market outcomes.' },
      { q: 'How does return assumption affect payout?', a: 'Higher net return assumptions can support larger modeled payouts, subject to product constraints.' },
      { q: 'Can I include survivor benefits?', a: 'Joint-life or survivor options usually reduce initial payout in exchange for extended coverage.' },
      { q: 'Should taxes be considered?', a: 'Yes. Net spendable payout depends on taxation and account type.' },
      { q: 'Is inflation-adjusted payout better?', a: 'It improves purchasing-power resilience but may start with lower initial payment.' },
      { q: 'What causes payout shortfall risk?', a: 'Overly optimistic returns, long lifespans, and high withdrawals can create shortfall pressure.' },
      { q: 'How do I verify product-specific payout?', a: 'Use carrier-provided payout illustrations and contract details.' },
    ],
    sections: [
      { title: 'Payout Formula Logic', content: 'Payout calculations balance capital, expected return, and chosen duration.' },
      { title: 'Longevity and Sustainability', content: 'Duration assumptions are central to avoiding income depletion risk.' },
      { title: 'Inflation Trade-Off', content: 'Fixed nominal payouts may lose real value over long retirement periods.' },
      { title: 'Household Income Planning', content: 'Payout estimates should align with recurring spending needs and other income sources.' },
      { title: 'Contract Validation', content: 'Final decisions should be based on official annuity contract terms and disclosures.' },
    ],
  },
  'credit-card-calculator': {
    howTo: 'Enter current balance, APR, and payment strategy (minimum or fixed monthly payment) to estimate payoff timeline and total interest cost.',
    formula: 'Monthly interest = balance * (APR/12). Balance updates each month by adding interest and subtracting payment.',
    faqs: [
      { q: 'What does APR mean for credit cards?', a: 'APR is annualized interest rate; monthly compounding drives actual interest charges on carried balances.' },
      { q: 'Why does minimum payment keep debt longer?', a: 'Minimums often cover mostly interest early, slowing principal reduction.' },
      { q: 'How can I reduce total interest?', a: 'Increase monthly payment, lower APR through negotiation/refinance, and avoid new revolving balances.' },
      { q: 'Does compounding matter much?', a: 'Yes. Frequent compounding can substantially increase total borrowing cost over time.' },
      { q: 'Can this estimate balance transfer savings?', a: 'Yes by comparing current APR scenario with transfer APR and fee assumptions.' },
      { q: 'What is utilization and why important?', a: 'Utilization is balance relative to limit; lower utilization can improve credit profile.' },
      { q: 'Should I pay multiple cards equally?', a: 'Not always. Prioritizing higher-interest balances often reduces total cost faster.' },
      { q: 'Can late fees change payoff plan?', a: 'Yes. Fees and penalty APR can significantly worsen payoff outcomes.' },
      { q: 'How often should I recalculate?', a: 'Recalculate after APR changes, payment changes, or new charges.' },
      { q: 'Is this a replacement for issuer statement?', a: 'No. Statements remain authoritative for exact billing and legal terms.' },
    ],
    sections: [
      { title: 'Revolving Debt Mechanics', content: 'Credit-card debt grows when payments fail to offset interest and ongoing spending.' },
      { title: 'Payment Strategy Impact', content: 'Fixed higher payments can dramatically shorten payoff horizon and reduce interest.' },
      { title: 'APR Sensitivity', content: 'Rate differences compound quickly on large balances and long payoff timelines.' },
      { title: 'Credit Profile Interaction', content: 'Lower balances can improve utilization metrics and borrowing flexibility.' },
      { title: 'Behavioral Discipline', content: 'A no-new-debt rule is often essential for durable payoff progress.' },
    ],
  },
  'credit-card-payoff-calculator': {
    howTo: 'Provide card balance, APR, and planned monthly payment to project payoff date, total interest, and acceleration options.',
    formula: 'Iterative amortization: new balance = old balance + monthly interest - payment until balance reaches zero.',
    faqs: [
      { q: 'How is payoff month estimated?', a: 'The model simulates monthly interest and payment cycles until remaining balance is zero.' },
      { q: 'Can a small payment still work?', a: 'Yes, but low payments can make payoff extremely slow and expensive.' },
      { q: 'What if payment is below monthly interest?', a: 'Balance may grow or stagnate, preventing payoff.' },
      { q: 'How much extra payment helps?', a: 'Even modest monthly increases can significantly cut payoff time and total interest.' },
      { q: 'Can I compare two payoff strategies?', a: 'Yes. Test scenarios with different monthly payment levels and APR assumptions.' },
      { q: 'Should I stop card usage during payoff?', a: 'Yes. Continuing new charges often offsets repayment progress.' },
      { q: 'Does promotional APR change projection?', a: 'Yes. Temporary low rates can accelerate payoff if fees and expiry are modeled correctly.' },
      { q: 'Can this include annual fees?', a: 'Include fee assumptions for realistic long-term cost projection.' },
      { q: 'Is monthly or biweekly payment better?', a: 'More frequent payments can slightly reduce interest depending on issuer posting behavior.' },
      { q: 'How accurate is payoff projection?', a: 'Accuracy depends on stable APR, fixed payment behavior, and no unexpected fees/charges.' },
    ],
    sections: [
      { title: 'Payoff Simulation Model', content: 'Month-by-month simulation clarifies timeline and cost under chosen payment assumptions.' },
      { title: 'Acceleration Levers', content: 'Payment increases and APR reductions are the strongest drivers of faster debt elimination.' },
      { title: 'Risk Conditions', content: 'Rate hikes and new purchases can delay payoff materially.' },
      { title: 'Milestone Planning', content: 'Interim target dates improve motivation and progress tracking.' },
      { title: 'Execution Discipline', content: 'Consistent payments and spending controls are required for reliable payoff outcomes.' },
    ],
  },
  'debt-payoff-calculator': {
    howTo: 'List debts with balances, rates, and minimum payments to compare payoff strategies such as avalanche (highest APR first) and snowball (smallest balance first).',
    formula: 'Total payoff is modeled by allocating extra payment according to selected strategy while maintaining minimums across all debts.',
    faqs: [
      { q: 'What is debt avalanche?', a: 'Avalanche prioritizes highest-interest debt first to minimize total interest cost.' },
      { q: 'What is debt snowball?', a: 'Snowball pays smallest balance first to build momentum through quick wins.' },
      { q: 'Which method is better?', a: 'Avalanche is usually cheapest mathematically; snowball can improve adherence for some people.' },
      { q: 'Should I include all debts?', a: 'Yes. A complete debt map gives more accurate timeline and strategy outcomes.' },
      { q: 'How do extra payments change results?', a: 'Extra payments can shorten payoff significantly, especially when directed strategically.' },
      { q: 'Can consolidation beat payoff strategy?', a: 'If consolidation lowers effective rate and fees are reasonable, it may improve total cost.' },
      { q: 'What about variable-rate debt?', a: 'Recalculate regularly because changing rates affect sequencing and cost projections.' },
      { q: 'Can this include one-time lump sums?', a: 'Yes. Scenario testing with occasional lump-sum payments can show major acceleration effects.' },
      { q: 'Should emergency savings pause payoff?', a: 'A minimum emergency buffer often helps prevent re-borrowing during setbacks.' },
      { q: 'How often should payoff plan be reviewed?', a: 'Review monthly or when income, expenses, and rates shift.' },
    ],
    sections: [
      { title: 'Portfolio Debt View', content: 'Multi-debt planning works best when all balances and obligations are modeled together.' },
      { title: 'Strategy Trade-Offs', content: 'Cost-optimal and behavior-optimal methods can differ; choose strategy you can sustain.' },
      { title: 'Rate and Fee Dynamics', content: 'Interest and fee assumptions dominate long-term payoff cost outcomes.' },
      { title: 'Cash-Flow Coordination', content: 'Debt plans should preserve essential spending and emergency resilience.' },
      { title: 'Iterative Optimization', content: 'Re-optimizing plan after each milestone can improve speed and confidence.' },
    ],
  },
  'debt-consolidation-calculator': {
    howTo: 'Enter current debts and compare them with a proposed consolidation loan by rate, term, and fees to estimate monthly payment and total-cost difference.',
    formula: 'Compare total paid under current debt schedule versus consolidation amortization including upfront and ongoing fees.',
    faqs: [
      { q: 'What is debt consolidation?', a: 'It combines multiple debts into one loan, often to simplify payments or lower effective cost.' },
      { q: 'When does consolidation help most?', a: 'It helps when effective rate drops meaningfully and added fees do not offset savings.' },
      { q: 'Can lower payment still cost more overall?', a: 'Yes. Longer terms can reduce monthly burden but increase total interest paid.' },
      { q: 'Should fees be included?', a: 'Always include origination, transfer, and servicing fees in comparison.' },
      { q: 'Does consolidation improve credit score?', a: 'It can help indirectly through utilization and payment consistency, but outcomes vary.' },
      { q: 'Can I consolidate credit cards and loans together?', a: 'Often yes, depending on lender terms and qualification requirements.' },
      { q: 'What is break-even concept in consolidation?', a: 'Break-even is when cumulative savings surpass consolidation costs.' },
      { q: 'Should I close old accounts?', a: 'Not always. Account-closure decisions should consider utilization, behavior, and credit-history effects.' },
      { q: 'How often should offers be compared?', a: 'Compare whenever rates or credit profile improve and before committing to new terms.' },
      { q: 'Can consolidation fail without behavior change?', a: 'Yes. New borrowing after consolidation can recreate debt burden quickly.' },
    ],
    sections: [
      { title: 'Cost-Benefit Core Test', content: 'Consolidation only wins when net total cost declines after all fees and term effects.' },
      { title: 'Monthly Relief vs Lifetime Cost', content: 'Lower monthly payment is useful but should be weighed against total repayment expansion.' },
      { title: 'Qualification Factors', content: 'Credit profile and income stability influence available consolidation terms.' },
      { title: 'Execution Risk', content: 'Behavioral discipline is required to avoid debt re-accumulation after consolidation.' },
      { title: 'Decision Validation', content: 'Compare multiple offers and include sensitivity cases before final selection.' },
    ],
  },
  'repayment-calculator': {
    howTo: 'Enter loan balance, APR, and payment amount to estimate repayment duration, total paid, and total interest. Use it to test alternative payment schedules.',
    formula: 'Amortization process updates balance each period: balance = balance + interest - payment until zero.',
    faqs: [
      { q: 'What does repayment calculator show?', a: 'It projects payoff timeline, total repayment amount, and total interest under chosen payment assumptions.' },
      { q: 'Can I set custom payment amount?', a: 'Yes. Custom payment helps test affordability and payoff speed trade-offs.' },
      { q: 'Why does higher payment reduce cost so much?', a: 'Faster principal reduction lowers future interest base, creating compounding savings.' },
      { q: 'Can this handle different compounding frequencies?', a: 'Many models assume monthly cycles; adjust assumptions if your product differs.' },
      { q: 'What if payment is too low?', a: 'If payment does not cover accrued interest, payoff may fail or delay significantly.' },
      { q: 'Can I model extra annual payments?', a: 'Yes. Periodic lump-sum payments can be tested as scenario accelerators.' },
      { q: 'Is this useful for refinancing decisions?', a: 'Yes, especially when comparing old and new repayment trajectories.' },
      { q: 'Should taxes and fees be included?', a: 'Include all applicable costs for realistic decision support.' },
      { q: 'How accurate are projections?', a: 'Accuracy depends on stable rate/payment assumptions and absence of unexpected charges.' },
      { q: 'How often to recalculate?', a: 'Recalculate when rates, balances, or payment capacity change.' },
    ],
    sections: [
      { title: 'Amortization Mechanics', content: 'Repayment outcomes are driven by interaction of rate, balance, and payment size over time.' },
      { title: 'Payment Sensitivity', content: 'Small ongoing payment increases can materially improve payoff speed and cost.' },
      { title: 'Scenario Testing', content: 'Running conservative, base, and aggressive repayment scenarios improves decision confidence.' },
      { title: 'Cost Transparency', content: 'Total interest visibility supports better borrowing and refinancing choices.' },
      { title: 'Adaptive Debt Management', content: 'Regular plan updates keep repayment strategy aligned with changing finances.' },
    ],
  },
  'student-loan-calculator': {
    howTo: 'Enter loan principal, interest rate, term, and optional grace period or extra payment assumptions to estimate monthly payment and lifetime cost.',
    formula: 'Standard amortized payment: PMT = [P*r*(1+r)^n]/[(1+r)^n-1] with r as periodic rate.',
    faqs: [
      { q: 'What does student loan calculator estimate?', a: 'It estimates monthly payment, total interest, and total repayment amount.' },
      { q: 'How does term length affect payment?', a: 'Longer term lowers monthly payment but usually increases total interest paid.' },
      { q: 'Can extra payments help?', a: 'Yes. Extra principal payments can reduce payoff term and interest substantially.' },
      { q: 'What is grace period effect?', a: 'Interest may accrue during grace period depending on loan type, increasing balance at repayment start.' },
      { q: 'Can this compare refinancing?', a: 'Yes. Compare current loan with refinance terms to evaluate payment and cost differences.' },
      { q: 'Should I consider income-driven plans?', a: 'Yes for cash-flow flexibility; long-term cost and forgiveness rules should also be evaluated.' },
      { q: 'Do federal and private loans behave the same?', a: 'No. Terms, protections, and repayment options can differ materially.' },
      { q: 'Can capitalization increase cost?', a: 'Yes. Capitalized interest raises principal and future interest burden.' },
      { q: 'How often should repayment plan be reviewed?', a: 'Review yearly or after income/rate changes.' },
      { q: 'Where to verify official payment terms?', a: 'Use servicer-provided schedules and loan documents for binding figures.' },
    ],
    sections: [
      { title: 'Education Debt Structure', content: 'Student-loan planning balances affordability today with long-term cost containment.' },
      { title: 'Term and Rate Trade-Off', content: 'Repayment term and rate assumptions shape both monthly burden and total interest.' },
      { title: 'Acceleration Options', content: 'Targeted extra payments can materially improve debt freedom timeline.' },
      { title: 'Program-Specific Rules', content: 'Federal and private loans may require different optimization strategies.' },
      { title: 'Servicer Reconciliation', content: 'Always align calculator assumptions with official servicer statements.' },
    ],
  },
  'college-cost-calculator': {
    howTo: 'Enter tuition, fees, living expenses, aid assumptions, and study duration to estimate total education cost and expected funding gap.',
    formula: 'Net annual cost = tuition + fees + living costs - grants/scholarships. Total cost is multi-year sum with optional inflation.',
    faqs: [
      { q: 'What does college cost include?', a: 'Tuition, mandatory fees, housing, meals, books, transportation, and personal expenses.' },
      { q: 'How is net cost different from sticker price?', a: 'Net cost subtracts grants and scholarships from full listed cost.' },
      { q: 'Should inflation be included?', a: 'Yes. Multi-year education plans should account for tuition and living-cost inflation.' },
      { q: 'Can this estimate borrowing need?', a: 'Yes. Funding gap estimates can guide expected loan requirements.' },
      { q: 'How do scholarships affect projection?', a: 'Scholarships directly lower net cost, but renewal conditions should be considered.' },
      { q: 'Can part-time work offset cost?', a: 'Yes, but realistic income assumptions are important for planning reliability.' },
      { q: 'Should opportunity cost be considered?', a: 'For strategic planning, foregone earnings and timeline effects may be relevant.' },
      { q: 'Can this compare schools?', a: 'Yes. Standardized assumptions enable side-by-side affordability comparison.' },
      { q: 'How often should cost estimates be updated?', a: 'Update annually with current tuition schedules and aid package changes.' },
      { q: 'Where to validate final numbers?', a: 'Use official school cost-of-attendance and financial-aid documents.' },
    ],
    sections: [
      { title: 'Total Cost of Attendance', content: 'Comprehensive education budgeting should include both direct and indirect costs.' },
      { title: 'Aid-Adjusted Planning', content: 'Net cost modeling provides a more realistic basis than sticker tuition alone.' },
      { title: 'Multi-Year Projection', content: 'Inflation-aware forecasts reduce underfunding risk across degree duration.' },
      { title: 'Funding Strategy Design', content: 'Combining savings, aid, and borrowing plans improves affordability outcomes.' },
      { title: 'Decision Confidence', content: 'Consistent school comparisons support better long-term education financing decisions.' },
    ],
  },
  'simple-interest-calculator': {
    howTo: 'Enter principal, annual interest rate, and time period to estimate interest earned or owed when interest is not compounded.',
    formula: 'Simple Interest = Principal * Rate * Time. Total Amount = Principal + Interest.',
    faqs: [
      { q: 'What is simple interest?', a: 'Simple interest is calculated only on the original principal, not on accumulated interest.' },
      { q: 'How is it different from compound interest?', a: 'Compound interest grows on principal plus prior interest, while simple interest stays linear.' },
      { q: 'What units should time use?', a: 'Time should align with annual rate assumptions, typically in years.' },
      { q: 'Can I use months instead of years?', a: 'Yes, convert months to years (months/12) before applying the formula.' },
      { q: 'Where is simple interest used?', a: 'It appears in some short-term loans and educational finance examples.' },
      { q: 'Does payment schedule matter here?', a: 'Simple-interest model assumes straightforward principal-time-rate relationship without compounding steps.' },
      { q: 'Can simple interest overestimate real savings?', a: 'Yes, if actual account compounds, simple model may understate/overstate depending on context.' },
      { q: 'Is APR the same as simple rate?', a: 'Not always. APR can include fees and may differ from pure rate input assumptions.' },
      { q: 'Can this estimate loan interest cost?', a: 'Yes for simple-interest structures, but many consumer loans are amortized or compounded.' },
      { q: 'Should I compare with compound model?', a: 'Yes when evaluating real products, because compounding and fees change outcomes.' },
    ],
    sections: [
      { title: 'Linear Interest Concept', content: 'Simple interest scales proportionally with principal, rate, and time.' },
      { title: 'Use-Case Boundaries', content: 'It is best for straightforward scenarios and quick estimates.' },
      { title: 'Time Conversion Accuracy', content: 'Correct time-unit conversion is critical for valid output.' },
      { title: 'Comparison to Compounding', content: 'Simple and compound models diverge over longer durations.' },
      { title: 'Decision Context', content: 'Use simple interest for baseline intuition, then validate with product-specific terms.' },
    ],
  },
  'cd-calculator': {
    howTo: 'Enter deposit amount, APY, and term length to estimate certificate-of-deposit maturity value and total interest earnings.',
    formula: 'Maturity value approximates deposit growth using APY and term fraction; FV ~= P*(1+APY)^t.',
    faqs: [
      { q: 'What is a CD?', a: 'A certificate of deposit is a time-locked savings product with fixed rate for a defined term.' },
      { q: 'What is APY?', a: 'APY includes compounding effects and reflects effective annual yield.' },
      { q: 'Can I withdraw early?', a: 'Early withdrawal usually triggers penalties that reduce net return.' },
      { q: 'How does term length affect earnings?', a: 'Longer terms can increase earnings but reduce liquidity.' },
      { q: 'Are CDs safe?', a: 'Bank-issued CDs are generally low-risk and may be insured within coverage limits.' },
      { q: 'Can I ladder CDs?', a: 'Yes. CD ladders balance liquidity and yield by staggering maturities.' },
      { q: 'Should tax be considered?', a: 'Yes. Tax on earned interest can reduce net effective return.' },
      { q: 'How often should CD rates be compared?', a: 'Compare before each purchase and renewal as rates change frequently.' },
      { q: 'Is APY enough for comparison?', a: 'APY plus penalty terms and liquidity needs provide better decision quality.' },
      { q: 'Can this calculator model rollover?', a: 'Basic models estimate one term; run sequential scenarios for rollover plans.' },
    ],
    sections: [
      { title: 'Fixed-Term Savings Mechanics', content: 'CDs trade liquidity for predictable yield over a set duration.' },
      { title: 'APY Interpretation', content: 'APY is the best headline metric for comparing fixed-rate deposit products.' },
      { title: 'Penalty Risk Consideration', content: 'Early-withdrawal penalties can offset expected gains if liquidity is needed.' },
      { title: 'Laddering Strategy', content: 'Ladder design helps maintain periodic access while capturing term premiums.' },
      { title: 'Net Return Planning', content: 'After-tax and after-penalty awareness improves realistic outcome expectations.' },
    ],
  },
  'bond-calculator': {
    howTo: 'Enter face value, coupon rate, market yield, and years to maturity to estimate bond price and yield relationships.',
    formula: 'Bond price is present value of coupon stream plus discounted face value at required yield.',
    faqs: [
      { q: 'What is bond face value?', a: 'Face value is the amount repaid at maturity, often called par value.' },
      { q: 'What is coupon rate?', a: 'Coupon rate determines periodic interest payments based on face value.' },
      { q: 'Why do bond prices move opposite rates?', a: 'When market yields rise, existing lower-coupon bonds become less attractive, reducing price.' },
      { q: 'What is yield to maturity?', a: 'YTM approximates annual return if bond is held to maturity with reinvestment assumptions.' },
      { q: 'Can this calculator price zero-coupon bonds?', a: 'Yes, by discounting maturity value without periodic coupon payments.' },
      { q: 'How does maturity affect sensitivity?', a: 'Longer-duration bonds are more sensitive to yield changes.' },
      { q: 'Are coupon frequencies important?', a: 'Yes. Annual vs semiannual coupon timing affects valuation outputs.' },
      { q: 'Can credit risk change bond value?', a: 'Yes. Higher default risk often increases required yield and lowers price.' },
      { q: 'Is nominal yield enough for decisions?', a: 'Use YTM, duration, and credit context for fuller risk-return evaluation.' },
      { q: 'Should inflation expectations be included?', a: 'Yes. Real return depends on inflation relative to nominal bond yield.' },
    ],
    sections: [
      { title: 'Price-Yield Inversion', content: 'Bond valuation depends inversely on discount rate assumptions.' },
      { title: 'Cash-Flow Discounting', content: 'Coupons and principal are discounted separately to derive fair price.' },
      { title: 'Duration Sensitivity', content: 'Interest-rate risk grows with longer maturity and lower coupon structures.' },
      { title: 'Credit Layer', content: 'Issuer credit quality can materially shift required yield and valuation.' },
      { title: 'Portfolio Role', content: 'Bonds provide income and diversification when aligned with risk horizon.' },
    ],
  },
  'mutual-fund-calculator': {
    howTo: 'Enter initial investment, periodic contribution, expected return, expense ratio, and timeline to estimate mutual fund growth net of costs.',
    formula: 'Net growth approximates compounding of principal and contributions using return minus expense assumptions.',
    faqs: [
      { q: 'What does a mutual fund calculator estimate?', a: 'It projects investment value over time based on return and contribution assumptions.' },
      { q: 'Why does expense ratio matter?', a: 'Fund fees reduce net return and can materially impact long-term outcomes.' },
      { q: 'Can I include SIP/monthly investing?', a: 'Yes. Periodic contribution mode simulates systematic investing patterns.' },
      { q: 'What return should I assume?', a: 'Use conservative, base, and optimistic ranges rather than one fixed aggressive estimate.' },
      { q: 'Can this include tax drag?', a: 'Adjust net return assumptions to reflect expected tax impact.' },
      { q: 'How does time horizon affect results?', a: 'Longer horizons amplify compounding and fee differences.' },
      { q: 'Should I compare multiple funds?', a: 'Yes. Compare fees, risk profile, and return assumptions side by side.' },
      { q: 'Can market volatility break projection?', a: 'Yes. Real outcomes vary; this is a planning model, not a guarantee.' },
      { q: 'Is lump sum always better than SIP?', a: 'It depends on market path and risk tolerance; both can be valid strategies.' },
      { q: 'How often to rebalance assumptions?', a: 'Review annually or after major market and goal changes.' },
    ],
    sections: [
      { title: 'Net Return Perspective', content: 'Fee-adjusted return assumptions are key for realistic mutual-fund projections.' },
      { title: 'Contribution Cadence', content: 'Systematic investing can improve discipline and smooth market-entry timing risk.' },
      { title: 'Scenario Planning', content: 'Multiple return paths improve resilience of long-term investment plans.' },
      { title: 'Cost Compounding', content: 'Small fee differences compound into large long-term value gaps.' },
      { title: 'Goal Alignment', content: 'Investment assumptions should match horizon, risk tolerance, and target use of funds.' },
    ],
  },
  'roth-ira-calculator': {
    howTo: 'Enter annual contributions, expected return, current age, and retirement horizon to estimate Roth IRA balance and tax-free qualified withdrawal potential.',
    formula: 'Projected value uses contribution compounding over time under return assumptions with contribution limits considered.',
    faqs: [
      { q: 'What is a Roth IRA?', a: 'A Roth IRA is a retirement account funded with after-tax contributions, generally offering tax-free qualified withdrawals.' },
      { q: 'Why is Roth useful?', a: 'Tax-free qualified withdrawals can improve retirement flexibility and tax planning.' },
      { q: 'Are there contribution limits?', a: 'Yes. Annual contribution caps and income eligibility rules apply.' },
      { q: 'Can contributions be withdrawn?', a: 'Roth contribution withdrawal rules differ from earnings; account-specific compliance is important.' },
      { q: 'How does age affect strategy?', a: 'Time horizon influences growth potential and optimal allocation decisions.' },
      { q: 'Can I contribute every month?', a: 'Yes, as long as total annual contributions remain within allowed limits.' },
      { q: 'Should inflation be modeled?', a: 'Yes to estimate real purchasing power at retirement.' },
      { q: 'Can this compare Roth vs traditional?', a: 'Yes by scenario-testing tax timing assumptions and projected retirement bracket.' },
      { q: 'Do investment fees matter here?', a: 'Yes. Expense drag impacts long-term account growth significantly.' },
      { q: 'Where should final eligibility be verified?', a: 'Use current IRS guidance and qualified tax advisors for rule confirmation.' },
    ],
    sections: [
      { title: 'Tax-Timing Advantage', content: 'Roth structures trade current-tax payment for potential future tax-free qualified withdrawals.' },
      { title: 'Contribution Limit Awareness', content: 'Annual caps and eligibility thresholds must be respected in planning.' },
      { title: 'Long-Horizon Compounding', content: 'Early and consistent contributions can meaningfully increase retirement readiness.' },
      { title: 'Allocation and Fees', content: 'Risk profile and low-cost implementation are central to efficient long-term growth.' },
      { title: 'Policy Validation', content: 'Regulatory updates should be checked periodically for compliance and optimization.' },
    ],
  },
  'ira-calculator': {
    howTo: 'Enter annual contribution, expected return, and investment horizon to project IRA accumulation and compare retirement funding scenarios.',
    formula: 'Balance projection compounds current value and periodic contributions over selected term and return assumptions.',
    faqs: [
      { q: 'What is an IRA?', a: 'An IRA is an individual retirement account used to save for retirement with specific tax treatment rules.' },
      { q: 'How is IRA different from Roth IRA?', a: 'Traditional IRA and Roth IRA differ mainly in tax timing and withdrawal treatment.' },
      { q: 'Are contribution limits applicable?', a: 'Yes. Annual contribution limits and eligibility constraints apply.' },
      { q: 'Can I have both IRA types?', a: 'In many cases yes, subject to contribution and income rules.' },
      { q: 'How should return assumptions be chosen?', a: 'Use conservative/base/aggressive ranges and revisit over time.' },
      { q: 'Can this include employer plans too?', a: 'It can be coordinated conceptually but employer plan modeling should be separate when needed.' },
      { q: 'Does inflation impact retirement target?', a: 'Yes. Nominal balances should be viewed alongside inflation-adjusted needs.' },
      { q: 'Can fees reduce IRA growth?', a: 'Yes. Lower fee structures generally improve long-run net outcomes.' },
      { q: 'How often should projections be updated?', a: 'At least annually and after major life or market changes.' },
      { q: 'Should I verify with tax professional?', a: 'Yes for contribution deductibility and withdrawal planning specifics.' },
    ],
    sections: [
      { title: 'Retirement Accumulation Core', content: 'IRA projections help translate savings behavior into future retirement-capital expectations.' },
      { title: 'Tax Structure Choice', content: 'Choosing between traditional and Roth frameworks affects long-term net benefit.' },
      { title: 'Contribution Consistency', content: 'Regular annual contributions are a major determinant of final account size.' },
      { title: 'Real vs Nominal Goals', content: 'Inflation-adjusted planning improves realism for retirement spending expectations.' },
      { title: 'Compliance and Review', content: 'Limit changes and tax-policy updates require periodic strategy checks.' },
    ],
  },
  'rmd-calculator': {
    howTo: 'Enter account balance and age to estimate required minimum distribution (RMD) under life-expectancy-factor assumptions.',
    formula: 'RMD = Prior year-end account balance / applicable life-expectancy distribution factor.',
    faqs: [
      { q: 'What is RMD?', a: 'RMD is the minimum annual withdrawal required from certain tax-deferred retirement accounts after specified age.' },
      { q: 'How is RMD amount determined?', a: 'It depends on prior year-end balance and IRS distribution factor for your age and status.' },
      { q: 'Can missing RMD trigger penalties?', a: 'Yes, insufficient withdrawals may trigger penalties under applicable regulations.' },
      { q: 'Does Roth IRA have RMD during owner lifetime?', a: 'Rules differ by account type; verify current-year regulations for exact treatment.' },
      { q: 'Can I withdraw more than RMD?', a: 'Yes, but excess generally does not reduce future required amounts automatically.' },
      { q: 'Should multiple accounts be aggregated?', a: 'Aggregation rules vary by account type; confirm compliance with official guidance.' },
      { q: 'How does market decline affect RMD?', a: 'Lower year-end balances can reduce future RMD amounts.' },
      { q: 'Can taxes be withheld from RMD?', a: 'Yes, withholding can be applied based on tax-planning preference.' },
      { q: 'How often should RMD estimate be updated?', a: 'Recalculate annually with current balances and latest distribution tables.' },
      { q: 'Where to verify official factor?', a: 'Use current IRS publications and custodial guidance for authoritative factors.' },
    ],
    sections: [
      { title: 'Distribution Compliance', content: 'RMD planning ensures required withdrawals are met on time and in correct amount.' },
      { title: 'Tax Impact Awareness', content: 'RMD withdrawals can affect taxable income and related planning decisions.' },
      { title: 'Account Coordination', content: 'Multi-account households should apply account-type-specific aggregation rules carefully.' },
      { title: 'Annual Recalibration', content: 'Year-end balances and updated factors make yearly recalculation essential.' },
      { title: 'Penalty Avoidance', content: 'Accurate, timely execution helps avoid avoidable compliance penalties.' },
    ],
  },
  'vat-calculator': {
    howTo: 'Enter net or gross amount and VAT rate to add VAT, remove VAT, and view tax component for invoice or pricing checks.',
    formula: 'VAT amount = Net * Rate. Gross = Net * (1+Rate). Net from gross = Gross / (1+Rate).',
    faqs: [
      { q: 'What is VAT?', a: 'VAT is value-added tax applied to goods and services in many jurisdictions.' },
      { q: 'How do I add VAT to a net price?', a: 'Multiply net price by (1 + VAT rate) to get gross amount.' },
      { q: 'How do I remove VAT from gross price?', a: 'Divide gross amount by (1 + VAT rate) to recover net amount.' },
      { q: 'Why do invoice totals differ slightly?', a: 'Rounding by line item or invoice total can cause small differences.' },
      { q: 'Can multiple VAT rates apply?', a: 'Yes. Different goods/services may have different VAT rates.' },
      { q: 'Should VAT be included in advertised price?', a: 'Rules vary by jurisdiction and customer type (consumer vs business).' },
      { q: 'Can this help cross-border pricing?', a: 'Yes, as a quick estimate with correct local VAT assumptions.' },
      { q: 'Is VAT same as sales tax?', a: 'They are different systems though both affect final transaction price.' },
      { q: 'How often should rates be updated?', a: 'Update promptly when tax authority revises rates.' },
      { q: 'Can this replace accounting software?', a: 'No. Use it for estimation and validation, not full compliance processing.' },
    ],
    sections: [
      { title: 'Net-Gross Transformation', content: 'VAT tools convert cleanly between pre-tax and tax-inclusive pricing.' },
      { title: 'Rate Governance', content: 'Using correct jurisdiction rate is essential for valid output.' },
      { title: 'Invoice Validation', content: 'Quick VAT checks reduce pricing and billing errors.' },
      { title: 'Operational Pricing', content: 'VAT-aware pricing helps margin planning in taxable environments.' },
      { title: 'Compliance Boundary', content: 'Estimate tools should be paired with formal accounting systems for filing.' },
    ],
  },
  'auto-lease-calculator': {
    howTo: 'Enter vehicle price, residual value, lease term, money factor/APR equivalent, down payment, and fees to estimate monthly lease cost and total outlay.',
    formula: 'Lease payment is typically depreciation charge plus finance charge, adjusted for taxes/fees and lease structure assumptions.',
    faqs: [
      { q: 'What is residual value?', a: 'Residual value is estimated vehicle value at lease-end and strongly influences payment size.' },
      { q: 'What is money factor?', a: 'Money factor is lease financing rate representation that can be converted to APR-like terms.' },
      { q: 'How does term length affect lease payment?', a: 'Longer terms spread depreciation but can increase total outlay and exposure.' },
      { q: 'Should I put money down on a lease?', a: 'Large upfront payments reduce monthly amount but may increase risk if vehicle is totaled.' },
      { q: 'Do mileage limits matter?', a: 'Yes. Exceeding contract mileage can trigger substantial end-of-lease charges.' },
      { q: 'Can this compare lease vs buy?', a: 'Yes. Compare total lease outlay against ownership cost scenarios.' },
      { q: 'Are fees significant in leasing?', a: 'Acquisition, disposition, and miscellaneous fees can materially change effective cost.' },
      { q: 'What is depreciation charge in lease?', a: 'It is the portion of vehicle value expected to be consumed over lease term.' },
      { q: 'Can taxes differ by state?', a: 'Yes. Lease tax treatment varies by jurisdiction and can change payment substantially.' },
      { q: 'How to validate dealer lease quote?', a: 'Check residual, money factor, term, fees, and taxable base against your assumptions.' },
    ],
    sections: [
      { title: 'Lease Payment Components', content: 'Understanding depreciation and finance components improves quote transparency.' },
      { title: 'Residual and Mileage Link', content: 'Residual assumptions and mileage limits are major drivers of total lease economics.' },
      { title: 'Upfront vs Monthly Trade-Off', content: 'Lower monthly payment from large down payment may not reduce risk-adjusted cost.' },
      { title: 'Fee and Tax Effects', content: 'Hidden fees and local tax rules can materially alter true affordability.' },
      { title: 'Lease vs Buy Decision', content: 'A total-cost comparison over expected ownership horizon improves decision quality.' },
    ],
  },
  'depreciation-calculator': {
    howTo: 'Enter asset cost, salvage value, useful life, and preferred method to estimate annual depreciation and remaining book value over time.',
    formula: 'Straight-line: (Cost - Salvage) / Useful Life. Other methods (declining balance, sum-of-years) front-load depreciation.',
    faqs: [
      { q: 'What is depreciation?', a: 'Depreciation allocates asset cost across useful life to reflect value consumption over time.' },
      { q: 'Why use salvage value?', a: 'Salvage value represents expected residual value at end of useful life.' },
      { q: 'Which depreciation method should I use?', a: 'Method choice depends on accounting policy, tax rules, and asset usage pattern.' },
      { q: 'Is straight-line simplest?', a: 'Yes. It applies equal depreciation expense each period.' },
      { q: 'Can depreciation be accelerated?', a: 'Yes. Accelerated methods expense more early in asset life.' },
      { q: 'Does depreciation affect cash flow directly?', a: 'Depreciation is non-cash accounting expense but can affect taxable income.' },
      { q: 'Can land be depreciated?', a: 'Typically no; land is generally not depreciable under standard accounting practice.' },
      { q: 'How often should estimates be reviewed?', a: 'Review when useful life assumptions or asset condition changes materially.' },
      { q: 'What is book value?', a: 'Book value is asset cost minus accumulated depreciation.' },
      { q: 'Can this replace formal accounting policy?', a: 'No. Use it for estimation and planning, then align with official standards.' },
    ],
    sections: [
      { title: 'Cost Allocation Purpose', content: 'Depreciation spreads long-lived asset cost across periods benefiting from use.' },
      { title: 'Method Selection Impact', content: 'Different methods alter timing of expense recognition and reported profit profile.' },
      { title: 'Tax and Reporting Effects', content: 'Depreciation assumptions influence taxable income and financial statement interpretation.' },
      { title: 'Lifecycle Tracking', content: 'Book value trends help planning for replacement and capital budgeting.' },
      { title: 'Assumption Governance', content: 'Useful-life and salvage assumptions should be documented and periodically validated.' },
    ],
  },
  'average-return-calculator': {
    howTo: 'Enter periodic returns to compute average performance metrics and compare investment consistency across time windows.',
    formula: 'Arithmetic average = sum(returns)/n. Geometric average = (product(1+r_i))^(1/n) - 1.',
    faqs: [
      { q: 'What is arithmetic vs geometric return?', a: 'Arithmetic is simple mean; geometric reflects compounding and is usually lower when volatility exists.' },
      { q: 'Which average should I use?', a: 'Use geometric average for long-term growth interpretation and arithmetic for short-run expectation context.' },
      { q: 'Why does volatility matter?', a: 'Volatility drag reduces compounded growth relative to simple average.' },
      { q: 'Can negative years affect averages strongly?', a: 'Yes. Losses can disproportionately reduce compounded outcomes.' },
      { q: 'Is average return a guarantee?', a: 'No. It summarizes past or assumed data and does not guarantee future performance.' },
      { q: 'Should fees be included?', a: 'Yes. Use net returns for realistic investor outcomes.' },
      { q: 'Can this compare funds?', a: 'Yes, when measurement windows and assumptions are consistent.' },
      { q: 'How many periods are enough?', a: 'Longer horizons usually provide more stable perspective but still include regime risk.' },
      { q: 'Can inflation-adjusted return be modeled?', a: 'Yes by converting nominal returns to real-return assumptions.' },
      { q: 'How often should averages be updated?', a: 'Update with each new period to maintain current performance context.' },
    ],
    sections: [
      { title: 'Compounded Reality', content: 'Geometric return best represents multi-period wealth growth under compounding.' },
      { title: 'Volatility Interpretation', content: 'Return dispersion affects realized growth even when arithmetic averages look attractive.' },
      { title: 'Benchmark Comparison', content: 'Consistent-period analysis improves fairness of strategy comparisons.' },
      { title: 'Net-of-Cost Perspective', content: 'Fees and taxes are essential for investor-level performance realism.' },
      { title: 'Decision Context', content: 'Average metrics should be combined with risk and drawdown analysis.' },
    ],
  },
  'margin-calculator': {
    howTo: 'Enter cost and selling price to calculate gross margin, markup, and profit amount for pricing and profitability analysis.',
    formula: 'Profit = Price - Cost. Margin% = Profit/Price*100. Markup% = Profit/Cost*100.',
    faqs: [
      { q: 'What is gross margin?', a: 'Gross margin is profit as a percentage of selling price.' },
      { q: 'What is markup?', a: 'Markup is profit as a percentage of cost.' },
      { q: 'Why are margin and markup different?', a: 'They use different denominators, so values are not interchangeable.' },
      { q: 'How do I set target margin price?', a: 'Required price = cost / (1 - target margin).' },
      { q: 'Can discounts break target margin?', a: 'Yes. Discounting without recalculation can materially compress profit margins.' },
      { q: 'Should taxes be included?', a: 'Use pre-tax pricing for core margin analysis unless business model requires tax-inclusive view.' },
      { q: 'Can this help retail pricing?', a: 'Yes, especially for SKU-level profitability checks.' },
      { q: 'How often should margins be reviewed?', a: 'Review with cost changes, supplier updates, and pricing campaigns.' },
      { q: 'What margin is considered healthy?', a: 'Healthy margin varies by industry, scale, and fixed-cost structure.' },
      { q: 'Can I compare products with this?', a: 'Yes. Margin analysis supports product mix and prioritization decisions.' },
    ],
    sections: [
      { title: 'Pricing Math Core', content: 'Margin calculation connects cost structure to sustainable pricing decisions.' },
      { title: 'Markup vs Margin Clarity', content: 'Using correct metric prevents pricing miscommunication and planning errors.' },
      { title: 'Promotion Sensitivity', content: 'Discount strategy should always be margin-aware to avoid hidden profitability loss.' },
      { title: 'Portfolio Profitability', content: 'Comparing margins across products guides mix optimization and resource allocation.' },
      { title: 'Continuous Repricing', content: 'Frequent cost updates are essential to preserve target profitability.' },
    ],
  },
  'discount-calculator': {
    howTo: 'Enter original price and discount percentage to compute savings amount and final payable price quickly.',
    formula: 'Savings = Original Price * Discount%. Final Price = Original Price - Savings.',
    faqs: [
      { q: 'How do I calculate discount amount?', a: 'Multiply original price by discount rate in decimal form.' },
      { q: 'How do stacked discounts work?', a: 'Apply sequentially, not by adding rates directly, because each applies to updated price.' },
      { q: 'Can tax be applied after discount?', a: 'Usually yes, depending on jurisdiction and product category rules.' },
      { q: 'Why is final price not matching store display?', a: 'Store rounding rules, coupon stacking limits, and taxable base differences can vary.' },
      { q: 'Can this compare two offers?', a: 'Yes. Compute effective final price for each offer and compare total outlay.' },
      { q: 'What is percent-off vs amount-off?', a: 'Percent-off scales with price, while fixed amount-off is constant regardless of base price.' },
      { q: 'How do coupons affect margin?', a: 'Discounts reduce revenue and may compress margin if not priced into strategy.' },
      { q: 'Can I reverse-calculate original price?', a: 'Yes. Original = Final / (1 - discount rate).' },
      { q: 'Should shipping be included in comparison?', a: 'Yes for true total cost comparison.' },
      { q: 'Is biggest discount always best?', a: 'Not necessarily. Final total after tax/fees determines best offer.' },
    ],
    sections: [
      { title: 'Promotion Arithmetic', content: 'Discount math supports transparent price comparison and purchase decisions.' },
      { title: 'Sequential Discount Behavior', content: 'Stacked discounts are multiplicative, not additive.' },
      { title: 'Tax and Fee Layer', content: 'Total checkout value should include taxes, shipping, and service fees.' },
      { title: 'Business Margin Context', content: 'Discounting strategy must be balanced against margin and inventory goals.' },
      { title: 'Consumer Decision Quality', content: 'Effective final-price analysis prevents misleading headline-discount bias.' },
    ],
  },
  'business-loan-calculator': {
    howTo: 'Enter loan amount, APR, term, and payment frequency to estimate periodic payment, total repayment, and financing cost for business borrowing.',
    formula: 'Amortized payment uses standard loan formula with periodic rate and term length assumptions.',
    faqs: [
      { q: 'What does business loan calculator show?', a: 'It estimates payment schedule, total cost, and borrowing burden under chosen terms.' },
      { q: 'Why is APR important?', a: 'APR helps compare offers by including effective annualized borrowing cost context.' },
      { q: 'Can repayment frequency change cost?', a: 'Yes. Weekly, biweekly, or monthly cycles can alter effective interest behavior.' },
      { q: 'Should fees be included?', a: 'Yes. Origination and servicing fees can change true effective financing cost.' },
      { q: 'Can this model term loans only?', a: 'Primarily yes; revolving credit products may require different modeling assumptions.' },
      { q: 'How does term length affect affordability?', a: 'Longer terms reduce periodic payment but can raise total interest paid.' },
      { q: 'Can extra principal improve outcomes?', a: 'Yes, prepaying principal can reduce total cost where prepayment terms allow.' },
      { q: 'Should revenue seasonality be considered?', a: 'Yes. Payment capacity should match business cash-flow seasonality.' },
      { q: 'Can this help lender comparison?', a: 'Yes, when all offers are normalized with consistent assumptions.' },
      { q: 'Is DSCR relevant here?', a: 'Yes. Debt service coverage ratio is often key in business credit decisions.' },
    ],
    sections: [
      { title: 'Borrowing Cost Transparency', content: 'Clear payment and total-cost projections support stronger financing decisions.' },
      { title: 'Cash-Flow Fit', content: 'Loan structure should align with operating-cycle cash generation.' },
      { title: 'Term vs Total Cost', content: 'Lower installments can hide higher lifetime financing burden.' },
      { title: 'Offer Normalization', content: 'Comparing APR, fees, and payment frequency together improves lender selection.' },
      { title: 'Risk Controls', content: 'Stress testing downturn scenarios improves repayment resilience planning.' },
    ],
  },
  'debt-ratio-calculator': {
    howTo: 'Enter debt obligations and income values to estimate debt ratio or debt-to-income ratio for affordability and risk checks.',
    formula: 'Debt Ratio = Total Debt / Total Assets (or DTI = Monthly Debt Payments / Gross Monthly Income).',
    faqs: [
      { q: 'What is debt ratio?', a: 'Debt ratio measures leverage level relative to assets or income depending on selected metric.' },
      { q: 'What is DTI?', a: 'Debt-to-income ratio measures monthly debt burden relative to gross monthly income.' },
      { q: 'Why do lenders care about DTI?', a: 'DTI indicates repayment capacity and potential default risk.' },
      { q: 'What is considered a healthy DTI?', a: 'Thresholds vary, but lower DTI generally indicates stronger affordability.' },
      { q: 'Can debt ratio be improved quickly?', a: 'Paying down high-interest balances and increasing income can improve ratios over time.' },
      { q: 'Should minimum payments or actual payments be used?', a: 'Use required obligations consistently for underwriting-style comparisons.' },
      { q: 'Can this be used for mortgage prep?', a: 'Yes. DTI checks are central to pre-qualification planning.' },
      { q: 'Does including recurring obligations matter?', a: 'Yes. Omitting obligations can understate risk and inflate affordability.' },
      { q: 'How often should ratios be recalculated?', a: 'Recalculate whenever debt balances or income levels change.' },
      { q: 'Can business and personal debt be mixed?', a: 'Keep categories separate unless lender methodology explicitly combines them.' },
    ],
    sections: [
      { title: 'Leverage Signal', content: 'Debt metrics summarize repayment pressure and financial flexibility.' },
      { title: 'Underwriting Relevance', content: 'Debt ratios are widely used in lending decisions and risk scoring.' },
      { title: 'Improvement Levers', content: 'Debt reduction and income growth are primary drivers of ratio improvement.' },
      { title: 'Measurement Consistency', content: 'Consistent definition and input scope are essential for meaningful trend tracking.' },
      { title: 'Decision Integration', content: 'Ratios should be interpreted with liquidity and cash-flow context, not in isolation.' },
    ],
  },
  'real-estate-calculator': {
    howTo: 'Enter property price, financing assumptions, rent/income, operating expenses, and appreciation assumptions to evaluate investment viability.',
    formula: 'Key outputs include NOI = Gross Income - Operating Expenses, cap rate = NOI / Property Value, and cash flow after financing.',
    faqs: [
      { q: 'What does real-estate calculator estimate?', a: 'It estimates cash flow, return metrics, and affordability under property-investment assumptions.' },
      { q: 'What is NOI?', a: 'NOI is net operating income before financing costs and taxes.' },
      { q: 'What is cap rate?', a: 'Cap rate is NOI divided by property value, a snapshot yield indicator.' },
      { q: 'Should vacancy be included?', a: 'Yes. Vacancy assumptions are critical for realistic rental-income projections.' },
      { q: 'Can maintenance reserve matter?', a: 'Yes. Underestimating reserves can overstate projected returns.' },
      { q: 'How does financing change returns?', a: 'Leverage can amplify both upside and downside in cash-on-cash outcomes.' },
      { q: 'Can appreciation be guaranteed?', a: 'No. Appreciation assumptions are uncertain and location-cycle dependent.' },
      { q: 'What is cash-on-cash return?', a: 'It measures annual pre-tax cash flow relative to cash invested.' },
      { q: 'Should taxes be modeled separately?', a: 'Yes. Property tax and income tax treatments can materially change net return.' },
      { q: 'How often should assumptions be reviewed?', a: 'Review periodically with market rent, expense inflation, and financing changes.' },
    ],
    sections: [
      { title: 'Income Property Core Metrics', content: 'NOI, cap rate, and cash flow provide foundational visibility into deal quality.' },
      { title: 'Expense Realism', content: 'Maintenance, vacancy, management, and tax assumptions determine projection credibility.' },
      { title: 'Leverage Dynamics', content: 'Debt structure strongly influences risk-adjusted return profile.' },
      { title: 'Scenario-Based Underwriting', content: 'Conservative/base/upside scenarios improve investment resilience.' },
      { title: 'Execution and Monitoring', content: 'Ongoing performance tracking ensures assumptions stay aligned with reality.' },
    ],
  },
  'take-home-pay-calculator': {
    howTo: 'Enter gross salary and estimated federal/state/payroll deduction rates to estimate net annual, monthly, and per-paycheck take-home income.',
    formula: 'Net Pay = Gross Pay - taxes - payroll deductions. Effective tax burden is deductions divided by gross pay.',
    faqs: [
      { q: 'What is take-home pay?', a: 'Take-home pay is net income received after taxes and payroll deductions.' },
      { q: 'Why is net pay lower than salary?', a: 'Income tax, payroll tax, and benefit deductions reduce gross compensation.' },
      { q: 'Can this include retirement contributions?', a: 'Yes, include pre-tax/post-tax deduction assumptions where relevant.' },
      { q: 'How does filing status affect net pay?', a: 'Withholding and tax liability can vary materially by filing status and dependents.' },
      { q: 'Should bonuses be modeled separately?', a: 'Yes. Bonus withholding and taxation can differ from regular salary cycles.' },
      { q: 'Can state taxes be zero?', a: 'Some jurisdictions have no state income tax, but other local taxes may still apply.' },
      { q: 'How accurate are paycheck estimates?', a: 'They are approximate and depend on withholding assumptions and deduction detail.' },
      { q: 'Can this support budgeting?', a: 'Yes. Net-pay estimates are essential for realistic monthly budget planning.' },
      { q: 'Why do two employees with same salary differ?', a: 'Benefits elections, withholding settings, location, and credits can differ.' },
      { q: 'How often should net-pay assumptions be updated?', a: 'Update after compensation, tax-rule, or benefits changes.' },
    ],
    sections: [
      { title: 'Gross-to-Net Translation', content: 'Converting salary to net cash flow is central to practical financial planning.' },
      { title: 'Deduction Visibility', content: 'Understanding tax and benefit components improves paycheck forecasting accuracy.' },
      { title: 'Budget Integration', content: 'Net-pay outputs should drive spending, saving, and debt-allocation targets.' },
      { title: 'Scenario Sensitivity', content: 'Testing filing status and deduction alternatives helps optimize cash flow.' },
      { title: 'Payroll Reconciliation', content: 'Cross-checking calculator estimates with paystubs improves planning reliability.' },
    ],
  },
  'personal-loan-calculator': {
    howTo: 'Enter loan amount, APR, term, and optional fees to estimate monthly payment, total interest, and full repayment cost.',
    formula: 'Amortized payment formula with periodic rate and payment count estimates installment amount and total cost.',
    faqs: [
      { q: 'What is a personal loan?', a: 'A personal loan is usually unsecured installment debt repaid in fixed periodic payments.' },
      { q: 'How does APR affect payment?', a: 'Higher APR increases monthly payment and total interest cost for the same term.' },
      { q: 'Can fees change effective cost?', a: 'Yes. Origination and servicing fees can materially increase true borrowing cost.' },
      { q: 'Should I choose shorter term?', a: 'Shorter terms raise payment but usually reduce total interest paid.' },
      { q: 'Can extra payments help?', a: 'Yes, prepaying principal can lower total interest and shorten payoff timeline.' },
      { q: 'Is secured loan better than unsecured?', a: 'Secured loans may offer lower rates but require collateral and related risk.' },
      { q: 'Can this compare two offers?', a: 'Yes. Compare payment, total paid, fees, and break-even implications.' },
      { q: 'How often should I refinance personal debt?', a: 'Refinance when net savings justify fees and term structure aligns with goals.' },
      { q: 'Does credit score impact personal-loan rate?', a: 'Yes. Stronger credit typically improves pricing and approval terms.' },
      { q: 'Should emergency buffer come before prepayment?', a: 'Often yes, to reduce risk of re-borrowing during financial shocks.' },
    ],
    sections: [
      { title: 'Installment Debt Structure', content: 'Personal loans convert one-time borrowing into predictable scheduled repayment.' },
      { title: 'Rate and Fee Transparency', content: 'APR plus upfront fees determines effective financing cost.' },
      { title: 'Term Selection Trade-Off', content: 'Payment affordability and total-cost minimization must be balanced intentionally.' },
      { title: 'Prepayment Strategy', content: 'Additional principal payments can accelerate debt freedom.' },
      { title: 'Offer Comparison Discipline', content: 'Standardized side-by-side comparison improves borrowing decisions.' },
    ],
  },
  'boat-loan-calculator': {
    howTo: 'Enter boat price, down payment, APR, term, and fees to estimate monthly financing cost and total ownership financing burden.',
    formula: 'Standard amortized-loan math estimates periodic payment and cumulative interest cost.',
    faqs: [
      { q: 'How is boat financing different from auto loans?', a: 'Boat loans may have different terms, collateral rules, and insurance requirements.' },
      { q: 'Does down payment reduce cost?', a: 'Yes. Higher down payment lowers financed principal and interest expense.' },
      { q: 'Are longer terms common?', a: 'Some lenders offer longer terms, which can lower payment but raise total interest.' },
      { q: 'Should maintenance be included in budgeting?', a: 'Yes. Ownership costs include storage, maintenance, fuel, and insurance.' },
      { q: 'Can variable rates apply?', a: 'Some products may have variable-rate exposure; assumptions should reflect contract terms.' },
      { q: 'Is refinancing possible later?', a: 'Yes, if market rates and credit profile support better terms.' },
      { q: 'Can fees materially change total cost?', a: 'Yes. Documentation and lender fees should be included in comparisons.' },
      { q: 'Should seasonal usage influence financing decision?', a: 'Yes. Seasonal assets require realistic annual cash-flow planning.' },
      { q: 'Can this compare buying used vs new?', a: 'Yes by adjusting price, rate, and expected holding-period assumptions.' },
      { q: 'How to validate affordability?', a: 'Include full ownership costs, not only loan payment, in budget checks.' },
    ],
    sections: [
      { title: 'Marine Financing Basics', content: 'Boat loans combine asset financing with ongoing operational cost obligations.' },
      { title: 'Cash-Flow Realism', content: 'Ownership affordability depends on financing plus maintenance ecosystem.' },
      { title: 'Term and Cost Dynamics', content: 'Lower monthly payment from longer terms can hide larger total financing burden.' },
      { title: 'Risk and Liquidity', content: 'Seasonal assets require stronger reserve planning and conservative assumptions.' },
      { title: 'Decision Validation', content: 'Compare alternatives with full lifecycle cost perspective before committing.' },
    ],
  },
  'lease-calculator': {
    howTo: 'Enter asset value, residual assumptions, lease term, and financing parameters to estimate periodic lease payment and total lease outlay.',
    formula: 'Lease payment combines depreciation component and finance charge over lease period with fee/tax adjustments.',
    faqs: [
      { q: 'What is a lease calculator used for?', a: 'It estimates recurring lease payment and total contract cost under specified terms.' },
      { q: 'What is residual value in leasing?', a: 'Residual value is projected asset value at lease-end and key payment driver.' },
      { q: 'Can lease payment be negotiated?', a: 'Yes, payment depends on negotiated price, residual assumptions, and financing terms.' },
      { q: 'How do fees affect lease cost?', a: 'Acquisition, disposition, and miscellaneous fees can materially increase effective cost.' },
      { q: 'Is lease better than buy?', a: 'It depends on usage pattern, holding horizon, and total-cost comparison.' },
      { q: 'Can mileage or usage limits matter?', a: 'Yes. Over-limit penalties can significantly increase final expense.' },
      { q: 'Should upfront payment be high?', a: 'Large upfront cash lowers monthly figure but may increase risk if asset is lost early.' },
      { q: 'Can tax treatment vary?', a: 'Yes. Lease tax rules vary by jurisdiction and use case.' },
      { q: 'How to compare lease offers fairly?', a: 'Normalize term, residual, fees, and effective financing assumptions.' },
      { q: 'What should be checked before signing?', a: 'Review end-of-lease charges, usage rules, and termination clauses carefully.' },
    ],
    sections: [
      { title: 'Lease Cost Decomposition', content: 'Understanding depreciation and financing pieces improves quote transparency.' },
      { title: 'Contract Risk Points', content: 'Usage limits, end-of-term fees, and termination clauses drive hidden cost risk.' },
      { title: 'Offer Normalization', content: 'Comparable assumptions are essential when choosing between lease options.' },
      { title: 'Lifecycle Perspective', content: 'Evaluate total lease outlay over horizon rather than monthly payment alone.' },
      { title: 'Buy-vs-Lease Lens', content: 'Strategic choice should reflect expected usage and ownership preference.' },
    ],
  },
  'refinance-calculator': {
    howTo: 'Enter current balance, existing rate, proposed new rate, term, and closing costs to estimate monthly savings and refinance break-even period.',
    formula: 'Break-even months ~= Closing Costs / Monthly Savings. Payment values estimated from old/new amortization assumptions.',
    faqs: [
      { q: 'What is refinancing?', a: 'Refinancing replaces an existing loan with a new one, often to reduce rate or adjust term.' },
      { q: 'How do I know if refinance is worth it?', a: 'Compare monthly savings and total interest change against all refinance costs.' },
      { q: 'What is break-even point?', a: 'Break-even is when cumulative savings exceed refinancing costs.' },
      { q: 'Can lower payment still cost more overall?', a: 'Yes, especially if term is extended significantly.' },
      { q: 'Should I include appraisal and closing fees?', a: 'Yes. Full cost inclusion is necessary for valid refinance decision.' },
      { q: 'Does credit score affect refinance rate?', a: 'Yes. Better credit often improves available pricing and terms.' },
      { q: 'Can cash-out refinance change risk?', a: 'Yes. Cash-out increases principal and may raise long-term cost exposure.' },
      { q: 'How does rate-drop threshold work?', a: 'No fixed threshold fits all; decision depends on costs, horizon, and payment goals.' },
      { q: 'Can refinancing shorten payoff?', a: 'Yes, if you choose shorter term or maintain old payment level after refinancing.' },
      { q: 'How often to reevaluate refinance?', a: 'Reevaluate with meaningful rate shifts or financial-profile improvements.' },
    ],
    sections: [
      { title: 'Cost-Savings Framework', content: 'Refinance decisions should be based on net present economic benefit, not rate alone.' },
      { title: 'Break-Even Discipline', content: 'Holding horizon relative to break-even month is critical for decision quality.' },
      { title: 'Term Structure Effects', content: 'Term reset can improve cash flow but may increase lifetime interest.' },
      { title: 'Risk and Liquidity', content: 'Closing-cost funding and cash-out choices affect future flexibility.' },
      { title: 'Execution Checklist', content: 'Compare multiple offers and verify all fee components before commitment.' },
    ],
  },
  'budget-calculator': {
    howTo: 'Enter monthly income and expense categories to estimate cash surplus/deficit and evaluate allocation targets for savings, debt, and discretionary spending.',
    formula: 'Net Cash Flow = Total Income - Total Expenses. Savings Rate = Savings / Income.',
    faqs: [
      { q: 'What is a budget calculator for?', a: 'It helps organize income and expenses to track surplus, deficits, and saving capacity.' },
      { q: 'Should expenses be fixed and variable?', a: 'Yes. Separating fixed and variable costs improves control and planning.' },
      { q: 'What is a good savings rate?', a: 'Target depends on goals and timeline, but consistent positive savings is key.' },
      { q: 'How can I cut spending effectively?', a: 'Focus on high-impact categories first, then automate recurring controls.' },
      { q: 'Should debt payments be separate category?', a: 'Yes. Debt obligations should be explicitly tracked for repayment planning.' },
      { q: 'Can irregular income be handled?', a: 'Yes by using conservative baseline income and buffer-focused budgeting.' },
      { q: 'How often should budget be updated?', a: 'Monthly review is typical, with interim updates after major changes.' },
      { q: 'What if expenses exceed income?', a: 'Prioritize essentials, reduce discretionary categories, and redesign debt strategy.' },
      { q: 'Can this support goal-based planning?', a: 'Yes. Assign portions of surplus to emergency fund, debt payoff, and investments.' },
      { q: 'Why does tracking improve outcomes?', a: 'Visibility improves decision quality and accountability over time.' },
    ],
    sections: [
      { title: 'Cash-Flow Visibility', content: 'Budgeting converts scattered transactions into actionable financial control signals.' },
      { title: 'Priority Allocation', content: 'Clear category priorities improve consistency in saving and debt reduction.' },
      { title: 'Variance Monitoring', content: 'Monthly variance tracking reveals where plan and reality diverge.' },
      { title: 'Goal Linkage', content: 'Budget outputs should connect directly to short- and long-term financial goals.' },
      { title: 'Behavioral Reinforcement', content: 'Simple repeatable budgeting habits typically outperform complex unsustained systems.' },
    ],
  },
  'rental-property-calculator': {
    howTo: 'Enter purchase price, financing terms, rent assumptions, vacancy, and operating expenses to estimate NOI, cash flow, and investment return metrics.',
    formula: 'NOI = Gross Rental Income - Operating Expenses. Cash flow adds financing effects. Cap Rate = NOI / Property Value.',
    faqs: [
      { q: 'What does rental property calculator show?', a: 'It estimates income-property cash flow and return metrics from rent and cost assumptions.' },
      { q: 'Should vacancy be included?', a: 'Yes. Vacancy and collection loss assumptions are essential for realistic projections.' },
      { q: 'What expenses matter most?', a: 'Taxes, insurance, maintenance, management, and turnover costs often drive outcomes.' },
      { q: 'What is cap rate vs cash-on-cash?', a: 'Cap rate ignores financing; cash-on-cash includes leverage effects on invested cash.' },
      { q: 'Can appreciation be added?', a: 'Yes, but treat appreciation as uncertain scenario variable, not guaranteed return.' },
      { q: 'How does financing affect risk?', a: 'Leverage can raise return variability and downside exposure during income shocks.' },
      { q: 'Should maintenance reserve be fixed?', a: 'Reserve assumptions should reflect asset age, market, and expected lifecycle repairs.' },
      { q: 'Can this compare two properties?', a: 'Yes, if assumptions are standardized for side-by-side analysis.' },
      { q: 'How often should projections be updated?', a: 'Update with market rent, expense inflation, tax, and financing changes.' },
      { q: 'What validates final investment decision?', a: 'Combine calculator outputs with inspection, legal review, and local market due diligence.' },
    ],
    sections: [
      { title: 'Income-Expense Engine', content: 'Reliable rental underwriting starts with conservative income and complete expense capture.' },
      { title: 'Leverage and Return Profile', content: 'Debt structure shapes both expected return and downside risk.' },
      { title: 'Resilience Stress Tests', content: 'Vacancy and maintenance stress cases help avoid fragile investment assumptions.' },
      { title: 'Market Benchmarking', content: 'Comparable rent and cap-rate context improves acquisition quality.' },
      { title: 'Ongoing Asset Management', content: 'Post-purchase monitoring is essential to preserve projected performance.' },
    ],
  },
  'roi-calculator': {
    howTo: 'Enter investment cost and expected or realized return value to calculate ROI percentage and profit amount.',
    formula: 'ROI = (Gain - Cost) / Cost * 100.',
    faqs: [
      { q: 'What is ROI?', a: 'ROI measures return relative to invested cost.' },
      { q: 'Can ROI be negative?', a: 'Yes, if value returned is below invested amount.' },
      { q: 'Does ROI include time?', a: 'Basic ROI does not; annualized metrics are needed for time-aware comparisons.' },
      { q: 'Can ROI compare projects?', a: 'Yes, but use consistent assumptions and horizon.' },
      { q: 'Should fees be included?', a: 'Yes, include all costs for realistic ROI.' },
      { q: 'Is high ROI always better?', a: 'Not if risk is materially higher.' },
      { q: 'What is annualized ROI?', a: 'It converts total return to equivalent yearly rate.' },
      { q: 'Can taxes change ROI?', a: 'Yes, after-tax ROI can differ significantly.' },
      { q: 'Can leverage inflate ROI?', a: 'Yes, leverage can amplify gains and losses.' },
      { q: 'How often should ROI be reviewed?', a: 'Review after major market and cash-flow changes.' },
    ],
    sections: [
      { title: 'Return Baseline Metric', content: 'ROI offers quick profitability signal for decisions.' },
      { title: 'Cost Completeness', content: 'Hidden costs can distort ROI if omitted.' },
      { title: 'Risk Context', content: 'ROI should be interpreted with volatility and downside risk.' },
      { title: 'Time Normalization', content: 'Annualized comparisons improve fairness across horizons.' },
      { title: 'Decision Use', content: 'Use ROI as one input with strategic context.' },
    ],
  },
  'apr-calculator': {
    howTo: 'Enter loan amount, fees, rate, and term assumptions to estimate annual percentage rate and compare lending offers.',
    formula: 'APR approximates effective annual borrowing cost including interest and qualifying fees.',
    faqs: [
      { q: 'What is APR?', a: 'APR is broader borrowing-cost metric beyond nominal rate.' },
      { q: 'Why APR differs from rate?', a: 'APR includes eligible fees and financing costs.' },
      { q: 'Is lower APR always better?', a: 'Usually yes for cost, assuming comparable terms.' },
      { q: 'Can term affect APR interpretation?', a: 'Yes, same APR may still produce different cash-flow profiles.' },
      { q: 'Should closing costs be included?', a: 'Yes for accurate offer comparison.' },
      { q: 'Can APR change with credit score?', a: 'Yes, qualification profile affects offered terms.' },
      { q: 'Is APR useful for mortgages only?', a: 'No, it is useful for many installment products.' },
      { q: 'Can teaser rates mislead?', a: 'Yes, APR helps surface total cost better than headline rates.' },
      { q: 'Can APR compare variable-rate loans?', a: 'Use caution; future rate changes can alter realized cost.' },
      { q: 'How often should offers be recalculated?', a: 'Recalculate with updated fee sheets and terms.' },
    ],
    sections: [
      { title: 'True Borrowing Cost Lens', content: 'APR improves transparency across lenders.' },
      { title: 'Fee Inclusion Impact', content: 'Fees can materially alter effective cost.' },
      { title: 'Offer Normalization', content: 'Compare products under matched assumptions.' },
      { title: 'Cash-Flow vs Cost', content: 'Monthly affordability and lifetime cost both matter.' },
      { title: 'Validation', content: 'Use official disclosures for final decisions.' },
    ],
  },
  'present-value-calculator': {
    howTo: 'Enter future value, discount rate, and time horizon to estimate what future cash flow is worth in today\'s terms.',
    formula: 'PV = FV / (1+r)^n.',
    faqs: [
      { q: 'What is present value?', a: 'Present value is today\'s value of future money after discounting.' },
      { q: 'Why discount future cash?', a: 'Money today can earn returns, so future cash is worth less now.' },
      { q: 'How does rate affect PV?', a: 'Higher discount rate lowers present value.' },
      { q: 'Can PV be used in project appraisal?', a: 'Yes, PV is central to investment valuation.' },
      { q: 'What is discount rate choice?', a: 'Use required return or opportunity cost assumption.' },
      { q: 'Can inflation be embedded?', a: 'Yes via nominal/real consistency.' },
      { q: 'Can multiple cash flows be valued?', a: 'Yes, by summing discounted values of each period.' },
      { q: 'Is PV same as NPV?', a: 'NPV is sum of PVs minus initial investment.' },
      { q: 'Can period mismatch break result?', a: 'Yes, ensure rate and period units align.' },
      { q: 'Where is PV commonly used?', a: 'Loans, bonds, capital budgeting, and retirement planning.' },
    ],
    sections: [
      { title: 'Time Value Core', content: 'PV translates future amounts into current value terms.' },
      { title: 'Discount Rate Sensitivity', content: 'Rate assumptions dominate valuation outputs.' },
      { title: 'Period Consistency', content: 'Aligned units are required for valid estimates.' },
      { title: 'Decision Framework', content: 'PV helps rank alternatives with different timing.' },
      { title: 'Model Discipline', content: 'Scenario testing improves robustness.' },
    ],
  },
  'future-value-calculator': {
    howTo: 'Enter present amount, return rate, and horizon to project future accumulated value with or without periodic contributions.',
    formula: 'FV = PV*(1+r)^n (plus contribution term where applicable).',
    faqs: [
      { q: 'What is future value?', a: 'Future value is projected amount after growth over time.' },
      { q: 'How do contributions change FV?', a: 'Regular deposits can significantly increase final value.' },
      { q: 'Why compounding matters?', a: 'Compounding accelerates growth over longer horizons.' },
      { q: 'Can this include inflation?', a: 'Yes by comparing nominal and real assumptions.' },
      { q: 'Should returns be constant?', a: 'Use multiple scenarios to reflect uncertainty.' },
      { q: 'Can fees reduce FV?', a: 'Yes, net return assumptions should include cost drag.' },
      { q: 'What horizon should I use?', a: 'Match horizon to actual goal timeline.' },
      { q: 'Is FV guaranteed?', a: 'No, projection depends on assumptions.' },
      { q: 'Can this be used for retirement?', a: 'Yes, FV is a core retirement planning tool.' },
      { q: 'How often to refresh assumptions?', a: 'Refresh periodically with market and goal changes.' },
    ],
    sections: [
      { title: 'Growth Projection Logic', content: 'FV models time and rate compounding effects.' },
      { title: 'Contribution Discipline', content: 'Regular investing boosts long-term outcomes.' },
      { title: 'Real vs Nominal View', content: 'Purchasing power analysis improves realism.' },
      { title: 'Uncertainty Management', content: 'Scenario ranges reduce overconfidence.' },
      { title: 'Goal Alignment', content: 'Tie assumptions to objective timelines.' },
    ],
  },
  'commission-calculator': {
    howTo: 'Enter sales amount and commission rate to compute commission earned, with optional base salary or tier assumptions.',
    formula: 'Commission = Sales * Rate (tiered plans apply piecewise rates).',
    faqs: [
      { q: 'What is commission?', a: 'Commission is variable compensation tied to sales performance.' },
      { q: 'How are tiered commissions calculated?', a: 'Different sales bands apply different rates.' },
      { q: 'Can draw against commission be included?', a: 'Yes in scenario planning when applicable.' },
      { q: 'Should refunds be included?', a: 'Yes, clawbacks can reduce net commission.' },
      { q: 'What is effective commission rate?', a: 'Total commission divided by total sales.' },
      { q: 'Can base salary be added?', a: 'Yes for total compensation projection.' },
      { q: 'How often to reconcile commission?', a: 'Typically per payroll cycle or closing period.' },
      { q: 'Can taxes materially reduce payout?', a: 'Yes, net commission may differ significantly.' },
      { q: 'Can this compare compensation plans?', a: 'Yes with standardized sales scenarios.' },
      { q: 'What avoids dispute risk?', a: 'Clear plan definitions and documented deal attribution.' },
    ],
    sections: [
      { title: 'Variable Pay Mechanics', content: 'Commission links performance to compensation.' },
      { title: 'Plan Structure Effects', content: 'Tier and threshold design affects payout slope.' },
      { title: 'Net Payout Awareness', content: 'Taxes and clawbacks matter for take-home.' },
      { title: 'Scenario Comparison', content: 'Modeling volumes improves plan evaluation.' },
      { title: 'Reconciliation Discipline', content: 'Regular validation reduces errors and disputes.' },
    ],
  },
  'payback-period-calculator': {
    howTo: 'Enter initial investment and expected periodic cash inflows to estimate time needed to recover invested capital.',
    formula: 'Payback period is first time cumulative cash inflow equals initial outflow.',
    faqs: [
      { q: 'What is payback period?', a: 'It is the time required to recover initial investment cost.' },
      { q: 'Does payback include time value of money?', a: 'Basic payback does not; discounted payback does.' },
      { q: 'Is shorter payback always better?', a: 'Shorter reduces risk but may ignore long-run profitability.' },
      { q: 'Can irregular cash flows be used?', a: 'Yes with cumulative-period simulation.' },
      { q: 'How is partial year handled?', a: 'Interpolate within period when recovery occurs.' },
      { q: 'Can payback rank projects?', a: 'It can screen projects, but use NPV/IRR for fuller ranking.' },
      { q: 'Does payback ignore terminal value?', a: 'Yes, traditional payback ignores post-recovery cash flows.' },
      { q: 'Can risk be reflected?', a: 'Use conservative cash-flow assumptions and scenario tests.' },
      { q: 'Is discounted payback preferable?', a: 'Often yes for capital-cost-aware decisions.' },
      { q: 'Where is payback most useful?', a: 'Early-stage screening and liquidity-focused decisions.' },
    ],
    sections: [
      { title: 'Capital Recovery Lens', content: 'Payback highlights liquidity recovery speed.' },
      { title: 'Method Limitation', content: 'Ignoring post-payback returns can mislead.' },
      { title: 'Discounted Variant', content: 'Discounted payback improves realism.' },
      { title: 'Scenario Testing', content: 'Cash-flow uncertainty should be stress tested.' },
      { title: 'Decision Integration', content: 'Use with NPV/IRR for balanced appraisal.' },
    ],
  },
  'down-payment-calculator': {
    howTo: 'Enter purchase price and down-payment percentage (or amount) to compute upfront cash requirement and resulting loan principal.',
    formula: 'Down Payment = Price * Percent. Loan Amount = Price - Down Payment.',
    faqs: [
      { q: 'Why does down payment matter?', a: 'It reduces borrowing need and often improves loan terms.' },
      { q: 'Is 20% always required?', a: 'No, requirements vary by loan program and eligibility.' },
      { q: 'Can larger down payment lower monthly cost?', a: 'Yes, principal and interest burden typically decline.' },
      { q: 'Does down payment affect PMI?', a: 'Yes, lower LTV can reduce or eliminate mortgage insurance.' },
      { q: 'Should reserves be kept after down payment?', a: 'Yes, emergency reserves are important for stability.' },
      { q: 'Can gifts be used for down payment?', a: 'Some programs allow gifts with documentation rules.' },
      { q: 'Is closing cost included?', a: 'Down-payment tools may exclude closing costs unless specified.' },
      { q: 'Can this compare multiple targets?', a: 'Yes, scenario testing across percentages is useful.' },
      { q: 'Does down payment change approval odds?', a: 'It can strengthen profile by lowering lender risk.' },
      { q: 'How often should targets be revised?', a: 'Revise with price/rate movement and savings progress.' },
    ],
    sections: [
      { title: 'LTV and Risk Profile', content: 'Down payment determines leverage and lender risk view.' },
      { title: 'Payment Impact', content: 'Higher upfront equity lowers long-term financing burden.' },
      { title: 'Liquidity Balance', content: 'Avoid overcommitting cash at the expense of reserves.' },
      { title: 'Program Strategy', content: 'Compare loan types and insurance outcomes by LTV level.' },
      { title: 'Planning Cadence', content: 'Track savings trajectory against market movement.' },
    ],
  },
  'irr-calculator': {
    howTo: 'Enter initial investment and periodic cash flows to estimate IRR, the discount rate that sets project NPV to zero.',
    formula: 'IRR solves: 0 = sum(CF_t / (1+r)^t).',
    faqs: [
      { q: 'What is IRR?', a: 'IRR is implied return rate that zeroes net present value.' },
      { q: 'Why can IRR be misleading?', a: 'Multiple sign changes in cash flows can create multiple IRRs.' },
      { q: 'How does IRR compare to hurdle rate?', a: 'Projects with IRR above hurdle may be acceptable, all else equal.' },
      { q: 'Can IRR compare project sizes?', a: 'Not reliably alone; NPV captures absolute value creation.' },
      { q: 'Does timing of cash flows matter?', a: 'Yes, earlier inflows typically increase IRR.' },
      { q: 'Can IRR be negative?', a: 'Yes, when project fails to recover cost in discounted terms.' },
      { q: 'Should reinvestment assumption be considered?', a: 'Yes, IRR has reinvestment interpretation limitations.' },
      { q: 'When is MIRR preferable?', a: 'MIRR can address some IRR reinvestment issues.' },
      { q: 'Is IRR enough for approval?', a: 'No, combine with NPV, payback, and risk analysis.' },
      { q: 'Can non-periodic cash flows be used?', a: 'Use XIRR-style methods for irregular timing.' },
    ],
    sections: [
      { title: 'Discount-Rate Interpretation', content: 'IRR summarizes project return intensity in a single rate.' },
      { title: 'Cash-Flow Pattern Risk', content: 'Nonstandard cash-flow signs can produce ambiguous IRR outputs.' },
      { title: 'NPV Pairing', content: 'IRR should be interpreted with NPV for value magnitude context.' },
      { title: 'Hurdle-Rate Screening', content: 'IRR is useful for quick acceptance/rejection checks.' },
      { title: 'Advanced Variants', content: 'MIRR/XIRR approaches improve realism in certain cases.' },
    ],
  },
  'fha-loan-calculator': {
    howTo: 'Enter home price, down payment, FHA rate assumptions, term, and mortgage-insurance inputs to estimate monthly FHA payment and total cost.',
    formula: 'Payment uses standard mortgage amortization plus FHA-specific insurance components where applicable.',
    faqs: [
      { q: 'What is an FHA loan?', a: 'FHA is government-insured mortgage program with specific underwriting and insurance rules.' },
      { q: 'Can FHA require lower down payment?', a: 'Yes, eligible borrowers may qualify with lower down-payment thresholds.' },
      { q: 'What is mortgage insurance in FHA?', a: 'FHA loans include upfront and/or annual mortgage-insurance costs depending on program terms.' },
      { q: 'Can FHA be refinanced later?', a: 'Yes, refinance options may exist based on eligibility and market conditions.' },
      { q: 'Is FHA only for first-time buyers?', a: 'No, eligibility is broader but subject to program criteria.' },
      { q: 'Do loan limits matter?', a: 'Yes, FHA borrowing limits vary by area and property type.' },
      { q: 'Can credit score affect FHA terms?', a: 'Yes, score and profile influence approval and pricing outcomes.' },
      { q: 'Should taxes and insurance be included?', a: 'Yes, complete housing-cost estimate should include recurring non-principal items.' },
      { q: 'How does term length impact cost?', a: 'Longer terms reduce payment but can increase lifetime interest and insurance outlay.' },
      { q: 'Can this replace lender quote?', a: 'No. Use it for planning and compare with official lender disclosures.' },
    ],
    sections: [
      { title: 'Program-Specific Costing', content: 'FHA analysis should include mortgage-insurance structure, not only rate and principal.' },
      { title: 'Affordability Profile', content: 'Lower upfront requirements can improve access while changing long-run cost profile.' },
      { title: 'Limit and Eligibility Effects', content: 'Local limits and underwriting criteria constrain feasible borrowing amount.' },
      { title: 'Refinance Path Consideration', content: 'Future refinance strategy can influence initial FHA decision quality.' },
      { title: 'Full Payment Visibility', content: 'Total housing payment context improves realistic budgeting.' },
    ],
  },
  'va-mortgage-calculator': {
    howTo: 'Enter property price, funding-fee assumptions, rate, and term to estimate VA-style mortgage payment and total financing cost.',
    formula: 'VA payment estimation applies amortization plus program-specific fee assumptions where financed.',
    faqs: [
      { q: 'What is a VA mortgage?', a: 'VA mortgages are eligible veteran-focused home loans with specific program benefits and rules.' },
      { q: 'Is down payment always required?', a: 'Many VA structures allow low or no down payment for qualified borrowers.' },
      { q: 'What is VA funding fee?', a: 'It is program fee that may be financed or paid upfront depending on eligibility and category.' },
      { q: 'Can funding-fee exemption apply?', a: 'Some borrowers may qualify for exemptions under program criteria.' },
      { q: 'Does VA eliminate all mortgage costs?', a: 'No. Taxes, insurance, and closing costs still matter for full affordability.' },
      { q: 'Can VA loan be refinanced?', a: 'Yes, refinance options may be available based on eligibility and lender terms.' },
      { q: 'Are loan limits relevant?', a: 'Entitlement and property-value context can influence financing structure.' },
      { q: 'Can credit profile still matter?', a: 'Yes, lender overlays and borrower profile can affect offer terms.' },
      { q: 'Should monthly payment include escrow items?', a: 'Yes for realistic all-in housing cost planning.' },
      { q: 'Can this replace lender prequalification?', a: 'No, it is scenario planning support only.' },
    ],
    sections: [
      { title: 'Veteran-Focused Financing', content: 'VA tools should reflect funding-fee and entitlement considerations.' },
      { title: 'Cash-to-Close Dynamics', content: 'Low down-payment structures alter upfront cash and long-term cost trade-offs.' },
      { title: 'Program Fee Sensitivity', content: 'Funding-fee treatment can materially shift effective financing burden.' },
      { title: 'Offer Comparison', content: 'Compare VA scenarios with alternatives using full-payment lens.' },
      { title: 'Execution Planning', content: 'Use estimate output with lender and eligibility documentation workflows.' },
    ],
  },
  'home-equity-loan-calculator': {
    howTo: 'Enter home value, outstanding mortgage balance, target borrowing amount, rate, and term to estimate payment and equity utilization.',
    formula: 'Available equity ~= Home Value - Mortgage Balance; loan payment estimated via amortization formula.',
    faqs: [
      { q: 'What is a home equity loan?', a: 'It is a fixed-term loan secured by home equity, typically with fixed payment schedule.' },
      { q: 'How much can I borrow?', a: 'Borrowing depends on lender LTV/CLTV limits and your credit/income profile.' },
      { q: 'Is rate fixed or variable?', a: 'Home equity loans are often fixed-rate; verify product terms.' },
      { q: 'Can equity borrowing be risky?', a: 'Yes, home is collateral, so repayment stress carries significant consequence.' },
      { q: 'Should closing costs be included?', a: 'Yes, include all fees for net-benefit evaluation.' },
      { q: 'Can this be used for debt consolidation?', a: 'Yes, but compare savings versus collateral risk carefully.' },
      { q: 'How does CLTV matter?', a: 'Combined loan-to-value affects approval and pricing boundaries.' },
      { q: 'Can refinancing compete with equity loan?', a: 'Yes, compare with cash-out refinance scenarios.' },
      { q: 'Should I prepay equity loan?', a: 'Extra principal can reduce interest if terms allow.' },
      { q: 'How often should equity assumptions be updated?', a: 'Update with home-value and mortgage-balance changes.' },
    ],
    sections: [
      { title: 'Equity Access Mechanics', content: 'Home equity loans convert accumulated property value into fixed repayment debt.' },
      { title: 'Collateral Risk Awareness', content: 'Using home-secured borrowing requires conservative payment planning.' },
      { title: 'LTV Constraint Management', content: 'Borrowing capacity is tightly linked to lender valuation and ratio limits.' },
      { title: 'Use-of-Proceeds Evaluation', content: 'Compare expected benefit against financing cost and downside exposure.' },
      { title: 'Alternative Strategy Check', content: 'Evaluate HELOC and refinance options before final selection.' },
    ],
  },
  'heloc-calculator': {
    howTo: 'Enter credit line, draw amount, variable-rate assumptions, draw period, and repayment period to estimate HELOC payment behavior over phases.',
    formula: 'HELOC may have interest-only draw payments, then amortized repayment after draw period ends.',
    faqs: [
      { q: 'What is HELOC?', a: 'HELOC is revolving home-equity credit line secured by property value.' },
      { q: 'How is HELOC different from home equity loan?', a: 'HELOC is revolving and often variable-rate; home equity loan is usually fixed-term installment.' },
      { q: 'What is draw period?', a: 'Draw period allows borrowing and often interest-only payments.' },
      { q: 'What happens in repayment period?', a: 'New draws stop and payments often increase as principal amortization begins.' },
      { q: 'Can variable rate increase payment risk?', a: 'Yes, rising rates can materially increase required payment.' },
      { q: 'Should utilization stay low?', a: 'Managing utilization can reduce risk and preserve line flexibility.' },
      { q: 'Can HELOC be used for renovations?', a: 'Yes, commonly used for home improvements and staged expenses.' },
      { q: 'Are fees important?', a: 'Yes, annual, draw, and closing-related fees affect net economics.' },
      { q: 'Can HELOC be refinanced?', a: 'Yes, depending on lender terms and market conditions.' },
      { q: 'How to stress test HELOC?', a: 'Model higher-rate scenarios and repayment-phase payment step-up.' },
    ],
    sections: [
      { title: 'Two-Phase Structure', content: 'HELOC analysis must model both draw and repayment phases.' },
      { title: 'Rate Exposure', content: 'Variable-rate sensitivity is central to risk-aware planning.' },
      { title: 'Payment Shock Prevention', content: 'Repayment-period transition planning reduces surprise burden.' },
      { title: 'Line Management', content: 'Controlled draw strategy improves flexibility and cost discipline.' },
      { title: 'Scenario Governance', content: 'Stress tests improve resilience before committing to variable debt.' },
    ],
  },
  'rent-vs-buy-calculator': {
    howTo: 'Enter home purchase assumptions and comparable rent costs to estimate long-term cost differences and break-even horizon between renting and buying.',
    formula: 'Compare cumulative rent outflows with cumulative ownership costs net of equity effects and transaction costs over time.',
    faqs: [
      { q: 'What does rent-vs-buy calculator show?', a: 'It compares financial outcomes of renting versus purchasing under selected assumptions.' },
      { q: 'What inputs matter most?', a: 'Home price, rent growth, mortgage rate, holding period, and maintenance assumptions are key drivers.' },
      { q: 'What is break-even year?', a: 'It is the time when cumulative buying economics overtake renting under modeled assumptions.' },
      { q: 'Does buying always win long term?', a: 'Not always. Market growth, costs, and mobility horizon can favor either side.' },
      { q: 'Should transaction costs be included?', a: 'Yes, purchase and sale costs materially affect ownership economics.' },
      { q: 'Can rent growth change decision?', a: 'Yes, faster rent escalation can make buying relatively more attractive.' },
      { q: 'Does maintenance reserve matter?', a: 'Yes, underestimating maintenance can overstate buying advantage.' },
      { q: 'Can opportunity cost of down payment matter?', a: 'Yes, capital tied in home equity has alternative investment use.' },
      { q: 'Should tax assumptions be modeled?', a: 'Yes where relevant, including deductions and local property tax effects.' },
      { q: 'How often to revisit decision model?', a: 'Update with market rates, rent changes, and expected move timeline.' },
    ],
    sections: [
      { title: 'Horizon-Driven Choice', content: 'Expected stay duration is one of the strongest determinants in rent-vs-buy outcomes.' },
      { title: 'Full-Cost Inclusion', content: 'Reliable comparison requires taxes, fees, maintenance, and transaction costs.' },
      { title: 'Equity vs Liquidity', content: 'Buying builds equity but can reduce cash flexibility relative to renting.' },
      { title: 'Market Uncertainty', content: 'Price appreciation and rent growth uncertainty require scenario analysis.' },
      { title: 'Decision Practicality', content: 'Financial output should be balanced with lifestyle and mobility considerations.' },
    ],
  },
  'mortgage-calculator': {
    howTo: 'Enter your home price and down payment (as a percentage or fixed dollar amount). The loan amount updates automatically. Set your interest rate and loan term, then click Calculate. Expand the advanced section to add property tax, home insurance, PMI, HOA fees, and extra monthly payments to see your full monthly cost and a yearly amortization schedule.\n\n**Mortgage Components:**\n• **Down Payment**: Upfront cash paid to the seller (typically 3–20% of home price). Lenders prefer 20%+.\n• **Loan Amount**: Home price minus down payment — the amount you borrow.\n• **Interest Rate**: Annual percentage charged by the lender (varies by credit score, market conditions, loan type).\n• **Loan Term**: Duration to repay (typically 15, 20, or 30 years for fixed-rate mortgages).\n• **Property Tax**: Annual tax paid to local government (~0.8–1.3% of home value annually, varies by location).\n• **Homeowner\'s Insurance**: Annual insurance protecting your property (required by lenders; typical cost $800–2,000/year).\n• **PMI (Private Mortgage Insurance)**: Required if down payment < 20%; protects lender if you default (~0.5–1% annually).\n• **HOA Fees**: Monthly fees for homeowner association maintenance (common in condos/planned communities).',
    formula: 'Monthly P&I = P × r(1+r)ⁿ / [(1+r)ⁿ − 1], where P = loan amount, r = monthly rate (APR÷12), n = number of payments (years×12).',
    faqs: [
      { q: 'What is PMI and when does it apply?', a: 'Private Mortgage Insurance (PMI) is required when your down payment is less than 20%. It protects the lender if you default, and typically costs 0.5–1.9% of the loan amount annually. Once you reach 20% equity (80% LTV), you can usually request removal.' },
      { q: 'How does an extra monthly payment help?', a: 'Extra principal payments reduce your loan balance faster, which means less interest accumulates. On a 30-year mortgage, even $100/month extra can save tens of thousands in interest and shorten your payoff by several years.' },
      { q: 'What is included in the total monthly payment?', a: 'The full monthly housing cost includes principal & interest (the core payment), property tax (1/12 of annual), homeowner\'s insurance (1/12 of annual), PMI (if down payment < 20%), and HOA fees (if applicable).' },
      { q: 'How do interest rates affect my monthly payment?', a: 'Higher interest rates increase the monthly payment significantly. A 1% rate increase on a $300,000 loan can add $250–300/month. Factors affecting your rate include credit score, market conditions, loan type (FRM vs ARM), and loan term.' },
      { q: 'What\'s the difference between fixed-rate and adjustable-rate mortgages?', a: 'Fixed-rate mortgages (FRM) have the same interest rate for the entire loan term, so your payment never changes. Adjustable-rate mortgages (ARM) start with a lower rate but adjust periodically (usually annually), which can increase your payment.' },
      { q: 'How much down payment should I make on a house?', a: 'A higher down payment lowers monthly payment and total interest. Many buyers target 20% to avoid PMI, but 3-10% options exist depending on loan program and eligibility.' },
      { q: 'Is APR or interest rate more important for mortgage comparison?', a: 'APR is better for comparing total borrowing cost because it includes interest plus fees. Use APR when evaluating lender offers with different fee structures.' },
      { q: 'Can I refinance my mortgage later if rates drop?', a: 'Yes. Refinancing replaces your current loan with a new one. It can reduce payment or term, but closing costs and break-even time should be evaluated before proceeding.' },
      { q: 'What is an amortization schedule in a mortgage?', a: 'It is a payment timeline showing how much of each payment goes to principal and interest, plus remaining balance after each period.' },
      { q: 'How can I reduce total mortgage interest paid?', a: 'Choose a shorter term, add extra principal payments, improve credit for better rates, and refinance strategically when economics are favorable.' },
    ],
  },
  'bmi-calculator': {
    howTo: 'Select unit system (metric or imperial), then enter height and weight. Click Calculate to view BMI score, category, and healthy weight range estimate. Use BMI for screening trends over time, not as a single definitive health diagnosis.',
    formula: 'Metric: BMI = weight(kg) / height(m)^2. Imperial: BMI = 703 * weight(lb) / height(in)^2. Standard adult categories: Underweight < 18.5, Normal 18.5-24.9, Overweight 25-29.9, Obesity >= 30.',
    faqs: [
      { q: 'Is BMI an accurate measure of health?', a: 'BMI is a practical population-level screening metric, but it does not directly measure body fat or fitness and should be interpreted with other health indicators.' },
      { q: 'What is a healthy BMI range?', a: 'For most adults, 18.5 to 24.9 is considered normal. Interpretation can vary based on age, ethnicity, and clinical context.' },
      { q: 'Can muscular people have high BMI but low body fat?', a: 'Yes. Athletes or highly muscular individuals may have elevated BMI despite healthy body composition.' },
      { q: 'Does BMI work the same for children and teens?', a: 'No. Pediatric BMI is interpreted using age- and sex-specific percentile charts rather than fixed adult cutoffs.' },
      { q: 'How often should I check BMI?', a: 'Monthly or quarterly checks are usually sufficient for trend monitoring during weight-management goals.' },
      { q: 'What should I use with BMI for better assessment?', a: 'Combine BMI with waist circumference, body-fat estimates, blood pressure, lipid profile, glucose markers, and lifestyle factors.' },
      { q: 'Is underweight BMI a health risk?', a: 'Persistent underweight levels may be associated with nutritional deficiency, low bone density, or other health concerns and should be medically evaluated.' },
      { q: 'Can BMI predict disease risk?', a: 'BMI correlates with risk trends at population level, but individual risk depends on many factors including genetics, diet, activity, and metabolic health.' },
      { q: 'Why is healthy weight range useful?', a: 'It provides practical target boundaries for planning lifestyle changes, but goals should also consider strength, endurance, and clinical markers.' },
      { q: 'Should BMI goals be personalized?', a: 'Yes. Personalized goals with a clinician or dietitian are often more useful than relying on BMI alone.' },
    ],
    sections: [
      { title: 'What BMI Measures', content: 'BMI estimates weight relative to height and provides a quick screening framework. It is simple and widely used, especially in public health and primary care settings.' },
      { title: 'Strengths and Limits', content: 'BMI is easy to calculate and compare across populations, but it cannot distinguish fat mass from lean mass and may miss distribution-related risk.' },
      { title: 'Waist Circumference Context', content: 'Abdominal fat distribution can influence cardiometabolic risk. Pairing BMI with waist measurements improves risk interpretation.' },
      { title: 'Trend Tracking Over Time', content: 'Single readings matter less than trends. Monitoring changes alongside diet, activity, sleep, and clinical labs gives a more complete picture.' },
      { title: 'Using BMI Responsibly', content: 'Use BMI as one tool, not the only tool. Health decisions should integrate medical history, functional goals, and professional guidance.' },
    ],
  },
  'calorie-calculator': {
    howTo: 'Choose sex, then enter age, weight, and height. Select your typical activity level and calculate to get estimated BMR and TDEE. Use the output to set calorie targets for fat loss, maintenance, or weight gain, and revisit assumptions as weight or activity changes.',
    formula: 'Mifflin-St Jeor BMR: Men = 10*weight(kg) + 6.25*height(cm) - 5*age + 5; Women = 10*weight(kg) + 6.25*height(cm) - 5*age - 161. TDEE = BMR * Activity Factor.',
    faqs: [
      { q: 'What is BMR vs TDEE?', a: 'BMR is baseline energy needed at rest for vital function. TDEE expands this by activity and represents estimated total daily calorie burn.' },
      { q: 'How many calories should I cut to lose weight?', a: 'A moderate deficit is often more sustainable than aggressive cuts. Many plans start around a 300-500 calorie daily deficit and adjust based on progress.' },
      { q: 'How fast should weight loss happen?', a: 'A gradual pace is generally easier to sustain and helps preserve lean mass. Rapid loss can increase fatigue and rebound risk.' },
      { q: 'Why can two calculators give different results?', a: 'Different equations, activity assumptions, and rounding methods can produce different estimates. Use outputs as starting points, then calibrate with real-world data.' },
      { q: 'Should I change calories on workout days?', a: 'Some people keep constant intake; others periodize intake around activity. Consistency and adherence matter more than perfect daily precision.' },
      { q: 'Can I build muscle while losing fat?', a: 'Beginners and detrained individuals often can, especially with resistance training, adequate protein, sleep, and controlled deficit size.' },
      { q: 'How does protein intake affect calorie planning?', a: 'Higher protein often supports satiety and lean-mass retention during weight loss, improving body composition outcomes.' },
      { q: 'Do I need to track calories forever?', a: 'Not necessarily. Tracking is a tool for awareness and calibration; many people transition to habit-based maintenance over time.' },
      { q: 'What if progress stalls?', a: 'Reassess activity, intake accuracy, sleep, stress, and adaptation effects. Small adjustments usually work better than extreme changes.' },
      { q: 'Is this calculator a medical diagnosis tool?', a: 'No. It provides planning estimates and does not replace personalized guidance from qualified healthcare professionals.' },
    ],
    sections: [
      { title: 'Energy Balance Fundamentals', content: 'Body weight trends are influenced by energy balance over time. Intake above expenditure tends to increase weight, while sustained deficits tend to reduce it.' },
      { title: 'BMR, TDEE, and Activity Multipliers', content: 'BMR is the starting point. Activity multipliers approximate lifestyle and exercise demands, creating practical maintenance estimates for planning.' },
      { title: 'Setting Sustainable Targets', content: 'Sustainable nutrition targets prioritize adherence, performance, and recovery. Extreme deficits often reduce consistency and long-term success.' },
      { title: 'Feedback Loop Approach', content: 'Use calculated values as a baseline, then adjust according to 2-4 week progress trends rather than day-to-day scale fluctuations.' },
      { title: 'Context Beyond Calories', content: 'Calorie targets work best when paired with sleep quality, resistance training, stress management, hydration, and nutrient-dense food choices.' },
    ],
  },
  'bmr-calculator': {
    howTo: 'Select your sex, then enter age, weight, and height to estimate Basal Metabolic Rate (BMR). BMR reflects calories your body needs at complete rest. Use this baseline to estimate maintenance calories by applying activity multipliers externally or via related calorie tools.',
    formula: 'Mifflin-St Jeor: Men = 10*weight(kg) + 6.25*height(cm) - 5*age + 5; Women = 10*weight(kg) + 6.25*height(cm) - 5*age - 161.',
    faqs: [
      { q: 'What is BMR?', a: 'BMR is the estimated energy your body needs to maintain vital functions at rest, such as breathing, circulation, and cellular activity.' },
      { q: 'How is BMR different from TDEE?', a: 'BMR is resting energy only. TDEE includes physical activity and daily movement in addition to BMR.' },
      { q: 'Which BMR formula is used here?', a: 'This calculator uses the Mifflin-St Jeor equation, widely used in nutrition and fitness planning.' },
      { q: 'Can BMR change over time?', a: 'Yes. BMR can change with age, body composition, hormone status, and significant weight change.' },
      { q: 'Is BMR enough to set calorie targets?', a: 'BMR is a starting baseline. Practical plans usually use TDEE and real-world progress data for adjustments.' },
      { q: 'Why might my BMR estimate feel inaccurate?', a: 'Prediction equations are approximations and do not fully capture individual variation in metabolism.' },
      { q: 'Should I eat below BMR?', a: 'Very low intake may be hard to sustain and can affect energy and adherence. Structured plans should prioritize health and sustainability.' },
      { q: 'How often should I recalculate BMR?', a: 'Recalculate when body weight changes meaningfully or activity/training status changes.' },
      { q: 'Does muscle mass affect BMR?', a: 'Yes. Higher lean mass is generally associated with higher resting energy expenditure.' },
      { q: 'Can BMR help with weight maintenance?', a: 'Yes. BMR helps set initial targets that can be refined into maintenance calories with activity and tracking.' },
    ],
    sections: [
      { title: 'BMR as a Baseline Metric', content: 'BMR is a foundational estimate for nutrition planning. It does not represent full daily burn but provides a reliable starting point.' },
      { title: 'From BMR to Daily Targets', content: 'Daily calorie targets are usually derived by applying activity multipliers to BMR, then adjusting based on objective progress trends.' },
      { title: 'Individual Variability', content: 'Metabolic rate varies among individuals. Equations guide planning, but outcomes should be refined using observed data over several weeks.' },
      { title: 'Use Cases in Fitness and Health', content: 'BMR supports fat-loss planning, maintenance phases, and performance nutrition by setting an evidence-informed baseline.' },
      { title: 'Practical Calibration Strategy', content: 'Start with estimated values, monitor body-weight trend and performance, then adjust intake gradually to align with your goal.' },
    ],
  },
  'macro-calculator': {
    howTo: 'Enter age, sex, weight, height, activity level, and goal (fat loss, maintenance, or gain). The calculator estimates daily calories and distributes those calories into protein, carbohydrates, and fats based on your selected strategy.',
    formula: 'Calories are estimated from energy expenditure assumptions. Macro calories: Protein = grams * 4, Carbs = grams * 4, Fat = grams * 9. Total calories = Protein calories + Carb calories + Fat calories.',
    faqs: [
      { q: 'What are macros?', a: 'Macros are macronutrients: protein, carbohydrates, and fat. They provide energy and support body function and performance.' },
      { q: 'Why track macros instead of only calories?', a: 'Calories control weight trend, while macro balance influences satiety, body composition, training performance, and recovery quality.' },
      { q: 'How much protein should I target?', a: 'Protein targets vary by goal and activity level. Higher protein is often used during fat-loss phases to support lean mass retention.' },
      { q: 'Are carbs bad for fat loss?', a: 'No. Carb levels can be adjusted to preference and activity demand while staying within total calorie targets.' },
      { q: 'How much fat is too low?', a: 'Very low fat intake may affect adherence and hormonal function. Balanced plans usually keep a practical minimum fat intake.' },
      { q: 'Can I change macro split without changing calories?', a: 'Yes. Many people keep total calories constant and adjust macro ratios based on performance, hunger, and preference.' },
      { q: 'Should macro targets be identical every day?', a: 'Not always. Some strategies use higher carbs on training days and lower carbs on rest days while maintaining weekly calorie goals.' },
      { q: 'How do I handle tracking inaccuracies?', a: 'Use consistent food logging habits, weigh key foods when possible, and adjust targets based on 2-4 week trend outcomes.' },
      { q: 'Can macro tracking help muscle gain?', a: 'Yes. Adequate total calories and protein, combined with progressive resistance training, support muscle gain.' },
      { q: 'Do I need to track macros forever?', a: 'Not necessarily. Many users track temporarily to learn portions and then transition to sustainable habit-based eating.' },
    ],
    sections: [
      { title: 'Macro Fundamentals', content: 'Protein supports tissue repair, carbs provide efficient training fuel, and fats support hormonal and cellular function. Balanced allocation improves adherence and outcomes.' },
      { title: 'Goal-Based Macro Allocation', content: 'Fat-loss plans often emphasize satiety and lean-mass retention, while gain phases may increase carbs and total calories to support training volume.' },
      { title: 'Performance and Recovery Context', content: 'Macro needs depend on training frequency, intensity, and recovery demands. Active users may need different distributions than sedentary users.' },
      { title: 'Adherence Over Perfection', content: 'The best macro plan is one you can sustain. Minor daily variance is normal; consistency over weeks is what drives progress.' },
      { title: 'Iterative Adjustment Process', content: 'Set initial targets, monitor trend data, and adjust gradually. Structured iteration generally beats aggressive one-time changes.' },
    ],
  },
  'pregnancy-calculator': {
    howTo: 'Choose your input mode: enter the first day of your Last Menstrual Period (LMP), your known due date, or your estimated conception date. The calculator will compute your estimated due date, current gestational age, trimester, and conception date based on Naegele\'s rule.',
    formula: 'Estimated Due Date (EDD) = LMP + 280 days (Naegele\'s Rule). Conception date ≈ LMP + 14 days (assumes 28-day cycle).',
    faqs: [
      { q: 'What is Naegele\'s Rule?', a: 'Naegele\'s Rule estimates the due date by adding 280 days (40 weeks) to the first day of the last menstrual period. It assumes a regular 28-day cycle.' },
      { q: 'How accurate is this calculator?', a: 'This provides an estimate. Only an ultrasound in the first trimester can confirm gestational age and due date with high accuracy.' },
      { q: 'What if my cycle is not 28 days?', a: 'If your cycle is longer or shorter than 28 days, adjust the LMP date by the difference. For example, a 35-day cycle means ovulation is approximately day 21, so subtract 7 days from the LMP.' },
    ],
  },
  'pregnancy-weight-gain-calculator': {
    howTo: 'Enter your pre-pregnancy weight, height, and current pregnancy week. The calculator estimates recommended total pregnancy weight gain and trimester progress benchmarks based on commonly used BMI-guided ranges.',
    formula: 'Pre-pregnancy BMI = weight(kg) / height(m)^2. Recommended gain range is selected by BMI group, then distributed across pregnancy progression for trend guidance.',
    faqs: [
      { q: 'How is recommended pregnancy weight gain determined?', a: 'Guidance is commonly based on pre-pregnancy BMI categories, with different total gain ranges for underweight, normal, overweight, and obesity groups.' },
      { q: 'Is weight gain evenly distributed by week?', a: 'Not exactly. First trimester gain is often lower, with more steady gain in second and third trimesters.' },
      { q: 'Can this replace prenatal care advice?', a: 'No. It is an educational estimate and does not replace obstetric guidance or individualized medical recommendations.' },
      { q: 'What if I am carrying twins?', a: 'Multiple gestation has different gain targets. Use guidance specific to twin or higher-order pregnancies from your provider.' },
      { q: 'What if I am below or above range now?', a: 'Use trends rather than single check-ins. Discuss rapid gain, minimal gain, or concerns with your prenatal care team.' },
      { q: 'Do edema and fluid shifts affect scale readings?', a: 'Yes. Temporary fluid changes can alter weight, so week-to-week trends are more informative than daily values.' },
      { q: 'How often should I track pregnancy weight?', a: 'Weekly tracking at similar time-of-day conditions is usually enough for trend monitoring.' },
      { q: 'Does activity level matter for healthy gain?', a: 'Yes. Nutrition quality, safe movement, and medical context all influence healthy progression.' },
      { q: 'Can under-gain be a concern?', a: 'Potentially yes. Low gain may warrant nutrition or medical review depending on gestational stage and fetal growth assessments.' },
      { q: 'When should I call my provider urgently?', a: 'Contact your provider for sudden swelling, severe symptoms, or unexpectedly rapid/low gain with concerning signs.' },
    ],
    sections: [
      { title: 'BMI-Based Guidance Framework', content: 'Most pregnancy gain references start with pre-pregnancy BMI to set an appropriate total gain range.' },
      { title: 'Trimester Progress Pattern', content: 'Early pregnancy often shows variable gain, while later trimesters typically follow a steadier weekly trend.' },
      { title: 'Trend-First Interpretation', content: 'Single measurements can be noisy. Consistent trends with clinical checkups provide better decision support.' },
      { title: 'Nutrition and Hydration Context', content: 'Balanced meals, sufficient protein, micronutrient coverage, and hydration support healthy maternal and fetal outcomes.' },
      { title: 'Clinical Integration', content: 'Use calculator output as context for prenatal visits, not as a standalone diagnostic standard.' },
    ],
  },
  'pregnancy-conception-calculator': {
    howTo: 'Enter either last menstrual period (LMP), due date, or known gestational timing details. The calculator estimates likely conception window and current gestational context using cycle-based assumptions.',
    formula: 'Typical estimate assumes ovulation near day 14 of a 28-day cycle. Conception date ~= LMP + 14 days. Alternate conversions can be made from due date by subtracting approximately 266 days.',
    faqs: [
      { q: 'How is conception date estimated?', a: 'Most estimators infer ovulation around the middle of the cycle, then map conception to that ovulation window.' },
      { q: 'Is conception exactly on ovulation day?', a: 'Not always. Sperm can survive several days and fertilization timing can vary, so a conception window is more realistic than a single day.' },
      { q: 'Can irregular cycles affect estimate accuracy?', a: 'Yes. Irregular cycle length can shift ovulation timing and reduce precision of date-based estimates.' },
      { q: 'How does due date convert to conception estimate?', a: 'A common approach subtracts about 266 days from estimated due date to approximate conception timing.' },
      { q: 'Can ultrasound change dating?', a: 'Yes. Early ultrasound may refine gestational dating and adjust estimated conception-related timelines.' },
      { q: 'Can this confirm paternity timing?', a: 'No. This is not a legal or clinical determination tool and cannot confirm paternity.' },
      { q: 'Why is there a date range instead of one date?', a: 'Biology and cycle variability create uncertainty, so ranges are usually more accurate than single-point estimates.' },
      { q: 'What if I conceived via assisted reproduction?', a: 'Assisted reproduction cycles often have known procedural dates and may require specialized timeline interpretation.' },
      { q: 'Should I rely on app estimates only?', a: 'Use app estimates as guidance, but confirm key milestones with prenatal care providers.' },
      { q: 'When should I seek medical confirmation?', a: 'Seek confirmation for uncertain dating, symptoms, or if menstrual history is unclear.' },
    ],
    sections: [
      { title: 'Cycle-Based Dating Assumptions', content: 'Most conception calculators rely on average-cycle timing, which is useful for planning but not definitive for every person.' },
      { title: 'Conception Window Concept', content: 'A date range better reflects biological reality because ovulation and fertilization timing are variable.' },
      { title: 'Role of Ultrasound Dating', content: 'First-trimester ultrasound can improve timing confidence and may revise estimated milestones from LMP-based methods.' },
      { title: 'Practical Use Cases', content: 'Conception estimates help with milestone planning, but major medical decisions should rely on clinician-confirmed dating.' },
      { title: 'Interpretation Limits', content: 'Use results as educational guidance and discuss discrepancies with healthcare professionals for individualized care.' },
    ],
  },
  'due-date-calculator': {
    howTo: 'Enter the first day of your last menstrual period (LMP), known conception date, or IVF-related timing data if available. The calculator estimates due date, current gestational age, trimester stage, and key pregnancy milestones.',
    formula: 'Naegele-based estimate: Due Date = LMP + 280 days (40 weeks). Conception-based estimate: Due Date ~= Conception Date + 266 days.',
    faqs: [
      { q: 'How is the due date calculated?', a: 'Most estimates use the first day of LMP and add 280 days, assuming a typical cycle and ovulation timing.' },
      { q: 'Why is my baby not born exactly on due date?', a: 'Due date is an estimate, not an exact prediction. Many normal births occur before or after the estimated day.' },
      { q: 'Can irregular cycles affect due date estimates?', a: 'Yes. Irregular cycles can shift ovulation timing, making LMP-only estimates less precise.' },
      { q: 'Does ultrasound provide better dating?', a: 'Early ultrasound can improve gestational dating accuracy and may adjust estimated due date.' },
      { q: 'How accurate are online due date calculators?', a: 'They are useful for planning but should be interpreted with clinical confirmation during prenatal care.' },
      { q: 'Can IVF pregnancies use the same method?', a: 'IVF dating often uses known transfer or fertilization timing, which may produce more specific estimates.' },
      { q: 'What is gestational age vs fetal age?', a: 'Gestational age counts from LMP, while fetal age is typically about two weeks less and counts from conception.' },
      { q: 'What trimester am I in?', a: 'Trimester ranges are commonly: first (0-13 weeks), second (14-27 weeks), third (28+ weeks).' },
      { q: 'Should I recalculate due date frequently?', a: 'Recalculation is usually unnecessary unless clinical dating is updated by your care team.' },
      { q: 'When should I contact my provider?', a: 'Contact your provider for concerning symptoms, uncertainty about dates, or questions about milestone timing.' },
    ],
    sections: [
      { title: 'Dating Methods Overview', content: 'LMP-based and conception-based methods are common starting points for estimating expected delivery timelines.' },
      { title: 'Clinical Refinement Process', content: 'Prenatal care may refine estimated dates using ultrasound and medical history, especially when cycle history is uncertain.' },
      { title: 'Milestone Planning', content: 'Due-date calculators help schedule checkups, tests, and preparation milestones, but medical advice remains primary.' },
      { title: 'Understanding Date Variability', content: 'Normal delivery timing spans a range, so estimate windows are more practical than exact-day expectations.' },
      { title: 'Safe Interpretation', content: 'Use date estimates for planning context and coordinate with your obstetric provider for personalized care decisions.' },
    ],
  },
  'pace-calculator': {
    howTo: 'Enter distance and finish time (hours, minutes, seconds). The calculator computes average pace per mile and speed in mph. Use it to plan race targets, compare training runs, and estimate split goals for common distances.',
    formula: 'Total seconds = h*3600 + m*60 + s. Pace per mile (sec) = Total seconds / Distance (miles). Speed (mph) = Distance / (Total seconds / 3600).',
    faqs: [
      { q: 'What is running pace?', a: 'Pace is the time needed to cover one unit of distance, commonly minutes per mile or minutes per kilometer.' },
      { q: 'How is pace different from speed?', a: 'Pace is time per distance, while speed is distance per time. They are inverse representations of performance.' },
      { q: 'Can I use this for walking and cycling too?', a: 'Yes. The math applies to any activity with distance and elapsed time, though interpretation differs by sport.' },
      { q: 'Why does average pace differ from my split pace?', a: 'Average pace smooths fast and slow sections. Split pace reveals variation by segment and terrain.' },
      { q: 'How can I set a race pace target?', a: 'Use recent training results, current fitness, and realistic progression to set target pace bands.' },
      { q: 'Should I train all runs at race pace?', a: 'Usually no. Balanced plans include easy runs, tempo efforts, intervals, and recovery sessions.' },
      { q: 'What affects pace most?', a: 'Fitness level, terrain, weather, elevation, fatigue, hydration, and pacing strategy all influence pace outcomes.' },
      { q: 'How do I convert pace per mile to pace per km?', a: 'Divide pace per mile by 1.609 to approximate pace per kilometer.' },
      { q: 'Can this estimate finish time from pace?', a: 'Yes. Multiply target pace by race distance for projected finish time, then adjust for course difficulty.' },
      { q: 'How often should I reassess training pace?', a: 'Reassess every few weeks or after key benchmark workouts and races.' },
    ],
    sections: [
      { title: 'Pace as a Training Metric', content: 'Pace helps structure workout intensity and compare sessions over time under consistent conditions.' },
      { title: 'Race-Day Execution', content: 'Stable early pacing often improves outcomes by reducing late-race slowdown and energy mismanagement.' },
      { title: 'Splits and Consistency', content: 'Split analysis highlights whether pacing was even, negative-split, or started too aggressively.' },
      { title: 'Environmental Effects', content: 'Heat, humidity, wind, hills, and surface type can materially change pace at the same effort level.' },
      { title: 'Progress Tracking', content: 'Use repeated distances and similar conditions to measure improvement trends rather than relying on single-session results.' },
    ],
  },
  'percentage-calculator': {
    howTo: 'Choose a mode such as percent of a number, what percent one value is of another, or percent increase/decrease. Enter values and calculate to get quick results for pricing, finance, grade analysis, and growth comparisons.',
    formula: 'Percent of value: Result = Base * (Percent/100). Percent ratio: Percent = (Part/Base) * 100. Percent change: ((New - Old)/Old) * 100.',
    faqs: [
      { q: 'How do I calculate a 20% discount?', a: 'Multiply price by 0.20 to find discount amount, then subtract it from the original price.' },
      { q: 'How do I find what percent 45 is of 120?', a: 'Divide 45 by 120 and multiply by 100. That gives 37.5%.' },
      { q: 'What is percent increase formula?', a: 'Use ((new - old) / old) * 100. Positive values indicate increase.' },
      { q: 'What is percent decrease formula?', a: 'Use ((old - new) / old) * 100 or allow the standard change formula to return a negative value for decreases.' },
      { q: 'Can percentage change exceed 100%?', a: 'Yes. If a value more than doubles from the original, the increase is above 100%.' },
      { q: 'Why is percent change undefined sometimes?', a: 'If the original value is zero, percent change is not defined because division by zero is invalid.' },
      { q: 'What is the difference between markup and margin?', a: 'Markup is based on cost, margin is based on selling price. They are related but not identical.' },
      { q: 'How is percent used in finance?', a: 'Percent is used for returns, discount rates, tax rates, interest rates, and allocation weights.' },
      { q: 'How do I avoid percentage mistakes?', a: 'Convert percentages to decimals carefully and verify base value selection before finalizing.' },
      { q: 'Should I round percentage outputs?', a: 'Round for display, but keep more precision internally when small differences matter.' },
    ],
    sections: [
      { title: 'Core Percentage Modes', content: 'Most practical tasks use three modes: percent of a value, ratio to percent conversion, and percent change between two values.' },
      { title: 'Applied Use Cases', content: 'Percentage math is central to discounts, taxes, analytics dashboards, budgeting, and business reporting.' },
      { title: 'Common Pitfalls', content: 'Choosing the wrong base value and mishandling zero baselines are the two most common percent-calculation errors.' },
      { title: 'Interpreting Large Changes', content: 'A 100% increase means doubling, while a 50% decrease is not reversed by a 50% increase. Direction and base both matter.' },
      { title: 'Accuracy and Rounding', content: 'Keep higher precision during intermediate steps and round only at the final display stage for reliable outputs.' },
    ],
  },
  'percent-calculator': {
    howTo: 'Use this calculator to compute percentages, reverse percentages, and percent change quickly. Enter your values in the selected mode and calculate for instant outputs.',
    formula: 'Percent of value: Result = Base * (Percent/100). Ratio as percent: (Part/Base) * 100. Change percent: ((New - Old)/Old) * 100.',
    faqs: [
      { q: 'Is percent-calculator different from percentage-calculator?', a: 'They solve the same core percentage operations and are commonly used as interchangeable tools.' },
      { q: 'Can I use this for tax and discounts?', a: 'Yes. Percentage operations directly apply to sales tax, discount amount, and final price calculations.' },
      { q: 'How do I reverse a percentage increase?', a: 'Divide the final value by (1 + rate) where rate is decimal form, then compute difference if needed.' },
      { q: 'Why is my final amount slightly different?', a: 'Small differences often come from rounding choices and decimal precision.' },
      { q: 'Can percent change be negative?', a: 'Yes. Negative percent change indicates a decrease from the original value.' },
      { q: 'How do I convert 12.5% to decimal?', a: 'Divide by 100. 12.5% becomes 0.125.' },
      { q: 'How do I convert 0.087 to percent?', a: 'Multiply by 100 to get 8.7%.' },
      { q: 'When should I use absolute difference instead?', a: 'Use absolute difference when units matter more than relative change (for example, dollar gap rather than percent gap).' },
      { q: 'Can this help with exam score analysis?', a: 'Yes. You can compute score percentage, required improvement, and comparative performance changes.' },
      { q: 'Is there a best practice for reporting percentages?', a: 'Report both percentage and base values so results are interpretable and not misleading.' },
    ],
    sections: [
      { title: 'Percent Math Essentials', content: 'Percentage is a normalized way to compare values on a per-hundred basis, improving readability across different scales.' },
      { title: 'Reverse Percentage Problems', content: 'Reverse calculations are useful when you know the final amount and need to reconstruct original price or baseline value.' },
      { title: 'Decision Support Context', content: 'Percent tools support practical decisions in personal finance, commerce, and performance tracking.' },
      { title: 'Communication Clarity', content: 'Always include original and new values when presenting percent changes to avoid ambiguity.' },
      { title: 'Reliability Tips', content: 'Double-check base values and sign direction for change calculations before using outputs in decisions.' },
    ],
  },
  'tip-calculator': {
    howTo: 'Enter the bill amount and select a tip percentage (typically 15-20%). The calculator shows the tip amount and total with tip. You can also split the bill among multiple people.',
    formula: 'Tip = Bill Amount × (Tip % ÷ 100). Total = Bill + Tip.',
    faqs: [
      { q: 'What is a standard tip amount?', a: 'In the US, standard tips are 15% for standard service, 18% for good service, and 20%+ for excellent service. Tips vary by country and establishment.' },
      { q: 'Should I tip on the pre-tax or post-tax amount?', a: 'Tips are typically calculated on the pre-tax total, but this varies by country and custom.' },
    ],
  },
  'compound-interest-calculator': {
    howTo: 'Enter your starting principal, annual return rate, compounding frequency, and investment period in years. Optionally include recurring contributions to model monthly saving behavior. Click Calculate to view ending balance, total contributions, interest earned, and annualized return metrics. Compare scenarios by changing rate, duration, and contribution amount.',
    formula: 'Without contributions: A = P(1 + r/n)^(nt). With periodic contributions (end of each period): A = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]. Here P = principal, r = annual rate, n = compounds per year, t = years, PMT = periodic contribution.',
    faqs: [
      { q: 'What is compound interest?', a: 'Compound interest means you earn returns on both your original principal and previously earned interest. Over long periods, this compounding effect can significantly increase final balance.' },
      { q: 'What\'s the difference between simple and compound interest?', a: 'Simple interest applies only to principal. Compound interest applies to principal plus accumulated interest, creating exponential growth over time.' },
      { q: 'How does compounding frequency affect returns?', a: 'More frequent compounding (monthly or daily) generally produces a slightly higher ending balance than annual compounding at the same nominal rate.' },
      { q: 'Why are recurring contributions so powerful?', a: 'Regular contributions increase principal over time, and earlier deposits compound longer. This often drives more growth than trying to time the market.' },
      { q: 'What is annualized return and why does it matter?', a: 'Annualized return converts multi-year performance into a comparable yearly rate, helping you compare different investments on equal footing.' },
      { q: 'Can this calculator be used for retirement planning?', a: 'Yes. It is useful for projecting long-term growth of retirement accounts, especially when combined with steady periodic contributions.' },
      { q: 'Should I assume a constant rate every year?', a: 'For planning, a constant average rate is common. Real markets vary year to year, so consider conservative, base, and optimistic scenarios.' },
      { q: 'How do inflation and taxes affect compound growth?', a: 'Inflation reduces purchasing power and taxes reduce net return. Real after-tax growth is often lower than nominal calculator output.' },
      { q: 'What time horizon is best for compounding?', a: 'Longer horizons usually benefit compounding most. Time in the market is often more impactful than short-term return differences.' },
      { q: 'How can I improve long-term results?', a: 'Start early, contribute consistently, keep costs low, reinvest earnings, and avoid frequent withdrawals that interrupt compounding.' },
    ],
    sections: [
      { title: 'Core Compound Growth Idea', content: 'Compounding turns earnings into new earning power. Each period adds interest not only on principal but on all prior gains. The effect accelerates over time, which is why long-term consistency is so valuable.' },
      { title: 'Role of Time Horizon', content: 'Small rate differences matter more over long periods. For example, a 1% return improvement over decades can change final outcomes dramatically due to exponential growth.' },
      { title: 'Contribution Strategy', content: 'Monthly investing smooths entry points and builds discipline. Even modest deposits can compound into large balances when maintained over many years.' },
      { title: 'Comparing Scenarios Correctly', content: 'Use consistent assumptions when comparing options: same period, same contribution schedule, and realistic rate expectations. This avoids misleading comparisons.' },
      { title: 'Planning With Uncertainty', content: 'Future returns are uncertain. Build multiple scenarios and stress test lower return assumptions to improve financial resilience and decision quality.' },
    ],
  },
  'temperature-calculator': {
    howTo: 'Enter a temperature value and select the unit (Celsius, Fahrenheit, or Kelvin). The calculator automatically converts to the other units. Useful for cooking, science, and international comparisons.',
    formula: 'Celsius to Fahrenheit: (C × 9/5) + 32. Fahrenheit to Celsius: (F − 32) × 5/9.',
    faqs: [
      { q: 'What\'s the difference between Celsius and Fahrenheit?', a: 'Celsius is the standard in most countries. Fahrenheit is used primarily in the US. Celsius is based on water\'s freezing and boiling points (0° and 100°).' },
      { q: 'What is absolute zero?', a: 'Absolute zero (−273.15°C or −459.67°F) is the lowest possible temperature where all molecular motion stops.' },
    ],
  },
  'scientific-calculator': {
    howTo: 'Enter expressions with arithmetic operators, parentheses, exponents, roots, and supported math functions. Calculate to evaluate complex expressions using standard precedence rules.',
    formula: 'Evaluation follows operator precedence: parentheses, exponents, multiplication/division, then addition/subtraction, with function calls applied to their arguments.',
    faqs: [
      { q: 'What operations are supported?', a: 'Typical support includes addition, subtraction, multiplication, division, exponentiation, roots, and selected scientific functions.' },
      { q: 'What is the order of operations?', a: 'Parentheses first, then exponents, then multiplication/division, and finally addition/subtraction from left to right.' },
      { q: 'How do parentheses affect results?', a: 'Parentheses force grouped evaluation and can change final output significantly.' },
      { q: 'Why do I get syntax errors?', a: 'Common causes are missing parentheses, invalid characters, unsupported function names, or malformed decimal numbers.' },
      { q: 'Can I calculate powers and roots?', a: 'Yes. Exponent and root operations are core scientific-calculator use cases.' },
      { q: 'Is division by zero allowed?', a: 'No. Division by zero is undefined and should return an error or invalid output message.' },
      { q: 'Can I use negative numbers?', a: 'Yes. Use clear sign placement, especially with exponents and parentheses.' },
      { q: 'What is scientific notation support?', a: 'Many scientific calculators support notation like 1e6 for one million and 3.2e-4 for small values.' },
      { q: 'How can I reduce input mistakes?', a: 'Build expressions step by step and validate each sub-part before combining into one long formula.' },
      { q: 'When should I use this instead of a basic calculator?', a: 'Use scientific mode when expressions include exponents, roots, trigonometry, logs, or nested operations.' },
    ],
    sections: [
      { title: 'Expression Evaluation Basics', content: 'Scientific calculators parse expressions and apply precedence rules to produce deterministic results for complex math.' },
      { title: 'Function and Operator Handling', content: 'Using correct function names, parentheses, and operator placement is essential for valid computation.' },
      { title: 'Error Prevention Workflow', content: 'Break long expressions into smaller testable parts to catch syntax or logic mistakes early.' },
      { title: 'High-Precision Scenarios', content: 'Scientific mode is useful in engineering and analytics where power, root, and notation operations are common.' },
      { title: 'Interpretation and Verification', content: 'For critical calculations, cross-check outputs with alternate methods or simplified sanity checks.' },
    ],
  },
  'math-calculator': {
    howTo: 'Use this general math calculator for arithmetic expressions, parentheses, powers, and mixed operations. Enter your expression and calculate to get a quick, structured result.',
    formula: 'General expression evaluation using arithmetic operators with precedence and parentheses rules.',
    faqs: [
      { q: 'What is a math calculator used for?', a: 'It is used for everyday arithmetic, multi-step expressions, and quick validation of manual calculations.' },
      { q: 'Does it follow PEMDAS/BODMAS?', a: 'Yes, expression evaluation follows standard precedence rules.' },
      { q: 'Can I include decimals?', a: 'Yes. Decimal arithmetic is supported for most standard operations.' },
      { q: 'Can I use fractions directly?', a: 'Depending on parser rules, fractions may need conversion to decimal or explicit division format like 3/4.' },
      { q: 'Why did my result differ from expectation?', a: 'Order of operations or missing parentheses is often the cause of unexpected results.' },
      { q: 'Can this help with homework checks?', a: 'Yes, it can verify intermediate and final answers, but steps should still be understood conceptually.' },
      { q: 'What if I enter invalid symbols?', a: 'Unsupported symbols typically produce parsing errors; use standard operators and number formats.' },
      { q: 'Is this suitable for finance math?', a: 'For simple arithmetic, yes. For specialized finance formulas, use dedicated finance calculators when available.' },
      { q: 'Can I chain multiple operations?', a: 'Yes, complex expressions with multiple operations are supported.' },
      { q: 'How can I improve reliability?', a: 'Use parentheses intentionally and verify units before performing calculations.' },
    ],
    sections: [
      { title: 'Everyday Math Utility', content: 'General-purpose math tools speed up routine arithmetic and reduce manual error in repeated calculations.' },
      { title: 'Precedence Awareness', content: 'Understanding precedence helps interpret outputs correctly and prevents incorrect assumptions.' },
      { title: 'Structured Problem Solving', content: 'Breaking larger problems into smaller expressions improves clarity and debugging.' },
      { title: 'Education Support', content: 'Math calculators are best used as verification tools alongside conceptual understanding and step-by-step reasoning.' },
      { title: 'Input Hygiene', content: 'Consistent formatting and clear parentheses improve both parser success rate and output accuracy.' },
    ],
  },
  'fraction-calculator': {
    howTo: 'Enter fractions in numerator/denominator form and choose operation (add, subtract, multiply, divide). The calculator returns simplified fraction and decimal equivalents.',
    formula: 'Addition/Subtraction uses common denominator; multiplication multiplies numerators and denominators; division multiplies by reciprocal. Simplification divides by GCD.',
    faqs: [
      { q: 'How do I add fractions with different denominators?', a: 'Find a common denominator, convert each fraction, add numerators, then simplify.' },
      { q: 'How do I subtract fractions?', a: 'Use a common denominator, subtract numerators, and reduce the result.' },
      { q: 'How do I multiply fractions?', a: 'Multiply numerators together and denominators together, then simplify.' },
      { q: 'How do I divide fractions?', a: 'Multiply the first fraction by the reciprocal of the second fraction.' },
      { q: 'What is a reciprocal?', a: 'A reciprocal swaps numerator and denominator (for example, 3/4 becomes 4/3).' },
      { q: 'How are fractions simplified?', a: 'Divide numerator and denominator by their greatest common divisor until no further reduction is possible.' },
      { q: 'Can improper fractions be converted?', a: 'Yes. Improper fractions can be shown as mixed numbers and decimals for easier interpretation.' },
      { q: 'Why is denominator zero invalid?', a: 'A denominator of zero is undefined in standard arithmetic and cannot produce a valid real-number fraction.' },
      { q: 'Can this calculator handle negative fractions?', a: 'Yes. Sign handling is supported and simplification should preserve equivalent value.' },
      { q: 'When is decimal form useful?', a: 'Decimal output is useful for estimation, comparisons, and contexts requiring approximate numeric values.' },
    ],
    sections: [
      { title: 'Fraction Operation Rules', content: 'Each fraction operation has a standard rule set. Understanding these rules helps validate calculator outputs.' },
      { title: 'Simplification Importance', content: 'Reduced fractions are easier to interpret and compare, especially in multi-step problems.' },
      { title: 'Improper and Mixed Forms', content: 'Switching between improper and mixed formats supports both symbolic math and practical communication.' },
      { title: 'Decimal Conversion Context', content: 'Decimal equivalents help in measurement, finance, and data interpretation tasks.' },
      { title: 'Error Handling Cases', content: 'Invalid denominators and malformed inputs should be corrected before relying on final results.' },
    ],
  },
  'body-fat-calculator': {
    howTo: 'Select your gender and unit system (metric or imperial). Enter your measurements: waist (or abdomen) circumference, neck circumference, and for women, hip circumference. The calculator uses the U.S. Navy Method (Hodgdon & Beckett formulas) to estimate body fat percentage based on these circumference measurements. Results include body fat category (Essential, Athlete, Fitness, Average, or Obese), fat mass, lean body mass, and ideal body fat for your age.',
    formula: 'U.S. Navy Method (Males): BFP = 86.010×log₁₀(abdomen−neck) − 70.041×log₁₀(height) + 36.76. (Females): BFP = 163.205×log₁₀(waist+hip−neck) − 97.684×log₁₀(height) − 78.387. Fat Mass (kg) = BF% × Weight. Lean Mass = Weight − Fat Mass.',
    faqs: [
      { q: 'What are body fat categories?', a: 'Essential fat (10–13% women, 2–5% men) is necessary for life functions. Athletes: 6–13% men, 14–20% women. Fitness: 14–17% men, 21–24% women. Average: 18–24% men, 25–31% women. Obese: 25%+ men, 32%+ women.' },
      { q: 'How accurate is the U.S. Navy Method?', a: 'The Navy Method is reasonably accurate but estimates based on circumference, not direct measurement. For highest accuracy, use DEXA scans or hydrostatic weighing. The Navy method ±3–5% error is typical.' },
      { q: 'How do I measure circumferences correctly?', a: 'For waist: horizontal at navel level (relax stomach). For neck: just below larynx, tape sloping downward. For hips (women): at widest horizontal point around buttocks. Use a cloth tape measure, not metal. Measure to the nearest 0.25 inch (0.5 cm).' },
      { q: 'Why is body fat percentage important?', a: 'Body fat percentage reveals health better than weight alone. It indicates cardiovascular health, metabolic function, and fitness level. Healthy ranges vary by age; generally, lower (within range) is associated with better health outcomes.' },
      { q: 'How is body fat percentage different from BMI?', a: 'BMI estimates weight relative to height, while body fat percentage estimates composition (fat vs lean mass). Both can be useful together.' },
      { q: 'Can hydration affect body fat measurements?', a: 'Yes. Hydration status, meal timing, and recent exercise can shift circumference and impedance-based readings, so consistent measurement conditions help.' },
      { q: 'How often should I track body fat?', a: 'Every 2-4 weeks is usually enough. Daily fluctuations are normal and can be misleading.' },
      { q: 'What body fat level is realistic for most people?', a: 'Sustainable healthy ranges vary by sex and age. Extremely low levels are difficult to maintain and may not be appropriate without supervision.' },
      { q: 'Should I cut calories aggressively to reduce body fat?', a: 'Moderate deficits, adequate protein, and strength training are generally more sustainable and better for preserving lean mass.' },
      { q: 'Can I gain muscle while lowering body fat?', a: 'Yes in some situations, especially for beginners or after training breaks, with structured training, recovery, and nutrition.' },
    ],
    sections: [
      { title: 'Body Composition Basics', content: 'Body composition separates total mass into fat mass and lean mass. This provides clearer health and performance context than body weight alone.' },
      { title: 'Navy Method in Practice', content: 'Circumference-based formulas are practical and low-cost. They are best used for trend monitoring under consistent measurement conditions.' },
      { title: 'Measurement Consistency', content: 'Measure at similar times of day, posture, and hydration status. Small changes in tape position can significantly affect estimates.' },
      { title: 'Interpreting Categories Safely', content: 'Category ranges are reference bands, not diagnoses. Medical history, performance goals, and clinical markers should guide personalized decisions.' },
      { title: 'Action Plan for Improvement', content: 'Combine resistance training, cardiovascular activity, protein-aware nutrition, sleep quality, and gradual progress targets for sustainable fat-loss outcomes.' },
    ],
  },
  'ideal-weight-calculator': {
    howTo: 'Enter your height and calculate to see an estimated healthy body-weight range. The result is based on common BMI boundaries and provides both kilogram and pound ranges for easy planning.',
    formula: 'Lower bound = 18.5 * height(m)^2, Upper bound = 24.9 * height(m)^2. Pounds = kilograms * 2.20462.',
    faqs: [
      { q: 'How is ideal weight estimated?', a: 'This tool estimates a healthy range using BMI reference cutoffs, not a single exact target number.' },
      { q: 'Why does it show a range instead of one value?', a: 'Healthy body size varies by frame, muscle mass, and lifestyle, so a practical range is usually more useful than a fixed value.' },
      { q: 'Is ideal weight the same as healthy weight?', a: 'They are often used similarly in calculators, but true health also depends on body composition, fitness, labs, and medical history.' },
      { q: 'Can athletes be outside this range and still healthy?', a: 'Yes. Muscular individuals may fall outside BMI-based ranges despite strong health and performance markers.' },
      { q: 'Should men and women use different ranges?', a: 'This method uses universal BMI cutoffs. Personalized targets may differ by age, sex, and clinical context.' },
      { q: 'How can I use this output in planning?', a: 'Use the range as a directional goal, then pair it with nutrition, strength, and activity plans that fit your lifestyle.' },
      { q: 'How quickly should I move toward target range?', a: 'Gradual progress is usually more sustainable and safer than aggressive short-term changes.' },
      { q: 'Does this account for age?', a: 'No direct age adjustment is applied in this simple estimate, so older adults may need individualized interpretation.' },
      { q: 'What if my current weight is above the range?', a: 'Use the gap as a planning metric, then focus on realistic milestones and consistent habits rather than extreme restrictions.' },
      { q: 'Should I consult a professional?', a: 'Yes, especially for medical conditions, pregnancy, medication effects, or complex body-composition goals.' },
    ],
    sections: [
      { title: 'Range-Based Targeting', content: 'A range encourages realistic goal setting and helps avoid all-or-nothing thinking around body weight changes.' },
      { title: 'Context Beyond the Scale', content: 'Weight is one metric. Strength, endurance, sleep, blood pressure, and metabolic markers provide broader health context.' },
      { title: 'Habit-Driven Progress', content: 'Consistent nutrition quality, daily activity, and resistance training often matter more than short-term scale fluctuations.' },
      { title: 'Tracking Strategy', content: 'Track trends weekly rather than reacting to daily changes. Water retention and routine variation can mask true progress.' },
      { title: 'Personalization Matters', content: 'Use calculator output as a starting point, then adjust targets based on lifestyle, medical input, and long-term adherence.' },
    ],
  },
  'triangle-calculator': {
    howTo: 'Provide any 3 values from the following 6: side lengths (a, b, c) and angles (A, B, C). At least one side must be provided. The calculator solves the triangle using the Law of Sines, Law of Cosines, and Pythagorean theorem (for right triangles). Results include all missing sides, angles, area, perimeter, height, median, inradius, and circumradius.',
    formula: 'Law of Cosines: c² = a² + b² − 2ab×cos(C). Law of Sines: a/sin(A) = b/sin(B) = c/sin(C). Area (Heron\'s): √[s(s−a)(s−b)(s−c)] where s = (a+b+c)/2. Area (SAS): 0.5×a×b×sin(C). Pythagorean (right): a² + b² = c².',
    faqs: [
      { q: 'What is the Law of Sines and when is it used?', a: 'The Law of Sines states that the ratio of a side to the sine of its opposite angle is constant for all three sides. Use it when you know two angles and one side (AAS/ASA) or two sides and a non-opposite angle (SSA, ambiguous case).' },
      { q: 'What is the Law of Cosines?', a: 'The Law of Cosines (c² = a² + b² − 2ab×cos(C)) relates sides and angles. Use it for SAS (two sides + included angle) or SSS (all three sides) cases.' },
      { q: 'What is Heron\'s Formula?', a: 'Heron\'s Formula calculates the area of any triangle given only its three side lengths: Area = √[s(s−a)(s−b)(s−c)], where s is the semi-perimeter (a+b+c)/2.' },
      { q: 'What are inradius and circumradius?', a: 'Inradius is the radius of the largest circle that fits inside the triangle. Circumradius is the radius of the circle that passes through all three vertices. Both are useful in geometry and trigonometry.' },
      { q: 'What is the difference between acute, right, and obtuse triangles?', a: 'Acute: all angles < 90°. Right: one angle = 90° (uses Pythagorean theorem). Obtuse: one angle > 90°. Sum of angles in any triangle always = 180°.' },
      { q: 'What is the SSA ambiguous case?', a: 'With two sides and a non-included angle, there may be zero, one, or two valid triangles depending on side-angle relationships.' },
      { q: 'Can I solve a triangle with only angles?', a: 'No. At least one side length is required to establish scale and compute actual side values.' },
      { q: 'How do I verify triangle validity?', a: 'For side inputs, check triangle inequality: each side must be less than the sum of the other two sides.' },
      { q: 'What is semi-perimeter used for?', a: 'Semi-perimeter s = (a+b+c)/2 is used directly in Heron formula for area computation.' },
      { q: 'When should I use right-triangle shortcuts?', a: 'If one angle is 90 degrees, right-triangle identities and Pythagorean relationships simplify computations.' },
    ],
    sections: [
      { title: 'Triangle Input Combinations', content: 'Different known-value combinations (SSS, SAS, ASA, AAS, SSA) require different solving methods and produce different certainty levels.' },
      { title: 'Area Methods Overview', content: 'Area can be derived from side-only data via Heron formula or from two sides with included angle via trigonometric area formula.' },
      { title: 'Angle-Side Consistency', content: 'Larger angles are opposite larger sides, which provides a quick reasonableness check for solved triangles.' },
      { title: 'Geometric Radius Metrics', content: 'Inradius and circumradius summarize triangle geometry and connect side/area values to circle-based constructions.' },
      { title: 'Practical Validation Steps', content: 'Always validate sum of angles equals 180 degrees and side lengths satisfy triangle inequality before using results in downstream work.' },
    ],
  },
  'auto-loan-calculator': {
    howTo: 'Enter your vehicle price, down payment, trade-in value (if applicable), loan term, and interest rate. Include any cash incentives, rebates, sales tax, and fees. The calculator shows monthly payment, total interest, total cost, and an amortization schedule. You can compare different financing options to find the best deal.',
    formula: 'Monthly Payment = [P × r(1+r)^n] / [(1+r)^n − 1], where P = financed amount, r = monthly rate (APR÷12), n = number of payments. Sales Tax varies by state and trade-in value accounting.',
    faqs: [
      { q: 'What is a trade-in value and how does it affect my loan?', a: 'A trade-in is when you sell your current vehicle to the dealership for credit toward a new car. The trade-in value reduces the financed amount. Some states reduce sales tax based on trade-in value; others calculate tax on the full price.' },
      { q: 'What are common car purchase fees?', a: 'Document fees (~$100–200), Title & Registration fees (varies by state), Destination fee (~$900–1,500), Advertising fees, and Insurance (mandatory for full coverage on financed cars). Some dealerships add mysterious fees—ask for justification.' },
      { q: 'Should I take cash rebate or low interest rate financing?', a: 'Cash rebates instantly reduce the price; low rates reduce interest paid. With a low APR (0–2.9%), financing is often better. With a higher rate (5%+), a cash rebate may save more money overall.' },
      { q: 'What is the best auto loan term?', a: 'Typical terms: 36, 48, 60, 72, or 84 months. Shorter terms (36–48 mo) have lower interest but higher payments. Longer terms (60–84 mo) have lower payments but higher total interest.' },
      { q: 'Can I pay off my auto loan early?', a: 'Most lenders allow early payoff without penalty. Extra payments directly reduce principal, saving significant interest. For example, paying $100 extra per month can save thousands over the loan life.' },
      { q: 'What credit score is needed for the best car loan rates?', a: 'Higher scores usually unlock lower APR offers. Borrowers in prime and super-prime tiers typically receive the most competitive financing terms.' },
      { q: 'Should I finance taxes and fees into the auto loan?', a: 'Financing taxes and fees lowers upfront cash needed but increases total interest cost. Paying some costs upfront can reduce the lifetime loan expense.' },
      { q: 'Is dealership financing always more expensive than bank financing?', a: 'Not always. Manufacturers sometimes offer promotional APR through captive lenders. Compare dealer offers with pre-approved bank or credit union offers.' },
      { q: 'How does loan term affect total car ownership cost?', a: 'Longer terms reduce monthly payments but often increase total interest and risk of being upside down on the loan.' },
      { q: 'Should I buy used instead of new to reduce loan burden?', a: 'Often yes. Used vehicles usually have lower purchase price and slower depreciation, which can reduce financing amount and long-term cost.' },
    ],
    sections: [
      { title: 'Understanding Auto Loans', content: 'Most people turn to auto loans during a vehicle purchase. They work as any generic, secured loan from a financial institution with a typical term of 36, 60, 72, or 84 months in the U.S. Each month, repayment of principal and interest must be made from borrowers to auto loan lenders. Money borrowed that is not repaid can result in the car being legally repossessed. Auto loans are secured by the vehicle itself, meaning the lender holds the title until the loan is fully paid.' },
      { title: 'Dealership Financing vs. Direct Lending', content: 'Two main financing options exist: direct lending and dealership financing. Direct lending comes from a bank, credit union, or financial institution, allowing you to arrive at the dealership pre-approved. This gives you negotiating leverage. Dealership financing is arranged through the dealership itself, usually via captive lenders associated with car manufacturers. Direct lending provides more control and often better rates. Dealership financing offers convenience but fewer rate options. Getting pre-approved through direct lending can strengthen your negotiating position significantly.' },
      { title: 'Vehicle Rebates and Incentives', content: 'Car manufacturers offer vehicle rebates and cash incentives to boost sales. Rebates directly reduce the purchase price. Some states tax rebates differently—always check with your state. Cash incentives may or may not be taxed depending on your location. Alaska, Arizona, Delaware, Iowa, Kansas, Kentucky, Louisiana, Massachusetts, Minnesota, Missouri, Montana, Nebraska, New Hampshire, Oklahoma, Oregon, Pennsylvania, Rhode Island, Texas, Utah, Vermont, and Wyoming do not tax cash rebates. Generally, rebates are offered for new cars only, though some used car dealers occasionally offer small rebates.' },
      { title: 'Common Auto Purchase Fees', content: 'Beyond the vehicle price, several fees apply: Sales Tax (state/local, varies by location), Document Fees ($100–200 for paperwork processing), Title & Registration Fees (varies by state), Destination Fee (~$900–1,500 for shipping), Advertising Fees (regional dealer costs), and Insurance (mandatory for full coverage on financed cars). Some dealers add questionable fees—always demand justification. These can be paid upfront or rolled into the loan. Choose "Include taxes and fees in loan" if bundling costs into financing.' },
      { title: 'Auto Loan Strategies for Best Results', content: 'Be well-prepared before visiting a dealership. Determine your affordable budget first. Research specific makes and models and their market rates. Get quotes from multiple lenders (banks, credit unions) and compare. Building strong credit before applying improves your rate dramatically—even a 1% rate difference saves thousands. Decide whether a cash rebate or low interest rate is better for your situation. Consider pre-owned vehicles (new cars depreciate 10%+ immediately) or leasing for temporary needs. Get pre-approved before arriving at the dealership to strengthen your negotiating position.' },
      { title: 'Paying Off Your Auto Loan Early', content: 'Most auto loans allow early payoff without penalty (check your contract). Paying extra reduces your loan balance faster, decreasing total interest paid. Example: On a $40,000 loan at 5% over 60 months, adding just $100 extra monthly saves thousands in interest and shortens the loan by years. Biweekly payments (half the monthly amount every 2 weeks) result in 26 payments annually instead of 12 monthly, effectively adding one extra payment yearly. Consider these strategies if your budget allows.' },
      { title: 'Trade-In Value Considerations', content: 'Trading in your current vehicle provides credit toward the new purchase. Don\'t expect maximum value—dealerships buy low to maximize profit. Selling privately typically yields more money. Most states (except CA, DC, HI, KY, MD, MI, MT, VA) reduce sales tax by your trade-in value. Example: $50,000 car with $10,000 trade-in at 8% tax = $3,200 tax (not $4,000). Some states calculate tax on full price regardless. Always understand your state\'s trade-in tax rules. Clear any outstanding loan on your trade-in first—the dealer will handle payment from trade-in proceeds.' },
      { title: 'Cash Purchase vs. Auto Financing', content: 'Buying with cash eliminates monthly payments, interest charges, and payment stress. You gain immediate ownership and full flexibility. However, auto loans at low rates (0–3%) may justify financing if you can invest the cash at higher returns. Building credit through on-time payments helps your credit score for future needs. Financing gives you the asset while building financial credibility. Consider your overall financial situation: emergency fund status, other debts, and interest rate environment when deciding.' },
    ],
  },
  'loan-calculator': {
    howTo: 'Choose a loan type: Amortized (fixed payments), Deferred (single lump sum at maturity), or Bond (predetermined face value). Enter the loan amount, annual interest rate, term, and compounding frequency. Click Calculate to see monthly/annual payment, total interest, and total amount owed. Use this for mortgages, auto loans, personal loans, student loans, or bonds.',
    formula: 'Amortized: PMT = [P × r(1+r)^n] / [(1+r)^n − 1]. Deferred: A = P(1+r)^t. Bond: P = FV / (1+r)^t, where P = principal, r = rate, n/t = periods, FV = face value.',
    faqs: [
      { q: 'What is an amortized loan?', a: 'An amortized loan has regular payments (usually monthly) where each payment includes principal and interest. Common examples: mortgages, auto loans, personal loans. The balance decreases over time until fully paid.' },
      { q: 'What is a secured vs unsecured loan?', a: 'Secured loans require collateral (home, car, etc.). If you default, the lender can seize the asset. Unsecured loans (credit cards, personal loans) have no collateral but higher interest rates and stricter approval.' },
      { q: 'What are the 5 C\'s of credit?', a: 'Lenders evaluate: (1) Character—credit history & reliability, (2) Capacity—debt-to-income ratio, (3) Capital—savings & assets, (4) Collateral—items pledged, (5) Conditions—lending climate & loan purpose.' },
      { q: 'What is APR vs Interest Rate?', a: 'Interest Rate is the cost of borrowing principal only. APR (Annual Percentage Rate) includes interest plus fees (broker fees, points, closing costs). APR gives a more complete picture of total borrowing cost.' },
      { q: 'What is a deferred payment loan?', a: 'A deferred payment loan has a single large payment due at maturity, with little-to-no payments beforehand. Common in commercial loans and balloon loans. Interest accrues throughout the term.' },
      { q: 'How do I choose between amortized and deferred loans?', a: 'Choose amortized for predictable cash flow. Choose deferred only when your cash flow or project timeline supports a large maturity payment.' },
      { q: 'What is a balloon payment risk?', a: 'Balloon structures can create refinancing risk if market rates rise or credit conditions tighten before maturity.' },
      { q: 'Can I reduce loan interest without refinancing?', a: 'Yes. You can usually pay extra principal on amortized loans to reduce balance faster and lower total interest.' },
      { q: 'Why do lenders check debt-to-income ratio?', a: 'DTI helps lenders estimate repayment ability. Lower DTI usually improves approval odds and may qualify for better rates.' },
      { q: 'Does compounding frequency affect loan cost?', a: 'Yes. More frequent compounding can increase effective borrowing cost, so compare offers on effective annual basis when possible.' },
    ],
    sections: [
      { title: 'Types of Loans', content: 'Loans are categorized by repayment structure. Amortized loans spread payments evenly over time—principal and interest combined in each payment. Deferred payment loans (balloon loans) require a single large payment at maturity with minimal interim payments. Bonds pay a predetermined amount at maturity, often with coupon interest payments. Most consumer loans are amortized (mortgages, auto loans, personal loans). Commercial loans often use deferred structures. Understanding your loan type affects financial planning and budgeting.' },
      { title: 'Secured vs Unsecured Loans', content: 'Secured loans require collateral (home, car, equipment). If you default, the lender seizes the asset. Secured loans have lower interest rates (less lender risk) and higher borrowing limits. Unsecured loans require no collateral but have higher interest rates and lower limits. Examples: secured = mortgages, auto loans; unsecured = credit cards, personal loans. Lenders may require a co-signer for unsecured loans. Building good credit helps you qualify for better unsecured rates.' },
      { title: 'The 5 C\'s of Credit', content: 'Lenders evaluate loans using five criteria: Character (credit history, payment track record, reliability), Capacity (debt-to-income ratio, ability to repay), Capital (savings, assets, down payment), Collateral (items pledged as security), and Conditions (economic climate, loan purpose, market trends). Strong performance across all five improves approval odds and loan terms. Character is often most important—consistent on-time payment history demonstrates reliability. Capacity ensures you can afford payments. Capital shows skin-in-the-game commitment.' },
      { title: 'APR vs Interest Rate', content: 'Interest Rate is the pure cost of borrowing principal. APR (Annual Percentage Rate) includes interest plus all fees, points, broker fees, and closing costs, expressed as an annual percentage. For major loans like mortgages, APR can differ significantly from interest rate—sometimes by 0.5–1%. APR gives the true borrowing cost. Always compare APRs when shopping for loans, not just interest rates. Federal Truth in Lending Act requires disclosure of APR.' },
      { title: 'Computing Monthly Payments', content: 'For amortized loans, the monthly payment formula is: PMT = [P × r(1+r)^n] / [(1+r)^n − 1], where P = principal, r = monthly rate (annual ÷ 12), n = number of payments. Each payment includes interest (calculated on remaining balance) and principal reduction. Early payments are mostly interest; later payments mostly principal—this is amortization. Longer terms mean lower monthly payments but higher total interest. Shorter terms mean higher payments but less total interest.' },
      { title: 'Bonds and Fixed Income Instruments', content: 'Bonds are debt instruments—you lend money to a borrower (company or government) who promises to repay with interest. Face/Par value is the amount repaid at maturity. Coupon rate is the annual interest payment, usually semi-annual. Zero-coupon bonds pay no interim interest but sell at deep discounts. Bond prices fluctuate inversely with interest rates—when rates rise, bond prices fall, and vice versa. Conservative investors prefer bonds for steady income; growth investors prefer stocks. Bond ratings (AAA to C) indicate credit quality and default risk.' },
      { title: 'Managing Multiple Loans', content: 'When managing multiple loans, prioritize by interest rate. Pay minimums on low-rate loans and put extra funds toward high-rate debt—this is the "avalanche method." Alternatively, pay off smallest balance first for psychological wins (snowball method). Consider refinancing high-rate loans if rates drop. Consolidating multiple loans may reduce monthly payments but extends term (usually more total interest). Use calculators to compare strategies. Keeping all payments current maintains your credit score, enabling better refinancing opportunities.' },
    ],
  },
  'interest-calculator': {
    howTo: 'Enter your initial investment amount, annual interest rate, and time period (years/months). Choose compounding frequency (daily, monthly, quarterly, annually) and add periodic contributions if desired. Optionally include tax rate and inflation to see real vs nominal returns. The calculator displays total interest earned and shows your money\'s growth over time.',
    formula: 'Compound Interest: A = P(1+r/n)^(nt), where P = principal, r = annual rate, n = compounding periods per year, t = time in years. Rule of 72: Years to double ≈ 72 ÷ interest rate (%).',
    faqs: [
      { q: 'What is the difference between simple and compound interest?', a: 'Simple interest: calculated only on the principal (rare). Compound interest: calculated on principal + accumulated interest (common). Compound interest grows exponentially; the more frequently it compounds, the faster it grows.' },
      { q: 'What is the Rule of 72?', a: 'A quick mental math trick: Divide 72 by your interest rate to estimate years needed to double money. Example: At 6% interest, money doubles in ~12 years (72÷6=12). Accurate for rates 5–10%.' },
      { q: 'How do taxes affect my returns?', a: 'Interest income is taxable in most cases. If your marginal tax rate is 25% and you earn 5% interest, your after-tax return is ~3.75%. CDs, bonds, and savings account interest are fully taxable; Treasury bonds may have tax advantages.' },
      { q: 'How does inflation reduce purchasing power?', a: 'Inflation (typically 2–3% annually) reduces what each dollar can buy. A 5% interest rate with 3% inflation means 2% real growth. To maintain value, your return must exceed inflation.' },
      { q: 'What\'s the best compounding frequency?', a: 'The more frequent, the better: Daily > Monthly > Quarterly > Annually. Continuous compounding is theoretical maximum. Most savings accounts compound daily; investment accounts vary.' },
      { q: 'What is the difference between APR and APY?', a: 'APR is nominal yearly rate, while APY includes compounding effect and reflects effective annual growth or cost.' },
      { q: 'Should I contribute monthly or annually for better growth?', a: 'More frequent contributions generally improve outcomes because funds start compounding earlier throughout the year.' },
      { q: 'Is fixed interest better than floating interest?', a: 'Fixed rates improve predictability. Floating rates can be lower initially but add uncertainty because market index changes may raise costs.' },
      { q: 'Can this calculator estimate real return after inflation?', a: 'Yes, by adding expected inflation and tax assumptions you can compare nominal balance with inflation-adjusted purchasing power.' },
      { q: 'How can I maximize long-term interest growth?', a: 'Start early, contribute consistently, reinvest earnings, minimize fees, and target returns that beat inflation over long horizons.' },
    ],
    sections: [
      { title: 'Simple Interest Explained', content: 'Simple interest is calculated only on the principal (original amount). Formula: Interest = Principal × Rate × Time. Example: $1,000 at 5% for 2 years = $1,000 × 0.05 × 2 = $100 interest. Simple interest is rarely used in real-world consumer lending but appears in some short-term loans. Each period, you earn the same amount. Simple interest is straightforward but disadvantageous for borrowers—lenders prefer compound interest.' },
      { title: 'Compound Interest Fundamentals', content: 'Compound interest earns interest on both principal AND previously earned interest. Formula: A = P(1+r)^t. Example: $1,000 at 5% compounded annually for 2 years = $1,000 × (1.05)^2 = $1,102.50 ($102.50 interest—$25 more than simple). Compounding frequency matters: Daily > Monthly > Quarterly > Annually. The more frequently interest compounds, the more total interest earned. This is why continuous compounding yields the highest return.' },
      { title: 'Rule of 72 for Quick Calculations', content: 'The Rule of 72 is a mental math shortcut: Divide 72 by your interest rate to estimate how many years your money takes to double. At 6%: 72÷6 = 12 years to double. At 8%: 72÷8 = 9 years to double. At 3%: 72÷3 = 24 years to double. Accurate for rates between 5–10%, reasonably close for 1–20%. Useful for comparing investments and understanding the power of compound growth. Example: $10,000 at 8% doubles to $20,000 in ~9 years.' },
      { title: 'The Impact of Taxes on Returns', content: 'Interest income is taxable unless specifically exempted. Your "after-tax return" = nominal return × (1 − tax rate). Example: 5% interest with 25% tax rate = 5% × (1 − 0.25) = 3.75% actual return. CDs, savings account interest, and bond interest are fully taxable. Treasury bonds exempt from state/local tax but taxed federally. Municipal bonds often tax-exempt. High-income earners benefit from tax-advantaged accounts (IRAs, 401k). Always calculate after-tax returns for accurate comparison of investment options.' },
      { title: 'Inflation\'s Effect on Purchasing Power', content: 'Inflation (average ~3% annually) reduces what each dollar buys. Real return = nominal return − inflation rate. Example: 5% interest with 3% inflation = 2% real return. Your purchasing power grew 2%, not 5%. This is why savings accounts earning 0.5% annually lose value to 3% inflation (−2.5% real return). Long-term investing should target returns exceeding inflation. Inflation-protected securities (TIPS) adjust for inflation, guaranteeing real returns.' },
      { title: 'Periodic Contributions and Growth', content: 'Adding regular deposits (monthly, quarterly, annually) accelerates growth. Future Value = P(1+r)^t + PMT × [((1+r)^t − 1) / r]. Deposits at period START earn more than deposits at period END. Example: $1,000 monthly at 6% annual for 10 years grows to ~$155,000 (vs. ~$150,000 with end-of-period deposits). This demonstrates the power of consistent investing. Starting early maximizes compound growth. Even small periodic contributions significantly increase long-term wealth. Use the calculator to model your contribution strategy.' },
      { title: 'Choosing Between Investments', content: 'Compare after-tax, inflation-adjusted returns across investment options: Savings accounts (0.5–5% APY), CDs (3–5% fixed), Bonds (2–5% yield), Stocks (8–10% average), Mutual funds (varies). Short-term (< 5 years): Choose stable, low-risk options. Long-term (10+ years): Can tolerate volatility for higher returns. Diversify across types. Reinvest dividends for compounding. Use this calculator to project different scenarios and make informed decisions.' },
    ],
  },
  'payment-calculator': {
    howTo: 'Use the Fixed Term tab to calculate monthly payment for a loan with a set term. Use the Fixed Payments tab to calculate how long it takes to pay off a loan with a fixed monthly payment. Enter loan amount, interest rate, and term (or desired monthly payment). Choose between fixed or variable rates. The calculator displays monthly payment, total interest, and an amortization schedule.',
    formula: 'Fixed Term: PMT = [P × r(1+r)^n] / [(1+r)^n − 1]. Fixed Payment: n = −log(1−[P×r/PMT]) / log(1+r), where P = principal, r = monthly rate, PMT = payment.',
    faqs: [
      { q: 'What is the difference between fixed and variable interest rates?', a: 'Fixed rates stay the same for the entire loan term, so your payment never changes. Variable (adjustable) rates fluctuate with market indices (Fed rate, LIBOR). Variable rates often start lower but can increase, making payments unpredictable.' },
      { q: 'What is APR and why does it differ from the stated interest rate?', a: 'APR (Annual Percentage Rate) includes interest plus fees, commissions, and closing costs rolled into a yearly rate. Interest Rate is just the cost of borrowing. APR gives a true picture of total borrowing cost.' },
      { q: 'Should I choose a shorter or longer loan term?', a: 'Shorter terms (15 yrs): Higher monthly payment, much less total interest paid, faster debt freedom. Longer terms (30 yrs): Lower monthly payment, higher total interest paid, more flexibility. Choose based on your budget.' },
      { q: 'What happens if my monthly payment doesn\'t cover interest?', a: 'If your payment is too low to cover accrued interest, your balance grows (negative amortization). This is rare but can happen with option-ARM mortgages. Avoid this by ensuring your payment covers at least the interest.' },
      { q: 'Can I pay off my loan early and avoid interest?', a: 'Yes, most loans allow early payoff without penalty (though some mortgages have prepayment penalties—check your contract). Every extra dollar reduces principal, saving interest and shortening the loan.' },
      { q: 'How do I calculate monthly loan payment quickly?', a: 'Use loan amount, APR, and term with amortization formula or this calculator to get fixed monthly payment instantly.' },
      { q: 'When should I use fixed payment mode instead of fixed term mode?', a: 'Use fixed payment mode when your monthly budget is known and you want to estimate payoff duration.' },
      { q: 'Can increasing monthly payment shorten loan term significantly?', a: 'Yes. Even modest extra payments can reduce years from payoff and cut total interest cost.' },
      { q: 'Why might two lenders show similar rate but different payment?', a: 'Fees, APR structure, and compounding assumptions can change effective cost even when headline rates look similar.' },
      { q: 'Is biweekly payment better than monthly payment?', a: 'Biweekly plans can create one extra payment per year, often shortening payoff and reducing interest, depending on lender processing rules.' },
    ],
    sections: [
      { title: 'Fixed-Rate Loans Explained', content: 'Fixed-rate loans maintain the same interest rate for the entire loan term. Your monthly payment stays constant throughout—predictable and stable. Fixed rates are common for mortgages, auto loans, and personal loans. Lock in lower rates when available; when rates rise, you benefit from your locked-in rate. Fixed-rate loans are ideal for budget planning since payments never change. Trade-off: initial rates may be higher than variable-rate introductory offers, but stability provides long-term peace of mind.' },
      { title: 'Variable and Adjustable-Rate Loans', content: 'Variable (adjustable) rates change over time, typically tied to an index like the Fed rate or LIBOR. ARMs (Adjustable-Rate Mortgages) often start low but adjust periodically (annually, semi-annually). When rates rise, your payment increases; when rates fall, payment decreases. ARMs can include rate caps (maximum allowed increase). Variable rates risk: when rates spike, payments may become unaffordable. Benefit: lower starting rates. Choose variable only if you can handle payment uncertainty or plan to refinance before rate adjustments.' },
      { title: 'Understanding APR vs Interest Rate', content: 'Interest Rate is the pure cost of borrowing. APR includes interest plus ALL fees: broker fees, discount points, closing costs, origination fees. For a $300,000 mortgage at 5% interest with $3,000 in fees, the APR might be 5.4%. Federal Truth in Lending Act requires APR disclosure. Always compare APRs across lenders, not interest rates. APR gives the true annual cost of borrowing. Small APR differences matter significantly over time.' },
      { title: 'Choosing Between Terms', content: '15-year mortgages: Higher payment (~$2,111 on $300k at 6%), but total interest saved is substantial (~$163k less than 30-year). Build equity faster. Ideal if you can afford higher payments. 30-year mortgages: Lower payment (~$1,799), more monthly budget flexibility, more total interest paid (~$347k). Ideal if cash flow is tight. Consider: your income stability, other debts, and goals. Use calculators to compare exact payments and total costs. Some choose 20-year as middle ground.' },
      { title: 'The Dangers of Negative Amortization', content: 'Negative amortization occurs when your payment is too small to cover accrued interest—your balance grows instead of shrinking. Example: Option ARM mortgages allowed minimal payments, causing balances to increase. During 2008 crisis, many borrowers owed more than their homes\' value. Avoid: ensure monthly payment covers at least the interest. Never accept loan terms where payment doesn\'t cover interest. If offered, recalculate with higher payment or longer term. Always verify your payment schedule—balances should always decrease.' },
      { title: 'Early Payoff Benefits and Strategies', content: 'Paying off loans early saves substantial interest. On a $300,000 mortgage at 6% over 30 years, paying an extra $200/month saves ~$64,000 in interest and reduces term to ~22 years. Early payoff strategies: make biweekly payments (26 annual vs 12 monthly), add bonuses/tax refunds to principal, or increase monthly payment. Check your loan for prepayment penalties (rare with mortgages, more common with bonds). The sooner you reduce principal, the more interest you save. Every extra dollar impacts total cost.' },
      { title: 'Credit Impact and Loan Shopping', content: 'Your credit score affects the interest rate offered. Excellent credit (750+) gets best rates; poor credit (below 620) pays much higher rates. Improve credit before applying: pay bills on time, reduce debt, check credit reports for errors. Multiple loan inquiries within 45 days count as single inquiry (hard pull). Shopping rates is smart but do it quickly to minimize impact. Lenders offer rates based on credit score, income, debt-to-income ratio, and loan characteristics. Build credit before major borrowing needs.' },
    ],
  },
  'finance-calculator': {
    howTo: 'Enter any known values among present value (PV), payment (PMT), annual rate, and number of periods. Use the calculator to project future value, compare financing options, or estimate how much recurring savings is needed to reach a target amount. Keep rate and period units consistent (for example, annual rate with years, or monthly rate with months).',
    formula: 'Core TVM formulas: FV = PV(1+r)^n + PMT[((1+r)^n - 1)/r], PV = FV/(1+r)^n, PMT = [FV - PV(1+r)^n] * r / ((1+r)^n - 1).',
    faqs: [
      { q: 'What is a finance calculator used for?', a: 'It solves time value of money (TVM) problems such as loan payments, savings growth, future value targets, and present value decisions.' },
      { q: 'What is TVM (Time Value of Money)?', a: 'TVM means money today is worth more than the same money in the future because it can earn returns over time.' },
      { q: 'What is the difference between nominal and effective rate?', a: 'Nominal APR is the stated annual rate, while effective annual rate (EAR/APY) includes compounding effects and represents true annual growth cost.' },
      { q: 'Should I use monthly or yearly periods?', a: 'Use the period that matches your cash flow. If payments are monthly, convert annual rate to monthly and set number of periods in months.' },
      { q: 'Can this help compare two loan offers?', a: 'Yes. Compare payment amount, total paid, and total interest under each rate/term combination to identify the better offer.' },
      { q: 'What does present value (PV) mean in finance?', a: 'PV is today\'s value of money you will receive or pay in the future, discounted by a required return rate.' },
      { q: 'What does future value (FV) mean in finance?', a: 'FV is the amount an investment or cash flow grows to after compounding over a chosen period.' },
      { q: 'Why are period units important in TVM calculations?', a: 'Mismatched units can produce wrong outputs. Rate, payment frequency, and number of periods must use the same time basis.' },
      { q: 'Can finance calculators be used for retirement planning?', a: 'Yes, TVM functions are commonly used to estimate contributions, target balances, and sustainable income plans.' },
      { q: 'How can I validate calculator outputs before making decisions?', a: 'Run multiple scenarios, verify assumptions, compare with lender disclosures, and cross-check with APR-based total cost analysis.' },
    ],
    sections: [
      { title: 'What a Finance Calculator Solves', content: 'A finance calculator handles four core variables: present value (PV), payment (PMT), interest rate (r), and number of periods (n). With any three, you can solve the fourth. This makes it useful for planning loans, investments, retirement contributions, and purchase decisions.' },
      { title: 'Time Value of Money Basics', content: 'TVM is the foundation of finance math. A dollar today can be invested to become more later. This is why future cash flows are discounted back to present value and why compounding grows balances over time.' },
      { title: 'Compounding Frequency Matters', content: 'Interest can compound annually, quarterly, monthly, or daily. More frequent compounding increases effective returns for savers and effective borrowing cost for debt. Always compare products using effective annual rate (EAR/APY).' },
      { title: 'Using PV, FV, and PMT Together', content: 'PV answers what a future target is worth today. FV estimates what today\'s savings become later. PMT estimates required regular deposits or loan installments. Together they help you plan goals realistically.' },
      { title: 'Loan and Investment Decision Making', content: 'For loans, compare monthly payment and total interest. For investments, compare total contributions versus growth from return. Small differences in rate or term can create large long-term cost and return differences.' },
      { title: 'Practical Validation Tips', content: 'Double-check units, signs, and assumptions. Keep all inputs in the same period system, include realistic rates, and test multiple scenarios (optimistic/base/conservative) before making final decisions.' },
    ],
  },
  'tax-calculator': {
    howTo: 'Enter your taxable income and estimated state tax rate, then click Calculate. The calculator estimates federal tax using progressive tax brackets, adds state tax, and returns total tax, effective tax rate, marginal federal bracket, and estimated net income. This is useful for salary planning, side-income projections, and year-end tax estimates.',
    formula: 'Total Tax = Federal Progressive Tax + (State Rate × Taxable Income). Effective Rate = Total Tax / Taxable Income. Net Income = Taxable Income − Total Tax.',
    faqs: [
      { q: 'What is the difference between marginal and effective tax rate?', a: 'Marginal rate is the tax rate on your last dollar earned. Effective rate is total tax divided by total taxable income, usually much lower than marginal rate.' },
      { q: 'Why is federal tax progressive?', a: 'Progressive tax means different portions of income are taxed at different rates. Moving into a higher bracket does not tax your entire income at that higher rate.' },
      { q: 'Does this include deductions and credits?', a: 'This tool is an estimate model and does not apply all possible deductions or credits. Use it for planning, then confirm with detailed tax software or a CPA.' },
      { q: 'How should I choose state tax rate input?', a: 'Use your approximate effective state income tax rate. If your state has no income tax, enter 0%.' },
      { q: 'Can I use this calculator for paycheck withholding?', a: 'Yes, as a rough estimate. For exact withholding, consider filing status, allowances, pre-tax deductions, and local taxes in payroll tools.' },
      { q: 'Why does net income here differ from my paycheck?', a: 'Paychecks also include payroll taxes, retirement contributions, health insurance, and other deductions beyond simple federal + state income tax estimates.' },
      { q: 'Can this help with side hustle or freelance planning?', a: 'Yes. It helps estimate how added taxable income may change total tax and effective rate for budgeting purposes.' },
      { q: 'What is taxable income exactly?', a: 'Taxable income is the amount of income subject to tax after eligible adjustments and deductions.' },
      { q: 'Should I update this estimate during the year?', a: 'Yes. Recalculate when your income changes, bonuses occur, or tax assumptions shift.' },
      { q: 'When should I talk to a tax professional?', a: 'If you have multiple income sources, business income, complex deductions, or large capital gains, professional advice is recommended.' },
    ],
    sections: [
      { title: 'How Progressive Tax Works', content: 'Federal income tax is applied in layers. Each bracket taxes only the portion of income that falls inside that range. This means crossing into a higher bracket does not retroactively increase tax on lower portions.' },
      { title: 'Effective Rate vs Planning Rate', content: 'Effective tax rate is best for high-level planning and budgeting. Marginal tax rate is best for incremental decisions like bonuses, overtime, freelance work, or investment withdrawals.' },
      { title: 'State Tax Considerations', content: 'State tax structures vary widely. Some states use flat rates, some progressive rates, and some have no income tax. Use a realistic estimate for your state and revisit assumptions when laws change.' },
      { title: 'Using Tax Estimates in Budgeting', content: 'Use estimated net income to set savings goals, debt payoff plans, and lifestyle budgets. Conservative tax assumptions can reduce surprises at year-end.' },
      { title: 'Limits of Simplified Tax Models', content: 'Simplified calculators are excellent for quick scenarios but cannot replace full return preparation. Always validate with complete records, filing status details, and current-year tax guidance.' },
    ],
  },
  'sales-tax-calculator': {
    howTo: 'Enter the pre-tax price and sales tax rate, then click Calculate. The calculator returns tax amount, total after tax, and effective rate. Use it for online checkout estimates, invoice validation, and comparing locations with different tax rates.',
    formula: 'Tax Amount = Price * (Tax Rate / 100). Total Price = Price + Tax Amount. Reverse-tax price from final total: Pre-tax = Total / (1 + Tax Rate).',
    faqs: [
      { q: 'How do I calculate sales tax quickly?', a: 'Multiply the pre-tax price by the tax rate as a decimal. Add that tax amount to the original price to get total checkout cost.' },
      { q: 'What if I only know the final total with tax?', a: 'Use reverse tax: pre-tax price = total / (1 + tax rate). Then tax amount = total - pre-tax.' },
      { q: 'Does this include local and city taxes?', a: 'It includes whatever combined rate you enter. If your area has state + county + city tax, add them together as one rate input.' },
      { q: 'Why do two stores show different tax totals?', a: 'Different jurisdictions, product taxability rules, rounding methods, and exemptions can produce different final tax amounts.' },
      { q: 'Is sales tax applied before or after discount?', a: 'In most places, sales tax is calculated on discounted price, but rules can vary by location and promotion type.' },
      { q: 'How do I estimate tax on multiple items?', a: 'Sum taxable item prices first, then apply combined tax rate to the subtotal for a quick estimate.' },
      { q: 'Can this calculator help business pricing?', a: 'Yes. It helps quote customer-facing totals and verify whether listed prices are pre-tax or tax-inclusive.' },
      { q: 'Why can one-cent differences happen?', a: 'Cash registers often round per-line item or per-invoice, so tiny rounding differences are normal.' },
      { q: 'Do all goods and services use the same rate?', a: 'No. Some categories may be exempt or taxed at special rates depending on jurisdiction.' },
      { q: 'Should I update tax assumptions regularly?', a: 'Yes. Tax rates and rules can change, so update assumptions before major purchases or pricing updates.' },
    ],
    sections: [
      { title: 'Sales Tax Basics', content: 'Sales tax is usually a percentage added to taxable purchases at checkout. Final amount paid equals item subtotal plus tax amount.' },
      { title: 'Tax-Inclusive vs Tax-Exclusive Pricing', content: 'Some markets show tax-exclusive sticker prices while others display tax-inclusive totals. Reverse-tax formulas help convert between the two.' },
      { title: 'Combined Jurisdiction Rates', content: 'Real transactions may include multiple layers such as state, county, and city rates. Use a combined rate for practical estimation.' },
      { title: 'Budgeting and Purchase Planning', content: 'Including tax in planning prevents underestimating true purchase cost and improves budgeting accuracy, especially for large purchases.' },
      { title: 'Business and Compliance Use', content: 'For merchants, sales-tax math supports accurate quoting, invoice checks, and reconciliation before filing obligations.' },
    ],
  },
  'salary-calculator': {
    howTo: 'Enter your annual salary, weekly work hours, paid vacation days, and paid holidays. Click Calculate to convert salary into monthly, biweekly, weekly, daily, and hourly equivalents. Use this to compare job offers, understand effective hourly compensation, and estimate take-home planning targets.',
    formula: 'Hourly Pay = Annual Salary / ((52 * Weekly Hours) - (Vacation Days + Holidays) * (Weekly Hours / 5)). Monthly Pay = Annual Salary / 12. Biweekly Pay = Annual Salary / 26. Weekly Pay = Annual Salary / 52.',
    faqs: [
      { q: 'How is hourly rate derived from salary?', a: 'Hourly rate is estimated by dividing annual salary by actual worked hours in a year after accounting for paid time off assumptions.' },
      { q: 'Why does paid vacation affect effective hourly pay?', a: 'If paid vacation and holidays are included, you receive full salary while working fewer hours, which increases effective hourly compensation.' },
      { q: 'What is the difference between gross and net salary?', a: 'Gross salary is pre-tax income. Net salary is take-home pay after tax, benefits, and other payroll deductions.' },
      { q: 'Should I compare offers by annual salary only?', a: 'No. Compare salary, benefits, bonus structure, retirement match, health costs, PTO, and expected workload together.' },
      { q: 'Can I use this for part-time roles?', a: 'Yes. Adjust weekly hours to your expected schedule and use results as an annualized compensation estimate.' },
      { q: 'How do bonuses impact salary comparison?', a: 'Bonuses can materially increase total compensation, but variable bonuses should be discounted based on payout reliability.' },
      { q: 'Why biweekly and semi-monthly pay feel different?', a: 'Biweekly means 26 checks per year; semi-monthly means 24 checks. Annual total may be the same, but cash-flow timing differs.' },
      { q: 'How can I estimate take-home pay from this?', a: 'Apply approximate federal/state/local tax and deduction assumptions to gross pay outputs for quick net-pay planning.' },
      { q: 'Is hourly conversion useful for salaried workers?', a: 'Yes. It helps evaluate workload changes, overtime expectations, and whether total compensation aligns with effort.' },
      { q: 'How often should I recalculate salary metrics?', a: 'Recalculate when compensation changes, work hours shift, or benefit packages are updated.' },
    ],
    sections: [
      { title: 'Gross Salary Breakdown', content: 'Breaking annual salary into monthly, biweekly, weekly, daily, and hourly values improves budgeting accuracy. It helps align rent, debt, savings, and lifestyle decisions with real cash-flow cadence.' },
      { title: 'Offer Comparison Framework', content: 'When comparing jobs, evaluate total compensation: base salary, variable pay, healthcare cost, retirement match, paid leave, and workload expectations. A lower base can still be better with stronger benefits.' },
      { title: 'PTO and Holiday Economics', content: 'Paid time off is part of compensation. More paid leave can increase effective hourly value and improve long-term sustainability without changing headline salary.' },
      { title: 'From Gross to Net Planning', content: 'Use salary outputs as a first step, then layer estimated taxes and deductions to produce practical take-home budgets. Conservative net assumptions reduce budget risk.' },
      { title: 'Using Salary Math for Career Decisions', content: 'Salary calculators support negotiation and career planning by showing whether raises, promotions, role changes, or relocation actually improve financial outcomes.' },
    ],
  },
  '401k-calculator': {
    howTo: 'Enter current age, retirement age, current 401(k) balance, annual salary, employee contribution rate, employer match settings, and expected annual return. Click Calculate to project retirement balance, total contributions, employer match value, and growth from compounding.',
    formula: 'Future Value is modeled by yearly compounding with recurring contributions: Balance_next = Balance_current * (1 + r) + Employee Contribution + Employer Match. Contribution = Salary * Contribution Rate. Match depends on plan rules.',
    faqs: [
      { q: 'What is a 401(k)?', a: 'A 401(k) is an employer-sponsored retirement plan that allows pre-tax or Roth contributions, often with employer matching.' },
      { q: 'Why is employer match important?', a: 'Employer match is essentially additional compensation. Contributing enough to capture the full match can significantly improve long-term retirement outcomes.' },
      { q: 'What is the difference between traditional and Roth 401(k)?', a: 'Traditional contributions are usually pre-tax now and taxed at withdrawal. Roth contributions are after-tax now and may be tax-free in qualified retirement withdrawals.' },
      { q: 'How much should I contribute?', a: 'A common baseline is at least enough to receive full employer match. Many long-term plans then target 10-15% total retirement savings rate.' },
      { q: 'What return rate should I assume?', a: 'Use realistic long-term assumptions and test multiple scenarios (conservative, base, optimistic) instead of one aggressive estimate.' },
      { q: 'Can I include salary growth in planning?', a: 'Yes. If salary grows over time, contributions typically grow too, which can materially increase ending balance.' },
      { q: 'How does inflation affect retirement projections?', a: 'Inflation reduces purchasing power. Consider inflation-adjusted targets to avoid overestimating future lifestyle affordability.' },
      { q: 'What happens if I withdraw early?', a: 'Early withdrawals may trigger taxes and penalties depending on account type and age, reducing long-term compounding potential.' },
      { q: 'Should I rebalance my 401(k) investments?', a: 'Periodic rebalancing helps maintain your intended risk allocation as markets move over time.' },
      { q: 'How often should I revisit my 401(k) plan?', a: 'Review yearly or after major life changes, compensation changes, or market shifts.' },
    ],
    sections: [
      { title: 'Compounding and Contribution Discipline', content: '401(k) growth is driven by both return and consistent contributions. Even moderate contribution increases can create substantial long-term differences due to compounding.' },
      { title: 'Employer Match Optimization', content: 'Failing to capture full match means leaving compensation on the table. Prioritize contribution level that secures maximum eligible match before allocating to lower-priority goals.' },
      { title: 'Tax Strategy Considerations', content: 'Traditional vs Roth decisions depend on expected current and future tax brackets. A blended strategy can improve flexibility in retirement withdrawals.' },
      { title: 'Risk, Allocation, and Time Horizon', content: 'Portfolio allocation should reflect retirement horizon and risk tolerance. Longer horizons generally allow more growth exposure; shorter horizons usually prioritize stability.' },
      { title: 'Scenario Planning for Better Decisions', content: 'Model different return, contribution, and retirement-age assumptions. Scenario planning improves resilience and helps avoid overconfidence in single-path forecasts.' },
    ],
  },
  'interest-rate-calculator': {
    howTo: 'Enter principal, payment amount, and term to estimate implied interest rate, or provide rate assumptions to compare total borrowing cost under different scenarios. Use consistent period units (monthly with months, annual with years) to avoid distorted outputs.',
    formula: 'For amortized loans, payment relation is PMT = [P * r(1+r)^n] / [(1+r)^n - 1]. Solving for r typically requires iterative methods (numerical approximation). Effective Annual Rate (EAR) = (1 + r/m)^m - 1.',
    faqs: [
      { q: 'What is nominal rate vs effective rate?', a: 'Nominal rate is the stated annual percentage before compounding impact. Effective rate includes compounding and reflects true annual cost or return.' },
      { q: 'Why might APR differ from interest rate?', a: 'APR can include lender fees and financing costs in addition to base interest, making it a better total-cost comparison metric.' },
      { q: 'How can I estimate the implied rate from payment?', a: 'Given principal, payment, and term, implied rate is solved numerically since the amortization formula cannot be rearranged into a simple closed form for rate.' },
      { q: 'Why do small rate differences matter so much?', a: 'Over long terms, small rate changes compound into large differences in total interest paid or earned.' },
      { q: 'Should I compare offers using APR or monthly payment?', a: 'Use both. Monthly payment reflects affordability, while APR and total paid reflect long-term cost.' },
      { q: 'How does loan term interact with rate?', a: 'Longer terms often lower monthly payment but increase total interest exposure even at the same rate.' },
      { q: 'Can I use this for savings and investment rates too?', a: 'Yes. Rate math applies to both borrowing cost and investment return, as long as compounding assumptions are clear.' },
      { q: 'What is a realistic stress test for rates?', a: 'Model scenarios with rates 1-3 percentage points above current assumptions to evaluate affordability under adverse conditions.' },
      { q: 'When does refinancing make sense?', a: 'Refinancing can make sense when rate reduction and term structure offset all switching costs within a reasonable break-even period.' },
      { q: 'How often should I revisit rate assumptions?', a: 'Revisit during major policy changes, lender repricing, income changes, or before large borrowing decisions.' },
    ],
    sections: [
      { title: 'Why Rate Interpretation Matters', content: 'Interest rate assumptions shape affordability, risk, and long-term financial outcomes. Misreading nominal versus effective rate can lead to underestimating true costs.' },
      { title: 'Compounding and Effective Cost', content: 'Compounding frequency changes effective cost even if headline annual rate appears identical. Always normalize offers to effective annual terms when comparing.' },
      { title: 'Rate Sensitivity Analysis', content: 'Testing multiple rates helps quantify downside risk. Sensitivity analysis improves confidence before committing to long-duration loans or investment plans.' },
      { title: 'Decision Use Cases', content: 'Interest-rate calculations support mortgage comparisons, loan negotiations, debt consolidation analysis, and return benchmarking for savings strategies.' },
      { title: 'Practical Validation Checklist', content: 'Validate period units, include known fees, compare APR and total paid, and confirm assumptions with official lender disclosures before final decisions.' },
    ],
  },
  'retirement-calculator': {
    howTo: 'Enter your current age, retirement age, current retirement savings, annual savings amount, annual return rate (%), annual inflation rate, and expected life expectancy. Use Retirement Rules to apply pre-calculated savings targets (4%, 10%, 80% rules). The calculator projects whether you have enough saved for retirement and shows year-by-year accumulation and drawdown.',
    formula: 'Future Value = PV(1+r)^n + PMT × [((1+r)^n − 1) / r]. Drawdown = (Annual Expenses × Years in Retirement) / Safe Withdrawal Rate.',
    faqs: [
      { q: 'What is the 4% rule?', a: 'Withdraw 4% of your retirement portfolio in year 1, then adjust for inflation annually. This rule suggests a 90% success rate over 30-year retirements. Example: $1 million portfolio = $40,000 first year. Assumes 60/40 stock/bond allocation.' },
      { q: 'What is the 10% rule?', a: 'Save 10% of your gross income for retirement throughout your career. Combined with employer match, this typically provides adequate retirement income. Many financial advisors recommend this as a baseline.' },
      { q: 'What is the 80% rule?', a: 'Need 80% of pre-retirement income in retirement. This accounts for paid-off mortgages, no work expenses, lower taxes. Example: $100,000 income requires $80,000 annually in retirement.' },
      { q: 'How does Social Security factor into retirement planning?', a: 'Social Security provides a guaranteed income floor in retirement. Average benefit is ~$1,800/month at full retirement age. Claiming early (62) reduces benefits 30%; claiming late (70) increases benefits 24%. Include Social Security in your retirement plan.' },
      { q: 'What are common sources of retirement income?', a: 'Social Security, pensions, 401(k)s, IRAs, rental income, part-time work, annuities. Diversifying income sources reduces risk. Many retirees combine multiple streams. Plan for healthcare costs and inflation.' },
      { q: 'How much retirement income replacement do I need?', a: 'Many plans target 70-80% of pre-retirement income, but required percentage depends on lifestyle, debt, location, and healthcare costs.' },
      { q: 'What is sequence of returns risk in retirement?', a: 'Poor market returns early in retirement can damage portfolio sustainability even if long-term averages look acceptable.' },
      { q: 'Should I include inflation in retirement calculations?', a: 'Yes. Ignoring inflation can severely understate future expenses and cause under-saving for long retirement horizons.' },
      { q: 'When should I start drawing Social Security benefits?', a: 'Claiming later usually increases monthly benefit. Best age depends on health, longevity expectation, and other retirement income sources.' },
      { q: 'How can I improve retirement readiness quickly?', a: 'Increase savings rate, capture full employer match, reduce high-interest debt, delay retirement age if possible, and control spending assumptions.' },
    ],
    sections: [
      { title: 'What is Retirement and Why Plan for It?', content: 'Retirement is when you stop working and live on accumulated savings and income. Longevity risk: people live longer than expected. Healthcare costs exceed historical averages. Inflation erodes purchasing power. Systematic planning ensures you don\'t outlive your money. Key factors: starting age, savings rate, investment returns, life expectancy, spending needs. Earlier savings compound longer (start at 25 vs 45: ~3x difference). Use retirement calculators to model scenarios and adjust strategy accordingly.' },
      { title: 'Retirement Savings Rules: 4%, 10%, 80%', content: 'Three popular rules guide retirement planning: (1) 4% Rule—withdraw 4% of portfolio year 1, adjust for inflation. Works for ~30-year retirements with 60/40 allocation. Example: $1M portfolio = $40k income. (2) 10% Rule—save 10% of income throughout career. Combined with employer match, typically sufficient. (3) 80% Rule—need 80% of working income in retirement (no mortgage, fewer expenses, lower taxes). Combine these for comprehensive planning. No single rule fits everyone; use calculators to personalize.' },
      { title: 'How Much to Save for Retirement', content: 'Target savings = (Annual expenses × 25). This derives from the 4% Rule: if you withdraw 4% annually, $1M lasts 25 years of $40k expenses. Examples: Need $60k/yr = $1.5M saved. Need $100k/yr = $2.5M saved. Account for: Social Security (reduce needed savings), inflation (increase target), healthcare costs (add $300k–500k). Life expectancy: 25–30 year retirement is common. Start early: compound growth amplifies small contributions. Someone saving $300/month from age 25–65 at 7% return accumulates ~$1.2M. Same contribution starting at 45 accumulates ~$234k.' },
      { title: 'Social Security Planning Strategy', content: 'Social Security provides a foundation. Claiming at 62: ~30% reduction vs full retirement age. Full retirement age (66–67 for most): full benefits. Claiming at 70: ~24% increase vs full retirement age. Strategy: if healthy/longevity in family, wait until 70 for higher lifelong benefits. If health concerns, claim earlier. Work longer: every year delayed increases benefits. Married couples: coordinate claiming strategies. Higher earner may delay to 70 while lower earner claims earlier. Use online calculators to compare claiming ages.' },
      { title: 'Retirement Income Sources', content: 'Diversify retirement income: Social Security (guaranteed, inflation-adjusted), Pensions (if available, fixed income), 401(k) / IRA distributions (user-controlled, tax-deferred), Rental income (ongoing, requires management), Part-time work (supplements income, delays drawdown), Annuities (guaranteed income, purchase with savings), Stocks/Bonds (withdrawal-based, volatile). Multiple sources reduce risk—if one source underperforms, others compensate. Healthcare income: Medicare covers age 65+; plan for gaps (age 55–65) and supplemental needs (premiums, out-of-pocket).' },
      { title: 'Inflation Impact on Retirement', content: 'Inflation (average 2–3% annually) significantly impacts retirement. $50,000 annual expense today costs $63,863 in 20 years (3% inflation). Your purchasing power shrinks if income doesn\'t keep pace. Safe withdrawal rates account for inflation—4% rule assumes 3%+ annual adjustment. Social Security adjusts annually for inflation. Fixed pensions don\'t (many disappear in high inflation). Stocks historically outpace inflation; bonds may not. Plan for 3%+ inflation in projections. Real return = nominal return − inflation.' },
      { title: 'Maximizing Retirement Savings', content: 'Key strategies: (1) Start early—compound growth is your friend; (2) Contribute maximum to tax-advantaged accounts (401k, IRA—$7,000–23,500 depending on age/type); (3) Get full employer match (free money); (4) Automate contributions (removes decision fatigue); (5) Diversify investments (60/40 stocks/bonds, rebalance annually); (6) Minimize fees and taxes (low-cost funds, tax-loss harvesting); (7) Increase savings with raises; (8) Consider part-time work to extend accumulation phase. Consistent, disciplined saving beats timing the market. Increase savings rate when possible—even 1% additional impacts outcomes significantly.' },
    ],
  },
  'amortization-calculator': {
    howTo: 'Enter the loan amount, annual interest rate, and loan term (years/months). Click Calculate to generate a detailed amortization schedule showing each year\'s principal paid, interest paid, and remaining balance. Optional: add extra monthly payments to see accelerated payoff and interest savings. Useful for mortgages, auto loans, personal loans, and business loans.',
    formula: 'Monthly Payment = [P × r(1+r)^n] / [(1+r)^n − 1]. Each period: Interest = Balance × r; Principal = Payment − Interest; New Balance = Balance − Principal.',
    faqs: [
      { q: 'What is amortization?', a: 'Amortization is the systematic repayment of a loan over time through regular payments. Each payment covers interest and reduces principal. The term also refers to spreading business asset costs over their useful life in accounting.' },
      { q: 'Why does my first payment mostly go toward interest?', a: 'Early payments are mostly interest because the outstanding balance is high. As you pay down principal, the balance shrinks, so less interest accrues and more of each payment goes toward principal. This is why extra payments early in the loan save significant interest.' },
      { q: 'How much interest do I actually pay over the loan life?', a: 'Total interest = (Monthly Payment × Number of Payments) − Loan Amount. For a $300k mortgage at 6% over 30 years: ~$647k paid total, ~$347k in interest. Extra payments can reduce this dramatically.' },
      { q: 'What if I make bi-weekly payments instead of monthly?', a: 'Bi-weekly payments (half the monthly payment every 2 weeks) = 26 payments/year = 13 months of payments. This accelerates payoff and saves interest compared to 12 monthly payments.' },
      { q: 'Can I use amortization for business assets?', a: 'Yes, amortization spreads the cost of intangible assets (patents, trademarks, goodwill, copyrights) over their useful life for tax purposes. Tangible assets use depreciation. Both reduce taxable income over time.' },
      { q: 'What is an amortization table used for?', a: 'It helps borrowers see payment breakdown over time, remaining balance, and cumulative interest paid at each period.' },
      { q: 'Do extra payments always reduce total interest?', a: 'Usually yes, when extra funds are applied directly to principal and no prepayment penalty offsets the savings.' },
      { q: 'Can adjustable-rate loans use fixed amortization schedules?', a: 'Only partially. Rate changes alter payment math, so fixed schedules become inaccurate after each adjustment.' },
      { q: 'How do I compare two amortized loan offers?', a: 'Compare monthly payment, total interest, APR, fees, and payoff duration under identical assumptions.' },
      { q: 'Is shorter amortization always better financially?', a: 'Shorter terms reduce total interest but require higher monthly cash flow. Best choice depends on budget stability and opportunity cost.' },
    ],
    sections: [
      { title: 'Understanding Amortization', content: 'Amortization is the systematic repayment of a loan through regular payments. Each payment covers both interest and principal. Early payments are mostly interest (since balance is high), while later payments mostly reduce principal. An amortization schedule breaks down each payment. Used for mortgages, auto loans, student loans, personal loans. Amortization ensures full loan repayment by the term\'s end. Longer terms = lower payments but more total interest. Shorter terms = higher payments but less total interest.' },
      { title: 'Reading an Amortization Schedule', content: 'An amortization schedule shows: Month/Year, Payment, Principal, Interest, Remaining Balance. Example month 1 ($300k mortgage at 6%, 30 years): Payment=$1,799, Interest=$1,500, Principal=$299, Balance=$299,701. By year 2, interest drops slightly, principal increases. By year 25, principal dominates. Early extra payments save the most interest. Many lenders provide schedules; calculators generate them instantly. Understanding your schedule helps track payoff progress.' },
      { title: 'Front-Loaded Interest Problem', content: 'Most loan payments are front-loaded with interest. On a $300k mortgage at 6%, the first payment is $1,799: $1,500 interest ($99), $299 principal. You\'ve paid 83% interest for 0.1% principal reduction! Year 15 looks different: more principal, less interest. This front-loading is why extra early payments save enormous sums. Adding $100/month to that mortgage saves ~$64k in total interest and shortens the term by years.' },
      { title: 'Accelerating Payoff with Extra Payments', content: 'Extra principal payments dramatically shorten loan duration and save interest. Example: $300k mortgage, 6%, 30 years (standard = $347k interest). With $100/month extra → saves $64,000 and pays off in ~22 years. With $200/month extra → saves $106,000 and pays off in ~18 years. Make extra payments as lump sums or increase monthly payment. Ensure extra funds go to principal (not just next month\'s payment). Use calculators to model savings from your planned extra payments.' },
      { title: 'Bi-Weekly Payment Strategy', content: 'Paying bi-weekly (half the monthly payment every 2 weeks) results in 26 payments/year instead of 12 monthly = 13 months of payments annually. On a $300k 30-year mortgage: 13th payment annually accelerates payoff to ~23.5 years, saving ~$92k in interest. Bi-weekly payments work well with semi-monthly income (2 paychecks/month). Check your lender for bi-weekly payment options—many allow them without changing the loan. Most automated lenders support bi-weekly setups.' },
      { title: 'Refinancing to Lower Rates', content: 'If rates drop, refinancing (replacing old loan with new one at lower rate) can save money, though refinancing has closing costs. Example: $300k mortgage, 6% → 4% refinance saves ~$180k over 30 years but costs $3k–6k upfront (appraisal, origination, title). Break-even: ~2–3 years. If staying in home/loan longer, refinance makes sense. Use calculators to compare: New rate + costs vs. remaining loan cost. Refinancing can also shorten term (15-year) for faster payoff.' },
      { title: 'Business Asset Amortization', content: 'In accounting, amortization spreads the cost of intangible assets over their useful life. Assets: patents (20 years), copyrights (varies), trademarks (indefinite, may not amortize), goodwill (varies), software (3–5 years). Example: $100k goodwill amortized over 10 years = $10k annual expense. Reduces taxable income. Depreciation is similar but for tangible assets (equipment, buildings). Both are non-cash expenses reducing tax liability. Consult tax professionals for amortization rules.' },
    ],
  },
  'investment-calculator': {
    howTo: 'Enter your starting amount, desired monthly/annual contributions, expected annual return rate, and investment length. The calculator shows your ending balance, total contributions, and interest earned. Choose from different investment tabs to calculate: end amount, required return rate, needed contributions, or time to reach a goal. View the accumulation schedule to see yearly growth.',
    formula: 'Future Value = P(1+r)^t + PMT × [((1+r)^t − 1) / r], where P = principal, r = periodic rate, t = periods, PMT = periodic payment.',
    faqs: [
      { q: 'What are the main investment types?', a: 'CDs & Bonds (low-risk, 1–4% returns), Stocks & ETFs (medium risk, 8–10% average), Real Estate (medium risk, 3–7% returns), Commodities (high volatility, gold ~5%, oil ~6%), Mutual Funds (diversified, varies).' },
      { q: 'What is a CD (Certificate of Deposit)?', a: 'A CD is a low-risk savings product. You deposit money for a fixed term (3 months–5 years) at a guaranteed interest rate (typically 4–5% currently). In the US, CDs up to $250k are FDIC-insured. Penalty applies for early withdrawal.' },
      { q: 'What is the difference between stocks and bonds?', a: 'Stocks represent ownership in companies; value fluctuates, dividends vary. Bonds are IOUs; you lend money and earn fixed interest. Stocks: higher risk, higher potential return. Bonds: lower risk, steady income.' },
      { q: 'What is the S&P 500 and why does it matter?', a: 'The S&P 500 is an index of 500 large US companies. Historical average return: ~10% annually. Many use it as a benchmark for investment performance. Low-cost index funds (VOO, SPY) track it.' },
      { q: 'Should I invest for the short or long term?', a: 'Short term (< 5 years): Prefer bonds, CDs, stable value funds. Long term (10+ years): Can weather stock market volatility; historically stocks outpace inflation. Younger investors can take more risk; older investors need more stability.' },
      { q: 'How do monthly contributions affect long-term investment growth?', a: 'Regular contributions amplify compounding and can contribute more to final balance than initial principal over long periods.' },
      { q: 'What is dollar-cost averaging in investing?', a: 'It is a strategy of investing fixed amounts at regular intervals, reducing timing risk and smoothing entry price over time.' },
      { q: 'Should I include inflation when projecting investment goals?', a: 'Yes. Nominal gains can look large while real purchasing power grows much less after inflation adjustment.' },
      { q: 'Can this calculator estimate required return to hit a target?', a: 'Yes, by setting target future value and contribution assumptions, you can infer needed return rate for planning purposes.' },
      { q: 'What is the biggest driver of investment outcomes?', a: 'Time in market plus disciplined contributions usually dominates short-term market timing decisions for most long-term investors.' },
    ],
    sections: [
      { title: 'Variables in Investment Growth', content: 'Four variables determine investment outcomes: (1) Principal—starting amount; more principal = more growth. (2) Contributions—regular additions accelerate growth significantly. $100/month matters! (3) Return Rate—higher returns mean exponential growth. 8% vs 5% compounds to massive differences over 20+ years. (4) Time—the most powerful variable. Compound growth accelerates over years. Early investors (age 25) beat late starters (age 45) by 3–5x despite same monthly contributions. Start early; time is your biggest advantage.' },
      { title: 'Certificate of Deposits (CDs)', content: 'CDs are ultra-safe, FDIC-insured (up to $250k) savings products. You lock money for a term (3 months to 5 years) at a guaranteed interest rate. Current rates (2024): 4–5% APY. In exchange for safety, returns are low. Early withdrawal penalties apply (typically 3–6 months interest). Ideal for: risk-averse investors, money needed in 1–5 years, emergency funds. Ladder strategy: buy multiple CDs maturing at intervals to access funds gradually. CDs beat savings accounts (0.5–1%) but lose to stocks long-term (8–10%).' },
      { title: 'Bonds and Fixed Income', content: 'Bonds are IOUs—you lend money to governments or corporations who pay fixed interest (coupon) and return principal at maturity. Types: Government (lowest risk), Corporate (medium risk), High-Yield/Junk (high risk, 6–8% yield). Characteristics: Lower risk than stocks, predictable income, prices fall when interest rates rise (inverse relationship). Typical yields: 2–5%. Older investors prefer bonds for stability; younger investors prefer stocks for growth. Bond allocation increases with age (80/20 at age 40, 50/50 at 60, flip to bonds at 70).' },
      { title: 'Stocks and Stock Market Investing', content: 'Stocks represent ownership in companies. Dividends: some pay quarterly cash (2–4% yield); others reinvest profits. Capital appreciation: stock price rises if company thrives. Historical average: ~10% annually. Risk: prices fluctuate daily, companies can fail. Diversification: buy index funds (VOO, VTI) tracking many companies instead of individual stocks. Dollar-cost averaging: invest fixed amount monthly regardless of price—mathematically optimal. Long-term (10+ years) stock investors typically beat inflation and other investments.' },
      { title: 'Understanding the S&P 500', content: 'The S&P 500 is the most important stock market index—500 large US companies by market capitalization. Historical returns: ~10% annually (1926–2024). Includes tech (Apple, Microsoft), healthcare (Pfizer), energy (Exxon), financials (JPMorgan). Used as benchmark: if your fund beats S&P 500, it\'s outperforming. Low-cost index funds track it: VOO (Vanguard), SPY (SPDR), IVV (iShares) with expense ratios < 0.1%. Better for most investors than trying to pick individual stocks—experts rarely beat the index.' },
      { title: 'Real Estate and REITs', content: 'Real estate investing: buy property to rent (rental income 3–7% yield + appreciation) or flip (buy low, sell high for capital gains). Advantages: tangible asset, leverage (borrow 80%), forced appreciation through renovation. Disadvantages: capital requirements, tenants/repairs/vacancies, illiquid (slow to sell). REITs (Real Estate Investment Trusts): own real estate through stock-like funds. Liquid, diversified, passive income through dividends. Typical REIT yields: 3–5%. Easier entry than direct property ownership.' },
      { title: 'Investment Time Horizons', content: 'Short-term (< 5 years): Can\'t recover from market crashes—prefer bonds, CDs, money markets. Intended use requires safety. Medium-term (5–15 years): Can tolerate some volatility—60% stocks, 40% bonds. Long-term (15+ years): Can weather crashes; historically recover—80% stocks, 20% bonds. Early career investors should maximize stock allocation (age 25–50). Pre-retirement (50–65): Shift conservative. Retirement (65+): May need more income from bonds/CDs. Rebalance annually to stay on target.' },
      { title: 'Retirement and Education Investment Accounts', content: 'Tax-advantaged accounts maximize growth: 401(k) (employer-sponsored, $23,500 annual limit), IRA/Roth IRA ($7,000 annual limit). 401(k): pre-tax contributions reduce current taxes; Roth: pay taxes now, tax-free withdrawal later. 529 Plans: education savings with tax-free growth for qualified expenses. HSAs: health savings accounts with triple tax advantage. Contribution room grows annually—max out if possible. Employer 401(k) match is free money—contribute to get full match. Tax deferral amplifies compound growth dramatically over decades.' },
    ],
  },
  'currency-calculator': {
    howTo: 'Enter an amount, select source and target currencies, then click Calculate. The converter displays the converted amount using current market exchange rates. You can also view a comparison table with major currencies and their rates. Useful for travel planning, international business, and comparing purchasing power across countries.',
    formula: 'Converted Amount = Original Amount × (Target Currency Rate ÷ Source Currency Rate). Exchange rates are based on interbank rates (wholesale) but actual rates depend on your bank, fees, and bid-ask spreads.',
    faqs: [
      { q: 'Where do exchange rates come from?', a: 'Exchange rates are determined by the foreign exchange market (forex)—a global, decentralized market where currencies are traded. Rates fluctuate every second based on supply, demand, interest rates, inflation, and economic news.' },
      { q: 'Why do exchange rates change?', a: 'Differences in inflation, interest rates, trade deficits, political stability, economic performance, and investor sentiment all influence exchange rates. Stronger economies usually have stronger currencies.' },
      { q: 'What is a bid-ask spread?', a: 'The bid is what buyers offer; the ask is what sellers want. The spread is the difference. Your bank/money changer pockets this as profit. Forex traders typically get tighter spreads than consumers.' },
      { q: 'Should I exchange money at home or abroad?', a: 'Generally, exchanging at home (via your bank) is better than airport kiosks or overseas hotels—you get better rates and avoid rush fees. Compare rates from multiple banks before exchanging.' },
      { q: 'What is "major currency pair"?', a: 'Major pairs involve the USD paired with other major currencies (EUR, GBP, JPY, CAD, AUD, CHF). They trade highest volumes and have tightest spreads. EUR/USD is the most-traded pair globally.' },
      { q: 'What is the difference between interbank rate and card rate?', a: 'Interbank is wholesale bank-to-bank pricing, while consumer card or cash rates include spread, network costs, and sometimes extra fees.' },
      { q: 'How can I get the best exchange rate while traveling?', a: 'Use low-fee cards, avoid airport kiosks, compare local bank ATM costs, and watch foreign transaction fees before departure.' },
      { q: 'Why do currency converter rates differ from my bank statement?', a: 'Timing delays, provider spread, and transaction fees can create differences between quoted conversion rates and settled amounts.' },
      { q: 'What does base currency and quote currency mean?', a: 'Base currency is the first currency in a pair; quote currency is the second, showing how much quote is needed for one unit of base.' },
      { q: 'Can exchange rates affect international business profit?', a: 'Yes. Currency volatility can change import costs, export margins, and settlement value, so hedging and rate planning are often necessary.' },
    ],
    sections: [
      { title: 'Currency Definition and Types', content: 'Currency is money issued by a government. Types: Fiat (backed by government decree, not commodity), Commodity (historically gold/silver), Crypto (digital/decentralized). Modern world uses fiat exclusively. Major currencies: USD (US Dollar), EUR (Euro), GBP (British Pound), JPY (Japanese Yen), CHF (Swiss Franc), CAD (Canadian Dollar). Forex (foreign exchange) markets trade currencies 24/5. Currency value reflects economic strength—strong economies have strong currencies.' },
      { title: 'Forex Market and Exchange Rates', content: 'The forex market is the global, decentralized marketplace where currencies are traded. $6+ trillion daily volume. No central exchange—traders deal OTC (over the counter). Participants: central banks, commercial banks, hedge funds, corporations, retail traders. Exchange rates fluctuate every millisecond based on supply/demand. Banks fix daily rates for customers but they move constantly. Forex is the most liquid market globally. Retail investors can trade forex but it\'s risky—leverage amplifies gains and losses.' },
      { title: 'Factors Affecting Exchange Rates', content: 'Inflation: Higher inflation weakens currency (needs more to buy same goods). Interest rates: Higher rates attract foreign investment, strengthen currency. Trade deficits: Importing more than exporting weakens currency. Political stability: Unstable countries have weaker currencies (flight capital). Economic performance: Strong GDP growth strengthens currency. Investor sentiment: Risk-on buys risky currencies; risk-off buys safe havens (USD, CHF). Supply/demand: Everyone wanting EUR strengthens it; wanting to exit weakens it.' },
      { title: 'Bid-Ask Spread and Currency Trading', content: 'Bid: What buyers offer (you receive if selling currency). Ask: What sellers want (you pay if buying). Spread: Ask − Bid (the profit middle). Example: EUR/USD bid 1.0800, ask 1.0805 → 0.0005 spread. Interbank spreads: 0.0001–0.0005 (tight). Consumer spreads: 0.01–0.05+ (loose). Airports/hotels have worst spreads (5%+ markup). Your bank\'s forex rates are usually 2–3% above/below market. Shop around or use ATMs abroad—often better than exchanging cash.' },
      { title: 'Major Currency Pairs and Benchmarks', content: 'Major pairs (highest volumes, tightest spreads): EUR/USD, GBP/USD, USD/JPY, USD/CHF, USD/CAD, AUD/USD. EUR/USD is the most-traded (30%+ of volume), most liquid, best for traders. USD pairs are called "majors"; pairs without USD are "crosses." Example: EUR/GBP. Spot rate: exchange rate for immediate settlement. Forward rate: agreed price for future settlement. Understanding pairs helps identify arbitrage (buy cheap, sell dear) and trading opportunities.' },
      { title: 'Currency Exchange for Travel', content: 'Best practice: get some local currency before traveling (avoid airport premium). Best options: (1) Bank ATM abroad (usually best rate, $2–5 fee), (2) Local bank branch (competitive rate), (3) Home bank before travel (transparent), (4) Credit card (rewards, good rate but 1–3% foreign fee). Avoid: Airport kiosks (5–10% markup), Hotel exchanges (markup), Western Union/MoneyGram (expensive). Credit cards beat cash for normal transactions (better rates, fraud protection, rewards). Carry $50–100 cash for emergencies. Always notify banks of travel dates to avoid fraud blocks.' },
      { title: 'Comparing Purchasing Power Across Countries', content: 'Exchange rates don\'t tell the full story—purchasing power matters. The Big Mac Index (economist.com) shows real costs: $5 in USA, €4 in Germany, £3.5 in UK, ¥550 in Japan. Same Big Mac, different local prices. Real purchasing power: How much local goods/services you can buy with converted currency. $1 USD in Vietnam buys way more than in Switzerland. Cost of living varies by country—expensive: Switzerland, Norway, Iceland; cheap: Mexico, Thailand, Philippines. Use cost-of-living indexes when planning budgets across countries.' },
      { title: 'Payment Methods When Traveling', content: 'Debit/Credit Cards: Best exchange rates (wholesale), fraud protection, no carrying cash. Disadvantages: 1–3% foreign transaction fees, declined in some places, security risk. Cash: Accepted everywhere, no fees, fast. Disadvantages: no fraud protection, heavy to carry, theft risk, worse exchange rates at converters. Credit cards ideal for hotels/restaurants. Cash ideal for small shops/tips. Digital: Apple Pay, Google Pay increasingly work abroad (2–3% fees). Prepaid travel cards: Lock in rates, reduce fees but less competitive. Combination strategy: mostly card, some cash emergency fund.' },
    ],
  },
};

const defaultContent = (name: string) => ({
  howTo: `${name} — enter the required values in the fields above and click Calculate to get instant, accurate results. Review the output carefully, adjust assumptions if needed, and compare multiple scenarios for better decision-making. All calculations run locally in your browser with no data sent to any server.`,
  faqs: [
    { q: `Is this ${name} free to use?`, a: 'Yes, this calculator is completely free with no signup required and no hidden charges.' },
    { q: `How accurate is this ${name}?`, a: 'Results are based on standard formulas and the inputs you provide. Accuracy depends on input quality and assumptions.' },
    { q: `Can I use ${name} on mobile devices?`, a: 'Yes, this calculator is fully responsive and works on desktop, tablet, and mobile screens.' },
    { q: `Does ${name} store my data?`, a: 'No personal input is stored by this calculator during normal use. Calculations are performed client-side.' },
    { q: `What should I do if results look wrong?`, a: 'Double-check units, decimal placement, and all required fields. Then recalculate with corrected values.' },
    { q: `Can I use ${name} for professional decisions?`, a: 'Use it as an initial planning tool. For legal, medical, financial, or engineering decisions, consult a qualified professional.' },
    { q: `Does this calculator support what-if scenarios?`, a: 'Yes. Change one input at a time to compare outcomes and understand sensitivity.' },
    { q: `Why do small input changes create large result differences?`, a: 'Many formulas include compounding or nonlinear behavior, where small changes can meaningfully impact outputs.' },
    { q: `Can beginners use this ${name} easily?`, a: 'Yes. Input labels are designed to be simple and practical for both beginners and advanced users.' },
    { q: `How often should I recalculate?`, a: 'Recalculate whenever your assumptions, rates, measurements, or target values change.' },
  ],
  sections: [
    { title: `How ${name} Works`, content: `This calculator transforms your inputs into results using established formulas. Enter realistic values, keep units consistent, and use the outputs to evaluate practical scenarios.` },
    { title: 'Input Quality and Assumptions', content: 'The reliability of any result depends on assumptions and data quality. Validate source values, confirm units, and avoid rounding too aggressively in critical calculations.' },
    { title: 'Best Practices for Better Results', content: 'Run multiple scenarios, compare conservative and optimistic assumptions, and combine calculator outputs with real-world constraints before acting on results.' },
  ],
});

export default function CalculatorEngine({ calc }: CalculatorEngineProps) {
  const relatedCalcs = calculators.filter(c => c.category === calc.category && c.slug !== calc.slug).slice(0, 6);
  const content = calcContent[calc.slug] ?? defaultContent(calc.name);

  const calculatorComponents: Record<string, React.ReactNode> = {
    'bmi-calculator': <BMICalculator />,
    'mortgage-calculator': <MortgageCalculator />,
    'age-calculator': <AgeCalculator />,
    'percentage-calculator': <PercentageCalculator />,
    'tip-calculator': <TipCalculator />,
    'scientific-calculator': <ScientificCalculator />,
    'basic-calculator': <ScientificCalculator />,
    'loan-calculator': <LoanCalculator />,
    'compound-interest-calculator': <CompoundInterestCalculator />,
    'calorie-calculator': <CalorieCalculator />,
    'retirement-calculator': <RetirementCalculator />,
    'pension-calculator': <RetirementCalculator />,
    'savings-calculator': <SavingsCalculator />,
    'roth-ira-calculator': <SavingsCalculator />,
    'ira-calculator': <SavingsCalculator />,
    'investment-calculator': <InvestmentCalculator />,
    'mutual-fund-calculator': <InvestmentCalculator />,
    'bmr-calculator': <BMRCalculator />,
    'macro-calculator': <MacroCalculator />,
    'fat-intake-calculator': <MacroCalculator />,
    'date-calculator': <DateCalculator />,
    'fraction-calculator': <FractionCalculator />,
    'mean-median-mode-calculator': <StatisticsCalculator />,
    'statistics-calculator': <StatisticsCalculator />,
    'standard-deviation-calculator': <StatisticsCalculator />,
    'quadratic-formula-calculator': <QuadraticCalculator />,
    'algebra-calculator': <QuadraticCalculator />,
    'password-generator': <PasswordGenerator />,
    'random-number-generator': <RandomNumberGenerator />,
    'number-sequence-calculator': <RandomNumberGenerator />,
    'dice-roller': <DiceRoller />,
    'height-calculator': <HeightConverter />,
    'pregnancy-calculator': <PregnancyCalculator />,
    'due-date-calculator': <PregnancyCalculator />,
    'pregnancy-weight-gain-calculator': <PregnancyCalculator />,
    'ovulation-calculator': <PregnancyCalculator />,
    'period-calculator': <PregnancyCalculator />,
    'amortization-calculator': <AmortizationCalculator />,
    'mortgage-amortization-calculator': <AmortizationCalculator />,
    'credit-card-calculator': <CreditCardCalculator />,
    'credit-card-payoff-calculator': <CreditCardCalculator />,
    'credit-cards-payoff-calculator': <CreditCardCalculator />,
    'debt-payoff-calculator': <CreditCardCalculator />,
    'auto-loan-calculator': <AutoLoanCalculator />,
    'salary-calculator': <SalaryCalculator />,
    'tax-calculator': <GenericCalculator slug="income-tax-calculator" name="Tax Calculator" />,
    'body-fat-calculator': <BodyFatCalculator />,
    'tdee-calculator': <TDEECalculator />,
    'calories-burned-calculator': <CaloriesBurnedCalculator />,
    'binary-calculator': <BinaryCalculator />,
    'hex-calculator': <BinaryCalculator />,
    'base64-calculator': <Base64Calculator />,
    'base64-encode-decode': <Base64Calculator />,
    'url-encoder': <URLEncoder />,
    'url-encode-decode': <URLEncoder />,
    'time-zone-calculator': <TimeZoneCalculator />,
    'time-calculator': <TimeCalculator />,
    'hours-calculator': <HoursCalculator />,
    'percent-calculator': <PercentageCalculator />,
    'math-calculator': <ScientificCalculator />,
    'right-triangle-calculator': <GenericCalculator slug="triangle-calculator" name="Right Triangle Calculator" />,
    'conception-calculator': <PregnancyCalculator />,
    'pregnancy-conception-calculator': <PregnancyCalculator />,
    'day-of-the-week-calculator': <DateCalculator />,
    'mean-median-mode-range-calculator': <StatisticsCalculator />,
    'permutation-and-combination-calculator': <GenericCalculator slug="permutation-combination-calculator" name="Permutation and Combination Calculator" />,
    'shoe-size-conversion': <GenericCalculator slug="shoe-size-calculator" name="Shoe Size Conversion" />,
    'common-factor-calculator': <GenericCalculator slug="gcf-calculator" name="Common Factor Calculator" />,
    'marriage-calculator': <GenericCalculator slug="marriage-tax-calculator" name="Marriage Calculator" />,
    'anorexic-bmi-calculator': <BMICalculator />,
    'overweight-calculator': <BMICalculator />,
    'weight-watchers-points-calculator': <CalorieCalculator />,
  };

  const ui = calculatorComponents[calc.slug] ?? <GenericCalculator slug={calc.slug} name={calc.name} />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Calculator */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <span className="text-4xl" aria-hidden="true">{calc.emoji}</span>
              <div>
                <h1 className="text-2xl font-bold">{calc.name}</h1>
                <p className="text-white/80 text-sm mt-0.5">{calc.description}</p>
              </div>
            </div>
          </div>
          <div className="p-6">{ui}</div>
        </div>

        {/* How to Use */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">How to Use the {calc.name}</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{content.howTo}</p>
          {content.formula && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Formula: </span>
              <span className="text-sm text-gray-700 dark:text-gray-300 font-mono">{content.formula}</span>
            </div>
          )}
        </div>

        {/* Educational Sections */}
        {content.sections && content.sections.length > 0 && (
          <div className="space-y-4">
            {content.sections.map((section, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{section.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* FAQ - Keep this as the final section after full article content */}
        {content.faqs.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <style>{`
              details {
                border: 1px solid #e5e7eb;
                border-radius: 0.5rem;
                overflow: hidden;
                margin-bottom: 0.5rem;
              }
              :root.dark details {
                border-color: #374151;
              }
              summary {
                background-color: #f9fafb;
                padding: 1rem;
                cursor: pointer;
                user-select: none;
                font-weight: 600;
                color: #111827;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: background-color 0.2s;
              }
              :root.dark summary {
                background-color: #374151;
                color: #f3f4f6;
              }
              summary:hover {
                background-color: #f3f4f6;
              }
              :root.dark summary:hover {
                background-color: #4b5563;
              }
              details[open] summary {
                border-bottom: 1px solid #e5e7eb;
              }
              :root.dark details[open] summary {
                border-bottom-color: #374151;
              }
              details > *:not(summary) {
                padding: 0.75rem 1rem;
                background-color: white;
                color: #4b5563;
              }
              :root.dark details > *:not(summary) {
                background-color: #1f2937;
                color: #9ca3af;
              }
              .chevron {
                width: 1.25rem;
                height: 1.25rem;
                color: #4f46e5;
                transition: transform 0.3s;
                flex-shrink: 0;
              }
              :root.dark .chevron {
                color: #818cf8;
              }
              details[open] .chevron {
                transform: rotate(180deg);
              }
            `}</style>
            <div>
              {content.faqs.map((faq, i) => (
                <details key={i}>
                  <summary>
                    <span className="text-left pr-4">{faq.q}</span>
                    <svg className="chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </summary>
                  <p className="text-sm leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-5">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">Related Calculators</h3>
          <ul className="space-y-2">
            {relatedCalcs.map(r => (
              <li key={r.slug}>
                <Link href={`/${r.slug}/`} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group">
                  <span aria-hidden="true">{r.emoji}</span>
                  <span className="group-hover:underline">{r.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800 p-5">
          <h3 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2">💡 Did you know?</h3>
          <p className="text-sm text-indigo-700 dark:text-indigo-400 leading-relaxed">
            NumerixHub has over 200 free calculators across finance, health, math, and utility categories. All are free to use with no registration required.
          </p>
          <Link href="/calculators/" className="mt-3 inline-block text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Browse all calculators →</Link>
        </div>
      </div>
    </div>
  );
}
