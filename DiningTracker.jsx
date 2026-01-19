import { useState, useMemo } from 'react';

const MEAL_PLANS = [
  { name: 'NU-Unlimited', diningDollars: 400 },
  { name: 'NU-225', diningDollars: 600 },
  { name: 'NU-180', diningDollars: 300 },
  { name: 'NU-150', diningDollars: 200 },
  { name: 'NU-100', diningDollars: 200 },
];

const SEMESTER_WEEKS = 16;

export default function DiningTracker() {
  const [selectedPlan, setSelectedPlan] = useState(MEAL_PLANS[0]);
  const [spent, setSpent] = useState('');
  const [weeksRemaining, setWeeksRemaining] = useState(SEMESTER_WEEKS);

  const calculations = useMemo(() => {
    const spentNum = parseFloat(spent) || 0;
    const remaining = Math.max(0, selectedPlan.diningDollars - spentNum);
    const weeks = Math.max(1, weeksRemaining);
    
    return {
      remaining,
      perWeek: remaining / weeks,
      perDay: remaining / (weeks * 7),
      perMonth: (remaining / weeks) * 4,
      percentUsed: (spentNum / selectedPlan.diningDollars) * 100,
    };
  }, [selectedPlan, spent, weeksRemaining]);

  const formatMoney = (amount) => `$${amount.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-red-500 mb-1">NEU Dining Tracker</h1>
          <p className="text-gray-400 text-sm">Track your dining dollars budget</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Meal Plan</label>
            <select
              value={selectedPlan.name}
              onChange={(e) => setSelectedPlan(MEAL_PLANS.find(p => p.name === e.target.value))}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
            >
              {MEAL_PLANS.map((plan) => (
                <option key={plan.name} value={plan.name}>
                  {plan.name} (${plan.diningDollars} Dining Dollars)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Amount Spent ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={spent}
              onChange={(e) => setSpent(e.target.value)}
              placeholder="0.00"
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Weeks Remaining in Semester</label>
            <input
              type="number"
              min="1"
              max="20"
              value={weeksRemaining}
              onChange={(e) => setWeeksRemaining(parseInt(e.target.value) || 1)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        <div className="mt-6 bg-gray-800 rounded-lg p-6">
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Budget Used</span>
              <span>{calculations.percentUsed.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  calculations.percentUsed > 80 ? 'bg-red-500' : 
                  calculations.percentUsed > 50 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, calculations.percentUsed)}%` }}
              />
            </div>
          </div>

          <div className="text-center py-4 border-b border-gray-700">
            <p className="text-gray-400 text-sm">Remaining Balance</p>
            <p className={`text-3xl font-bold ${calculations.remaining < 50 ? 'text-red-400' : 'text-green-400'}`}>
              {formatMoney(calculations.remaining)}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 text-center">
            <div>
              <p className="text-gray-400 text-xs mb-1">Per Day</p>
              <p className="text-lg font-semibold">{formatMoney(calculations.perDay)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Per Week</p>
              <p className="text-lg font-semibold">{formatMoney(calculations.perWeek)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Per Month</p>
              <p className="text-lg font-semibold">{formatMoney(calculations.perMonth)}</p>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          Rates based on Fall/Spring 2025-2026 • Dining Dollars expire end of term
        </p>
      </div>
    </div>
  );
}
