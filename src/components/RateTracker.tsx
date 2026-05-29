import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  Bell,
  RefreshCw,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ExchangeRate } from '../types';

const CORRIDORS = [
  { pair: 'USD/PHP', symbol: '₱', description: 'US Dollar → Philippine Peso' },
  { pair: 'XLM/NGN', symbol: '₦', description: 'Stellar Lumens → Nigerian Naira' },
  { pair: 'GBP/USD', symbol: '$', description: 'British Pound → US Dollar' },
  { pair: 'USD/NGN', symbol: '₦', description: 'US Dollar → Nigerian Naira' },
];

export function RateTracker() {
  const [isPolling, setIsPolling] = useState(false);
  const [rates, setRates] = useState<ExchangeRate[]>([
    { pair: 'USD/PHP', rate: 56.24, change: '+0.12%', trend: 'up', lastUpdated: '' },
    { pair: 'XLM/NGN', rate: 189.60, change: '-1.45%', trend: 'down', lastUpdated: '' },
    { pair: 'GBP/USD', rate: 1.2700, change: '+0.04%', trend: 'up', lastUpdated: '' },
    { pair: 'USD/NGN', rate: 1580.00, change: '+0.22%', trend: 'up', lastUpdated: '' },
  ]);
  const [alertPair, setAlertPair] = useState('USD/NGN > 1,600.00');
  const [alertSet, setAlertSet] = useState(false);
  const [alertConfirmed, setAlertConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = useCallback(async () => {
    setIsPolling(true);
    setError(null);
    try {
      const res = await fetch('/api/rates');
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();

      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setRates(prev => {
        return data.rates.map((r: { pair: string; rate: number }) => {
          const old = prev.find(p => p.pair === r.pair);
          const oldRate = old?.rate ?? r.rate;
          const diff = r.rate - oldRate;
          const pct = oldRate !== 0 ? ((diff / oldRate) * 100).toFixed(2) : '0.00';
          const trend: 'up' | 'down' = diff >= 0 ? 'up' : 'down';
          return {
            pair: r.pair,
            rate: r.rate,
            change: `${diff >= 0 ? '+' : ''}${pct}%`,
            trend,
            lastUpdated: now,
          };
        });
      });
    } catch {
      setError('Could not reach Horizon node. Showing cached rates.');
    } finally {
      setIsPolling(false);
    }
  }, []);

  // Auto-poll every 30 seconds
  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 30_000);
    return () => clearInterval(interval);
  }, [fetchRates]);

  const handleSetAlert = () => {
    if (!alertPair.trim()) return;
    setAlertSet(true);
    setAlertConfirmed(true);
    setTimeout(() => setAlertConfirmed(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-lg font-bold text-white">Market Protocol</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
            Live DEX Routing · Auto-refresh 30s
          </p>
        </div>
        <button
          onClick={fetchRates}
          disabled={isPolling}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl hover:bg-indigo-500/20 transition-all disabled:opacity-50"
        >
          <RefreshCw className={cn('w-3 h-3', isPolling && 'animate-spin')} />
          {isPolling ? 'Syncing...' : 'Poll Node'}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          <p className="text-xs text-amber-300 font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rates.map((rate, index) => {
          const corridor = CORRIDORS.find(c => c.pair === rate.pair);
          return (
            <motion.div
              key={rate.pair}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 flex items-center justify-between group hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-2xl transition-all ${
                    rate.trend === 'up'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-rose-500/10 text-rose-500'
                  }`}
                >
                  {rate.trend === 'up' ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {rate.pair}
                  </h3>
                  <p className="text-[9px] text-slate-600 font-medium">{corridor?.description}</p>
                  <span
                    className={`text-[10px] font-black uppercase tracking-tighter ${
                      rate.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'
                    }`}
                  >
                    {rate.change}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-white font-mono tracking-tighter">
                  {corridor?.symbol}{rate.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </p>
                {rate.lastUpdated && (
                  <p className="text-[9px] text-slate-600 font-mono">{rate.lastUpdated}</p>
                )}
                <button
                  onClick={() => setAlertPair(`${rate.pair} > ${(rate.rate * 1.02).toFixed(2)}`)}
                  title="Set alert for this pair"
                  className="text-slate-600 hover:text-indigo-400 transition-colors mt-1"
                >
                  <Bell className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Threshold Alerts */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 text-white space-y-4 border border-slate-800 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
          <Bell className="w-20 h-20" />
        </div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <PlusCircle className="w-6 h-6 text-indigo-400" />
            <h3 className="font-bold">Threshold Alerts</h3>
          </div>
          {alertConfirmed && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase tracking-widest"
            >
              <CheckCircle2 className="w-3 h-3" /> Alert Active
            </motion.span>
          )}
        </div>
        <p className="text-[11px] text-slate-400 relative z-10 leading-relaxed font-medium">
          Configure notifications for specific Stellar liquidity pool fluctuations. Click a bell icon above to pre-fill a pair.
        </p>

        <div className="flex gap-2 relative z-10">
          <div className="flex-1 bg-slate-950/50 rounded-2xl p-4 border border-white/5 focus-within:border-indigo-500 transition-colors">
            <span className="text-[9px] text-slate-500 block uppercase font-black tracking-widest mb-1">
              Alert Condition
            </span>
            <input
              type="text"
              value={alertPair}
              onChange={e => setAlertPair(e.target.value)}
              className="bg-transparent outline-none font-mono font-bold text-indigo-400 text-sm w-full"
            />
          </div>
          <button
            onClick={handleSetAlert}
            className={cn(
              'px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all',
              alertConfirmed
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95'
            )}
          >
            {alertConfirmed ? 'Set!' : 'Set'}
          </button>
        </div>

        {alertSet && (
          <div className="relative z-10 p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
            <p className="text-[10px] text-indigo-300 font-medium">
              ✓ Alert configured: <span className="text-white font-bold">{alertPair}</span>
            </p>
          </div>
        )}
      </div>

      <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/20 flex gap-4 items-start backdrop-blur-sm">
        <div className="p-1.5 bg-amber-500/10 rounded-lg shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
        </div>
        <p className="text-[11px] text-amber-200/80 leading-relaxed font-medium">
          DEX Volatility Notice: Anchor off-ramp spreads for{' '}
          <span className="text-amber-500 font-bold">NGN Corridors</span> may fluctuate. Always
          confirm final rate before executing.
        </p>
      </div>
    </div>
  );
}
