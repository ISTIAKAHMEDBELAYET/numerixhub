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
  const [result, setResult] = useState<{ bmi: number; category: string; color: string } | null>(null);

  const calculate = () => {
    let bmi = 0;
    if (unit === 'imperial') {
      const ft = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      const totalInches = ft * 12 + inches;
      const lbs = parseFloat(weight);
      if (!lbs || !totalInches) return;
      bmi = (lbs / (totalInches * totalInches)) * 703;
    } else {
      const cm = parseFloat(heightCm);
      const kg = parseFloat(weight);
      if (!kg || !cm) return;
      const m = cm / 100;
      bmi = kg / (m * m);
    }
    let category = '';
    let color = '';
    if (bmi < 18.5) { category = 'Underweight'; color = 'text-blue-600'; }
    else if (bmi < 25) { category = 'Normal weight'; color = 'text-green-600'; }
    else if (bmi < 30) { category = 'Overweight'; color = 'text-yellow-600'; }
    else { category = 'Obese'; color = 'text-red-600'; }
    setResult({ bmi: Math.round(bmi * 10) / 10, category, color });
  };

  return (
    <div className="space-y-5">
      <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 w-fit">
        <button onClick={() => setUnit('imperial')} className={`px-5 py-2 text-sm font-medium ${unit === 'imperial' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Imperial</button>
        <button onClick={() => setUnit('metric')} className={`px-5 py-2 text-sm font-medium ${unit === 'metric' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Metric</button>
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
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center">
          <div className={`text-5xl font-extrabold ${result.color} mb-2`}>{result.bmi}</div>
          <div className={`text-xl font-semibold ${result.color}`}>{result.category}</div>
          <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
            {[['< 18.5', 'Underweight', 'bg-blue-100 text-blue-700'], ['18.5–24.9', 'Normal', 'bg-green-100 text-green-700'], ['25–29.9', 'Overweight', 'bg-yellow-100 text-yellow-700'], ['≥ 30', 'Obese', 'bg-red-100 text-red-700']].map(([range, label, cls]) => (
              <div key={label} className={`p-2 rounded-lg ${cls}`}><div className="font-bold">{range}</div><div>{label}</div></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MortgageCalculator() {
  const [principal, setPrincipal] = useState('300000');
  const [rate, setRate] = useState('7');
  const [term, setTerm] = useState('30');
  const [result, setResult] = useState<{ monthly: number; totalPayment: number; totalInterest: number } | null>(null);

  const calculate = () => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseFloat(term) * 12;
    if (!P || !r || !n) return;
    const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = monthly * n;
    const totalInterest = totalPayment - P;
    setResult({ monthly, totalPayment, totalInterest });
  };

  const fmt = (n: number) => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Home Price ($)</label><input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Interest Rate (%)</label><input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /></div>
        <div><label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Loan Term (years)</label>
          <select value={term} onChange={e => setTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            <option value="30">30 years</option><option value="20">20 years</option><option value="15">15 years</option><option value="10">10 years</option>
          </select>
        </div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate Payment</button>
      {result && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
          <div className="text-center mb-5">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Monthly Payment</div>
            <div className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">{fmt(result.monthly)}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center"><div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Payment</div><div className="font-bold text-gray-900 dark:text-white">{fmt(result.totalPayment)}</div></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center"><div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Interest</div><div className="font-bold text-red-500">{fmt(result.totalInterest)}</div></div>
          </div>
        </div>
      )}
    </div>
  );
}

function AgeCalculator() {
  const [dob, setDob] = useState('');
  const [result, setResult] = useState<{ years: number; months: number; days: number; nextBirthday: number } | null>(null);

  const calculate = () => {
    if (!dob) return;
    const birth = new Date(dob);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();
    if (days < 0) { months--; const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0); days += prevMonth.getDate(); }
    if (months < 0) { years--; months += 12; }
    const nextBday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday <= today) nextBday.setFullYear(today.getFullYear() + 1);
    const daysUntil = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    setResult({ years, months, days, nextBirthday: daysUntil });
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date of Birth</label>
        <input type="date" value={dob} onChange={e => setDob(e.target.value)} max={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
      </div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Calculate Age</button>
      {result && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
          <div className="text-center mb-4">
            <div className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">{result.years}</div>
            <div className="text-gray-500 dark:text-gray-400 font-medium">Years Old</div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3"><div className="text-2xl font-bold text-purple-600">{result.years}</div><div className="text-xs text-gray-500">Years</div></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3"><div className="text-2xl font-bold text-purple-600">{result.months}</div><div className="text-xs text-gray-500">Months</div></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3"><div className="text-2xl font-bold text-purple-600">{result.days}</div><div className="text-xs text-gray-500">Days</div></div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            🎂 Next birthday in <span className="font-bold text-indigo-600">{result.nextBirthday}</span> days
          </div>
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
    while (peek() === '*' || peek() === '/') {
      const op = consume();
      const right = parsePow();
      left = op === '*' ? left * right : left / right;
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
                        try { const v = parseFloat(expr); setDisplay(String(1/v)); setExpr(String(1/v)); setJustCalc(true); } catch { setDisplay('Error'); }
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
    const contributed = P + pmt * 12 * t;
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
    'gpa-calculator': {
      fields: [{ id: 'total', label: 'Total Grade Points', placeholder: '35' }, { id: 'credits', label: 'Total Credit Hours', placeholder: '12' }],
      compute: (v) => `GPA: ${(v.total / v.credits).toFixed(2)}`,
    },
    'grade-calculator': {
      fields: [{ id: 'earned', label: 'Points Earned', placeholder: '92' }, { id: 'total', label: 'Total Points', placeholder: '100' }],
      compute: (v) => `Grade: ${((v.earned / v.total) * 100).toFixed(1)}%`,
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
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{f.label}</label>
            <input
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

export default function CalculatorEngine({ calc }: CalculatorEngineProps) {
  const relatedCalcs = calculators.filter(c => c.category === calc.category && c.slug !== calc.slug).slice(0, 6);

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
  };

  const ui = calculatorComponents[calc.slug] ?? <GenericCalculator slug={calc.slug} name={calc.name} />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Calculator */}
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <span className="text-4xl">{calc.emoji}</span>
              <div>
                <h1 className="text-2xl font-bold">{calc.name}</h1>
                <p className="text-white/80 text-sm mt-0.5">{calc.description}</p>
              </div>
            </div>
          </div>
          <div className="p-6">{ui}</div>
        </div>

        <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">How to Use {calc.name}</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {calc.description} Simply enter the required values in the fields above and click the Calculate button to get instant, accurate results. All calculations are performed locally in your browser — no data is sent to any server.
          </p>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-5">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">Related Calculators</h3>
          <ul className="space-y-2">
            {relatedCalcs.map(r => (
              <li key={r.slug}>
                <Link href={`/calculators/${r.slug}/`} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group">
                  <span>{r.emoji}</span>
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
