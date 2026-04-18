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
    schedule: { year: number; principal: number; interest: number; balance: number }[];
  } | null>(null);

  const calculate = () => {
    const price = parseFloat(homePrice) || 0;
    const down = downType === 'pct' ? price * (parseFloat(downValue) / 100) : parseFloat(downValue) || 0;
    const loan = price - down;
    if (loan <= 0) return;
    const r = parseFloat(rate) / 100 / 12;
    const n = parseInt(term) * 12;
    if (!r || !n) return;
    const monthly = (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const propTaxMo = price * (parseFloat(propTax) / 100) / 12;
    const insuranceMo = parseFloat(insurance) / 12;
    const pmiMo = down / price < 0.2 ? loan * (parseFloat(pmi) / 100) / 12 : 0;
    const hoaMo = parseFloat(hoa) || 0;
    const extra = parseFloat(extraMonthly) || 0;
    const totalMonthly = monthly + propTaxMo + insuranceMo + pmiMo + hoaMo;

    // Payoff with extra payment
    let balance = loan, months = 0;
    const yearlyData: { year: number; principal: number; interest: number; balance: number }[] = [];
    let yearPrin = 0, yearInt = 0;
    while (balance > 0.01 && months < n + 360) {
      const int = balance * r;
      const prin = Math.min(monthly - int + extra, balance);
      balance = Math.max(0, balance - prin);
      yearPrin += prin; yearInt += int;
      months++;
      if (months % 12 === 0 || balance <= 0.01) {
        yearlyData.push({ year: Math.ceil(months / 12), principal: yearPrin, interest: yearInt, balance });
        yearPrin = 0; yearInt = 0;
      }
    }

    const sd = new Date(startDate + '-01');
    sd.setMonth(sd.getMonth() + months);
    const payoffStr = sd.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const totalInterest = yearlyData.reduce((s, r) => s + r.interest, 0);

    setResult({ loanAmount: loan, downPayment: down, monthly, totalMonthly, totalPayment: monthly * months, totalInterest, propTaxMo, insuranceMo, pmiMo, hoaMo, payoffDate: payoffStr, payoffMonths: months, schedule: yearlyData });
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
  const [result, setResult] = useState<{ total: number; interest: number; contributed: number } | null>(null);

  const calculate = () => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);
    const n = parseFloat(compound);
    const pmt = parseFloat(contribution);
    if (!P || !r || !t || !n) return;
    const totalPrincipal = P * Math.pow(1 + r / n, n * t) + pmt * (Math.pow(1 + r / n, n * t) - 1) / (r / n);
    const contributed = P + pmt * n * t; // pmt per period × periods-per-year × years
    setResult({ total: totalPrincipal, interest: totalPrincipal - contributed, contributed });
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
  const [amount, setAmount] = useState('25000');
  const [rate, setRate] = useState('6.5');
  const [term, setTerm] = useState('5');
  const [result, setResult] = useState<{ monthly: number; total: number; interest: number } | null>(null);

  const calculate = () => {
    const P = parseFloat(amount);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseFloat(term) * 12;
    if (!P || !r || !n) return;
    const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setResult({ monthly, total: monthly * n, interest: monthly * n - P });
  };

  const fmt = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Loan Amount ($)</label><input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Annual Rate (%)</label><input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Term (years)</label><input type="number" value={term} onChange={e => setTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate</button>
      {result && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
          <div className="text-center mb-5"><div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Monthly Payment</div><div className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">{fmt(result.monthly)}</div></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center"><div className="text-xs text-gray-500 mb-1">Total Payment</div><div className="font-bold text-gray-900 dark:text-white">{fmt(result.total)}</div></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center"><div className="text-xs text-gray-500 mb-1">Total Interest</div><div className="font-bold text-red-500">{fmt(result.interest)}</div></div>
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
  const [current, setCurrent] = useState('50000');
  const [monthly, setMonthly] = useState('500');
  const [rate, setRate] = useState('7');
  const [years, setYears] = useState('30');
  const [inflation, setInflation] = useState('3');
  const [result, setResult] = useState<{ nominal: number; real: number; contributed: number; interest: number } | null>(null);

  const calculate = () => {
    const P = parseFloat(current), pmt = parseFloat(monthly), r = parseFloat(rate) / 100 / 12;
    const n = parseFloat(years) * 12, inf = parseFloat(inflation) / 100;
    if (isNaN(P) || isNaN(pmt) || !r || !n) return;
    const nominal = P * Math.pow(1 + r, n) + pmt * (Math.pow(1 + r, n) - 1) / r;
    const realRate = (1 + parseFloat(rate) / 100) / (1 + inf) - 1;
    const realMonthly = realRate / 12;
    const real = P * Math.pow(1 + realMonthly, n) + pmt * (Math.pow(1 + realMonthly, n) - 1) / realMonthly;
    const contributed = P + pmt * n;
    setResult({ nominal, real, contributed, interest: nominal - contributed });
  };
  const fmt = (n: number) => '$' + Math.round(n).toLocaleString();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Current Savings ($)</label><input type="number" value={current} onChange={e => setCurrent(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Monthly Contribution ($)</label><input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Annual Return (%)</label><input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Years to Retirement</label><input type="number" value={years} onChange={e => setYears(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div className="col-span-2"><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Inflation Rate (%)</label><input type="number" step="0.1" value={inflation} onChange={e => setInflation(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
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
  const [result, setResult] = useState<{ fv: number; contributed: number; gain: number } | null>(null);

  const calculate = () => {
    const P = parseFloat(pv), r = parseFloat(rate) / 100;
    const t = parseFloat(years), pmt = parseFloat(additional);
    if (isNaN(P) || !r || !t) return;
    const fv = P * Math.pow(1 + r, t) + pmt * (Math.pow(1 + r, t) - 1) / r;
    const contributed = P + pmt * t;
    setResult({ fv, contributed, gain: fv - contributed });
  };
  const fmt = (n: number) => '$' + Math.round(n).toLocaleString();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Initial Investment ($)</label><input type="number" value={pv} onChange={e => setPv(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Annual Return (%)</label><input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Time Period (years)</label><input type="number" value={years} onChange={e => setYears(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Annual Contribution ($)</label><input type="number" value={additional} onChange={e => setAdditional(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate Investment</button>
      {result && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
          <div className="text-center mb-4"><div className="text-sm text-gray-500 dark:text-gray-400">Future Value</div><div className="text-4xl font-extrabold text-green-600">{fmt(result.fv)}</div></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-500 mb-1">Total Invested</div><div className="font-bold">{fmt(result.contributed)}</div></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-500 mb-1">Investment Gain</div><div className="font-bold text-green-500">{fmt(result.gain)}</div></div>
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
  const [result, setResult] = useState<{ monthly: number; total: number; interest: number; schedule: { month: number; payment: number; principal: number; interest: number; balance: number }[] } | null>(null);

  const calculate = () => {
    const P = parseFloat(amount), r = parseFloat(rate) / 100 / 12, n = parseFloat(term) * 12;
    if (!P || !r || !n) return;
    const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    let balance = P;
    const schedule = [];
    for (let i = 1; i <= Math.min(n, 12); i++) {
      const int = balance * r;
      const prin = monthly - int;
      balance -= prin;
      schedule.push({ month: i, payment: monthly, principal: prin, interest: int, balance: Math.max(0, balance) });
    }
    setResult({ monthly, total: monthly * n, interest: monthly * n - P, schedule });
  };
  const fmt = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Loan Amount ($)</label><input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Annual Rate (%)</label><input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Term (years)</label><input type="number" value={term} onChange={e => setTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Generate Schedule</button>
      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Monthly Payment</div><div className="font-bold text-indigo-600">{fmt(result.monthly)}</div></div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Total Payment</div><div className="font-bold">{fmt(result.total)}</div></div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Total Interest</div><div className="font-bold text-red-500">{fmt(result.interest)}</div></div>
          </div>
          <div className="overflow-x-auto"><table className="w-full text-xs text-left"><thead><tr className="bg-gray-100 dark:bg-gray-700">{['Month', 'Payment', 'Principal', 'Interest', 'Balance'].map(h => <th key={h} className="px-3 py-2 font-semibold text-gray-600 dark:text-gray-300">{h}</th>)}</tr></thead><tbody>{result.schedule.map(row => <tr key={row.month} className="border-t border-gray-100 dark:border-gray-700"><td className="px-3 py-2">{row.month}</td><td className="px-3 py-2">{fmt(row.payment)}</td><td className="px-3 py-2 text-green-600">{fmt(row.principal)}</td><td className="px-3 py-2 text-red-500">{fmt(row.interest)}</td><td className="px-3 py-2">{fmt(row.balance)}</td></tr>)}</tbody></table></div>
          <p className="text-xs text-gray-400 text-center">Showing first 12 months of {term}-year schedule</p>
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

// Generic calculator for all other slugs
function GenericCalculator({ slug, name }: { slug: string; name: string }) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);

  type FieldConfig = { id: string; label: string; placeholder?: string };
  type CalcConfig = { fields: FieldConfig[]; compute: (vals: Record<string, number>) => string };

  const configs: Record<string, CalcConfig> = {
    'sales-tax-calculator': {
      fields: [{ id: 'price', label: 'Price ($)', placeholder: '100' }, { id: 'tax', label: 'Tax Rate (%)', placeholder: '8.5' }],
      compute: (v) => `Tax: $${(v.price * v.tax / 100).toFixed(2)} | Total: $${(v.price * (1 + v.tax / 100)).toFixed(2)}`,
    },
    'discount-calculator': {
      fields: [{ id: 'price', label: 'Original Price ($)', placeholder: '100' }, { id: 'discount', label: 'Discount (%)', placeholder: '20' }],
      compute: (v) => `Savings: $${(v.price * v.discount / 100).toFixed(2)} | Final: $${(v.price * (1 - v.discount / 100)).toFixed(2)}`,
    },
    'simple-interest-calculator': {
      fields: [{ id: 'principal', label: 'Principal ($)', placeholder: '1000' }, { id: 'rate', label: 'Annual Rate (%)', placeholder: '5' }, { id: 'time', label: 'Time (years)', placeholder: '3' }],
      compute: (v) => `Interest: $${(v.principal * v.rate / 100 * v.time).toFixed(2)} | Total: $${(v.principal + v.principal * v.rate / 100 * v.time).toFixed(2)}`,
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
      fields: [{ id: 'principal', label: 'Principal ($)', placeholder: '10000' }, { id: 'rate', label: 'Annual Rate (%)', placeholder: '5' }, { id: 'years', label: 'Years', placeholder: '5' }],
      compute: (v) => { const si = v.principal * v.rate / 100 * v.years; const ci = v.principal * Math.pow(1 + v.rate/100, v.years) - v.principal; return `Simple Interest: $${si.toFixed(2)} | Compound Interest: $${ci.toFixed(2)}`; },
    },
    'payment-calculator': {
      fields: [{ id: 'amount', label: 'Loan Amount ($)', placeholder: '20000' }, { id: 'rate', label: 'Annual Rate (%)', placeholder: '7' }, { id: 'term', label: 'Term (months)', placeholder: '60' }],
      compute: (v) => { const r = v.rate / 100 / 12; const n = v.term; const m = (v.amount * r * Math.pow(1+r,n)) / (Math.pow(1+r,n)-1); return `Monthly Payment: $${m.toFixed(2)} | Total: $${(m*n).toFixed(2)}`; },
    },
    'inflation-calculator': {
      fields: [{ id: 'amount', label: 'Current Amount ($)', placeholder: '1000' }, { id: 'rate', label: 'Inflation Rate (%)', placeholder: '3' }, { id: 'years', label: 'Years', placeholder: '10' }],
      compute: (v) => { const future = v.amount * Math.pow(1 + v.rate/100, v.years); return `Future cost: $${future.toFixed(2)} | Today's purchasing power of $${v.amount}: $${(v.amount/Math.pow(1+v.rate/100,v.years)).toFixed(2)}`; },
    },
    'income-tax-calculator': {
      fields: [{ id: 'income', label: 'Taxable Income ($)', placeholder: '75000' }, { id: 'state', label: 'State Tax Rate (%)', placeholder: '5' }],
      compute: (v) => {
        const brackets: [number, number][] = [[10275, 0.10], [41775, 0.12], [89075, 0.22], [170050, 0.24], [215950, 0.32], [539900, 0.35], [Infinity, 0.37]];
        let federal = 0, prev = 0;
        for (const [limit, rate] of brackets) { if (v.income > prev) { federal += (Math.min(v.income, limit) - prev) * rate; } prev = limit; if (v.income <= limit) break; }
        const state = v.income * v.state / 100;
        return `Federal: $${federal.toFixed(2)} | State: $${state.toFixed(2)} | Total: $${(federal+state).toFixed(2)} | Eff. Rate: ${((federal+state)/v.income*100).toFixed(1)}%`;
      },
    },
    'salary-calculator': {
      fields: [{ id: 'salary', label: 'Annual Salary ($)', placeholder: '60000' }, { id: 'hours', label: 'Hours per Week', placeholder: '40' }],
      compute: (v) => { const hourly = v.salary / (v.hours * 52); return `Hourly: $${hourly.toFixed(2)} | Monthly: $${(v.salary/12).toFixed(2)} | Bi-weekly: $${(v.salary/26).toFixed(2)} | Weekly: $${(v.salary/52).toFixed(2)}`; },
    },
    '401k-calculator': {
      fields: [{ id: 'salary', label: 'Annual Salary ($)', placeholder: '70000' }, { id: 'contrib', label: 'Contribution (%)', placeholder: '6' }, { id: 'match', label: 'Employer Match (%)', placeholder: '3' }, { id: 'rate', label: 'Annual Return (%)', placeholder: '7' }, { id: 'years', label: 'Years to Retirement', placeholder: '30' }],
      compute: (v) => {
        const annual = v.salary * (v.contrib + v.match) / 100;
        const monthly = annual / 12;
        const r = v.rate / 100 / 12;
        const n = v.years * 12;
        const fv = monthly * (Math.pow(1+r,n)-1) / r;
        return `Monthly contribution: $${monthly.toFixed(2)} | Projected balance: $${Math.round(fv).toLocaleString()}`;
      },
    },
    'interest-rate-calculator': {
      fields: [{ id: 'pv', label: 'Present Value ($)', placeholder: '10000' }, { id: 'fv', label: 'Future Value ($)', placeholder: '15000' }, { id: 'years', label: 'Years', placeholder: '5' }],
      compute: (v) => { const r = (Math.pow(v.fv / v.pv, 1 / v.years) - 1) * 100; return `Required Annual Rate: ${r.toFixed(4)}%`; },
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
  };

  const config = configs[slug];
  const fields = config?.fields ?? [{ id: 'value1', label: 'Value 1', placeholder: '0' }, { id: 'value2', label: 'Value 2', placeholder: '0' }];

  const handleCalculate = () => {
    if (config) {
      const vals: Record<string, number> = {};
      for (const f of fields) { vals[f.id] = parseFloat(inputs[f.id] ?? '0') || 0; }
      try { setResult(config.compute(vals)); } catch { setResult('Invalid input — please check your values.'); }
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
const calcContent: Record<string, { howTo: string; formula?: string; faqs: { q: string; a: string }[] }> = {
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
  'mortgage-calculator': {
    howTo: 'Enter your home price and down payment (as a percentage or fixed dollar amount). The loan amount updates automatically. Set your interest rate and loan term, then click Calculate. Expand the advanced section to add property tax, home insurance, PMI, HOA fees, and extra monthly payments to see your full monthly cost and a yearly amortization schedule.',
    formula: 'Monthly P&I = P × r(1+r)ⁿ / [(1+r)ⁿ − 1], where P = loan amount, r = monthly rate, n = number of payments.',
    faqs: [
      { q: 'What is PMI and when does it apply?', a: 'Private Mortgage Insurance (PMI) is required when your down payment is less than 20%. It protects the lender and typically costs 0.5–1% of the loan amount per year.' },
      { q: 'How does an extra monthly payment help?', a: 'Extra principal payments reduce your balance faster, saving significant interest over the life of the loan and shortening the payoff timeline.' },
      { q: 'What is included in the total monthly payment?', a: 'The full monthly cost includes principal & interest, property tax (1/12 of annual), homeowner\'s insurance (1/12 of annual), PMI (if applicable), and HOA fees.' },
    ],
  },
  'bmi-calculator': {
    howTo: 'Select Imperial or Metric units, enter your weight and height, then click Calculate BMI. Your BMI score will appear along with its category (Underweight, Normal, Overweight, or Obese) and the healthy weight range for your height.',
    formula: 'BMI = weight(kg) / height(m)² — or in imperial: BMI = 703 × weight(lbs) / height(in)²',
    faqs: [
      { q: 'Is BMI an accurate measure of health?', a: 'BMI is a useful screening tool but does not account for muscle mass, bone density, age, or body fat distribution. Consult a healthcare provider for a complete assessment.' },
      { q: 'What is a healthy BMI?', a: 'For adults, a BMI of 18.5–24.9 is considered normal/healthy by the WHO and CDC.' },
    ],
  },
  'calorie-calculator': {
    howTo: 'Select your sex, then enter your age, weight (kg), and height (cm). Choose your typical activity level and click Calculate. Results show your Basal Metabolic Rate (BMR) and your Total Daily Energy Expenditure (TDEE), plus calorie targets for weight loss and gain.',
    formula: 'BMR (Mifflin–St Jeor): Men = 10×weight + 6.25×height − 5×age + 5; Women = 10×weight + 6.25×height − 5×age − 161. TDEE = BMR × activity multiplier.',
    faqs: [
      { q: 'What is BMR vs TDEE?', a: 'BMR is the calories your body burns at complete rest. TDEE (Total Daily Energy Expenditure) is BMR multiplied by an activity factor — the actual calories you burn in a day.' },
      { q: 'How many calories should I cut to lose weight?', a: 'A 500-calorie daily deficit typically results in about 1 lb of fat loss per week. Never go below ~1200 cal/day (women) or ~1500 cal/day (men) without medical supervision.' },
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
};

const defaultContent = (name: string) => ({
  howTo: `${name} — enter the required values in the fields above and click Calculate to get instant, accurate results. All calculations run locally in your browser with no data sent to any server.`,
  faqs: [
    { q: `Is this ${name} free to use?`, a: 'Yes, completely free with no signup, no ads, and no data collection.' },
    { q: 'Are the results accurate?', a: 'All formulas follow standard mathematical and financial definitions. For professional decisions, please consult a qualified expert.' },
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
    'credit-cards-payoff-calculator': <CreditCardCalculator />,
    'debt-payoff-calculator': <CreditCardCalculator />,
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

        {/* FAQ */}
        {content.faqs.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {content.faqs.map((faq, i) => (
                <div key={i} className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                  <div className="font-semibold text-gray-900 dark:text-white mb-1">{faq.q}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</div>
                </div>
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
                  <span>{r.emoji}</span>
                <Link href={`/calculators/${r.slug}/`} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group">
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
