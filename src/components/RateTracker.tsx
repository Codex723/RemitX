import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Bell, 
  RefreshCw,
  PlusCircle,
  AlertTriangle
} from 'lucide-react';

export function RateTracker() {
  const [isPolling, setIsPolling] = useState(false);
  const [rates, setRates] = useState([
    { pair: 'USD/PHP', rate: 56.24, change: '+0.12%', trend: 'up' },
    { pair: 'XLM/NGN', rate: 420.50, change: '-1.45%', trend: 'down' },
    { pair: 'GBP/USD', rate: 1.27, change: '+0.04%', trend: 'up' },
  ]);
  const [alertSet, setAlertSet] = useState(false);

  const pollRates = () => {
    setIsPolling(true);
    setTimeout(() => {
      setRates(prev => prev.map(r => ({
        ...r,
        rate: Number((r.rate + (Math.random() * 2 - 1) * 0.5).toFixed(2)),
        change: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 0.5).toFixed(2)}%`,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      })));
      setIsPolling(false);
    }, 1500);
  };

  const handleSetAlert = () => {
    setAlertSet(true);
    setTimeout(() => setAlertSet(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-lg font-bold text-white">Market Protocol</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Live DEX Routing</p>
        </div>
        <button 
          onClick={pollRates}
          disabled={isPolling}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl hover:bg-indigo-500/20 transition-all disabled:opacity-50"
        >
          <RefreshCw className={cn("w-3 h-3", isPolling && "animate-spin")} />
          {isPolling ? "Syncing..." : "Poll Node"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rates.map((rate, index) => (
          <motion.div 
            key={rate.pair}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 flex items-center justify-between group hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl transition-all ${rate.trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                {rate.trend === 'up' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{rate.pair}</h3>
                <span className={`text-[10px] font-black uppercase tracking-tighter ${rate.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {rate.change}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-white font-mono tracking-tighter">{rate.rate}</p>
              <button className="text-slate-600 hover:text-indigo-400 transition-colors">
                <Bell className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
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
          {alertSet && (
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] font-black text-emerald-500 uppercase tracking-widest"
            >
              Alert Active
            </motion.span>
          )}
        </div>
        <p className="text-[11px] text-slate-400 relative z-10 leading-relaxed font-medium">Configure push notifications for specific Stellar liquidity pool fluctuations.</p>
        
        <div className="flex gap-2 relative z-10">
          <div className="flex-1 bg-slate-950/50 rounded-2xl p-4 border border-white/5 focus-within:border-indigo-500 transition-colors">
            <span className="text-[9px] text-slate-500 block uppercase font-black tracking-widest mb-1">Pair Threshold</span>
            <input 
              type="text" 
              defaultValue="USD/NGN > 1,450.00" 
              className="bg-transparent outline-none font-mono font-bold text-indigo-400 text-sm w-full"
            />
          </div>
          <button 
            onClick={handleSetAlert}
            className={cn(
              "px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
              alertSet ? "bg-emerald-600 text-white" : "bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95"
            )}
          >
            {alertSet ? "Set!" : "Set"}
          </button>
        </div>
      </div>

      <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/20 flex gap-4 items-start backdrop-blur-sm">
        <div className="p-1.5 bg-amber-500/10 rounded-lg shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
        </div>
        <p className="text-[11px] text-amber-200/80 leading-relaxed font-medium">
          DEX Volatility Spike: Anchor off-ramp spreads for <span className="text-amber-500 font-bold">NGN Corridors</span> have increased by <span className="text-white font-bold">0.52%</span>.
        </p>
      </div>
    </div>
  );
}
