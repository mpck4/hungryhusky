import { useState, useMemo } from 'react';

const MEAL_PLANS = [
  { name: 'NU-Unlimited', diningDollars: 400, swipes: null },
  { name: 'NU-225',       diningDollars: 600, swipes: 225  },
  { name: 'NU-180',       diningDollars: 300, swipes: 180  },
  { name: 'NU-150',       diningDollars: 200, swipes: 150  },
  { name: 'NU-100',       diningDollars: 200, swipes: 100  },
];

const SEMESTER_WEEKS = 16;

export default function App() {
  const [selectedPlan, setSelectedPlan] = useState(MEAL_PLANS[0]);
  const [spent, setSpent]               = useState('');
  const [weeksRemaining, setWeeksRemaining] = useState(String(SEMESTER_WEEKS));

  const calc = useMemo(() => {
    const spentNum  = parseFloat(spent) || 0;
    const remaining = Math.max(0, selectedPlan.diningDollars - spentNum);
    const weeks = Math.max(1, parseInt(weeksRemaining) || 0);
    const perWeek   = remaining / weeks;

    return {
      remaining,
      perDay:      perWeek / 7,
      perWeek,
      // cap at remaining so it never shows an impossible value
      perMonth:    Math.min(remaining, perWeek * 4),
      percentUsed: Math.min(100, (spentNum / selectedPlan.diningDollars) * 100),
    };
  }, [selectedPlan, spent, weeksRemaining]);

  const fmt = (n) => `$${n.toFixed(2)}`;

  const barColor =
    calc.percentUsed > 80 ? 'bg-red-600' :
    calc.percentUsed > 50 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-5 py-8">
      <div className="max-w-md mx-auto space-y-7">

        {/* ── Header ── */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-red-600">Hungry</span> Husky
          </h1>
          <p className="text-neutral-500 text-sm mt-1">NEU Dining Dollar Tracker</p>
        </div>

        {/* ── Plan selector ── */}
        <div>
          <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest mb-3">
            Meal Plan
          </p>
          <div className="grid grid-cols-2 gap-2">
            {MEAL_PLANS.map((plan, i) => {
              const active = selectedPlan.name === plan.name;
              return (
                <button
                  key={plan.name}
                  onClick={() => setSelectedPlan(plan)}
                  className={[
                    'rounded-xl p-3 text-left border transition-colors',
                    i === 4 ? 'col-span-2' : '',
                    active
                      ? 'bg-red-600/15 border-red-600'
                      : 'bg-neutral-900 border-neutral-800 active:border-neutral-600',
                  ].join(' ')}
                >
                  <p className={`font-semibold text-sm ${active ? 'text-white' : 'text-neutral-300'}`}>
                    {plan.name}
                  </p>
                  <p className={`text-xs mt-0.5 ${active ? 'text-red-400' : 'text-neutral-500'}`}>
                    ${plan.diningDollars} dining dollars
                  </p>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    {plan.swipes ? `${plan.swipes} swipes` : 'Unlimited swipes'}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Inputs ── */}
        <div className="space-y-3">
          {[
            {
              label:       'Amount Spent ($)',
              inputMode:   'decimal',
              value:       spent,
              placeholder: '0.00',
              min:         0,
              step:        0.01,
              onChange:    (e) => setSpent(e.target.value),
            },
            {
              label:       'Weeks Remaining',
              inputMode:   'numeric',
              value:       weeksRemaining,
              placeholder: '16',
              min:         1,
              max:         20,
              step:        1,
              onChange: (e) => setWeeksRemaining(e.target.value),
            },
          ].map(({ label, ...props }) => (
            <div key={label}>
              <label className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-widest mb-2">
                {label}
              </label>
              <input
                type="number"
                {...props}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>
          ))}
        </div>

        {/* ── Results ── */}
        <div className="rounded-xl border border-neutral-800 overflow-hidden">

          {/* Progress */}
          <div className="px-4 pt-4 pb-3 border-b border-neutral-800">
            <div className="flex justify-between text-xs text-neutral-500 mb-2">
              <span>Budget Used</span>
              <span>{calc.percentUsed.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${barColor}`}
                style={{ width: `${calc.percentUsed}%` }}
              />
            </div>
          </div>

          {/* Remaining balance */}
          <div className="px-4 py-5 text-center border-b border-neutral-800">
            <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest mb-1">
              Remaining Balance
            </p>
            <p className={`text-4xl font-bold tracking-tight ${calc.remaining < 50 ? 'text-red-500' : 'text-white'}`}>
              {fmt(calc.remaining)}
            </p>
          </div>

          {/* Per day / week / month */}
          <div className="grid grid-cols-3 divide-x divide-neutral-800">
            {[
              { label: 'Per Day',   value: calc.perDay   },
              { label: 'Per Week',  value: calc.perWeek  },
              { label: 'Per Month', value: calc.perMonth },
            ].map(({ label, value }) => (
              <div key={label} className="py-4 text-center">
                <p className="text-[11px] text-neutral-500 mb-1">{label}</p>
                <p className="text-base font-semibold">{fmt(value)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <p className="text-center text-neutral-700 text-xs pb-2">
          Fall/Spring 2025–2X · Dining Dollars expire end of term · created by {' '}
          <a href="https://github.com/mpck4" className="hover:text-neutral-400 underline transition-colors">
            mpck4
          </a>
        </p>

      </div>
    </div>
  );
}
