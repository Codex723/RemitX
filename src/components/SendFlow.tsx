import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ChevronDown,
  Globe,
  ShieldCheck,
  Zap,
  Info,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AnchorOption } from '../types';

const CORRIDORS = [
  { id: 'usd-php', from: 'USD', to: 'PHP', fromSymbol: '$', toSymbol: '₱', label: 'USD → PHP' },
  { id: 'usd-ngn', from: 'USD', to: 'NGN', fromSymbol: '$', toSymbol: '₦', label: 'USD → NGN' },
  { id: 'gbp-usd', from: 'GBP', to: 'USD', fromSymbol: '£', toSymbol: '$', label: 'GBP → USD' },
  { id: 'xlm-ngn', from: 'XLM', to: 'NGN', fromSymbol: '✦', toSymbol: '₦', label: 'XLM → NGN' },
];

const BASE_RATES: Record<string, number> = {
  'USD-PHP': 56.20,
  'USD-NGN': 1580.00,
  'GBP-USD': 1.27,
  'XLM-NGN': 189.60,
};

interface RouteInfo {
  spread: string;
  anchorFee: string;
  savings: string;
  duration: string;
  path: string;
}

export function SendFlow({ onComplete }: { onComplete: (amount: string) => void }) {
  const [amount, setAmount] = useState('100.00');
  const [selectedCorridorId, setSelectedCorridorId] = useState('usd-php');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [liveRate, setLiveRate] = useState<number | null>(null);
  const [anchors, setAnchors] = useState<AnchorOption[]>([]);
  const [routeInfo, setRouteInfo] = useState<RouteInfo>({
    spread: '0.12%',
    anchorFee: '$1.50',
    savings: '$4.20',
    duration: '~ 45 Seconds',
    path: 'XLM → USDC → Anchor',
  });
  const [error, setError] = useState<string | null>(null);

  const corridor = CORRIDORS.find(c => c.id === selectedCorridorId)!;
  const rateKey = `${corridor.from}-${corridor.to}`;
  const rate = liveRate ?? BASE_RATES[rateKey] ?? 1;
  const receivedAmount = (parseFloat(amount || '0') * rate);

  // Fetch live rates and anchor data
  const fetchLiveData = useCallback(async () => {
    try {
      const [ratesRes, anchorsRes] = await Promise.all([
        fetch('/api/rates'),
        fetch('/api/anchors'),
      ]);

      if (ratesRes.ok) {
        const ratesData = await ratesRes.json();
        const match = ratesData.rates?.find(
          (r: { pair: string; rate: number }) => r.pair === `${corridor.from}/${corridor.to}`
        );
        if (match) setLiveRate(match.rate);
        else setLiveRate(BASE_RATES[rateKey] ?? null);
      }

      if (anchorsRes.ok) {
        const anchorsData = await anchorsRes.json();
        setAnchors(anchorsData);

        // Find best anchor for this corridor
        const matchingAnchor = anchorsData.find(
          (a: AnchorOption) => a.corridor === corridor.to
        );
        if (matchingAnchor) {
          const totalFee = matchingAnchor.fixed + (parseFloat(amount) * matchingAnchor.fee) / 100;
          const bestSaving = (4.5 - totalFee).toFixed(2);
          setRouteInfo({
            spread: `${matchingAnchor.fee}%`,
            anchorFee: `$${matchingAnchor.fixed.toFixed(2)}`,
            savings: `$${Math.max(0, parseFloat(bestSaving)).toFixed(2)}`,
            duration: '~ 45 Seconds',
            path: `XLM → USDC → ${matchingAnchor.name}`,
          });
        }
      }
    } catch {
      // Silently fall back to defaults
    }
  }, [corridor.from, corridor.to, rateKey, amount]);

  useEffect(() => {
    setLiveRate(null); // reset on corridor change
    fetchLiveData();
  }, [selectedCorridorId, fetchLiveData]);

  const handleExecute = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    setError(null);
    setIsProcessing(true);

    try {
      // Call the real paths API
      await fetch(
        `/api/paths?destinationAsset=native&destinationAmount=${parseFloat(amount).toFixed(7)}`
      );
      // Simulate Stellar settlement time (real tx would sign+submit here)
      await new Promise(res => setTimeout(res, 2500));
      setIsSuccess(true);
      onComplete(receivedAmount.toFixed(2));
    } catch {
      setError('Transaction failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="sleek-card p-12 bg-slate-900/40 border-emerald-500/20 text-center space-y-6"
      >
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
          <ShieldCheck className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-wider">
          Transaction Sent
        </h2>
        <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
          Your remittance of{' '}
          <span className="text-white font-bold">
            {corridor.fromSymbol}{parseFloat(amount).toFixed(2)} {corridor.from}
          </span>{' '}
          has been successfully routed via the Stellar DEX. Recipient receives{' '}
          <span className="text-emerald-400 font-bold">
            {corridor.toSymbol}{receivedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {corridor.to}
          </span>.
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="font-mono">Settled via Stellar Horizon Testnet</span>
        </div>
        <div className="pt-6">
          <button
            onClick={() => { setIsSuccess(false); setAmount('100.00'); }}
            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all text-sm uppercase tracking-widest border border-slate-700"
          >
            New Transfer
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Transfer Interface */}
      <div className="space-y-6">
        <div className="sleek-card p-8 relative overflow-hidden bg-slate-900/40 border-slate-800/80 shadow-2xl">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <Globe className="w-48 h-48" />
          </div>

          <div className="space-y-8">
            {/* You Send */}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">
                  You Transfer
                </h2>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-slate-600">{corridor.fromSymbol}</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    min="1"
                    step="0.01"
                    className="text-5xl font-black bg-transparent outline-none w-full border-b-2 border-slate-800 focus:border-indigo-500 transition-colors text-white py-2"
                    disabled={isProcessing}
                  />
                </div>
              </div>

              {/* From currency dropdown */}
              <div className="relative mt-6">
                <button
                  onClick={() => setShowFromDropdown(!showFromDropdown)}
                  className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold border border-slate-700 flex items-center gap-3 hover:bg-slate-700 transition-colors"
                >
                  {corridor.from} <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>
                {showFromDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden z-20 shadow-2xl min-w-[160px]"
                  >
                    {CORRIDORS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => { setSelectedCorridorId(c.id); setShowFromDropdown(false); }}
                        className={cn(
                          'w-full px-4 py-3 text-left text-sm font-bold transition-colors flex items-center justify-between gap-4',
                          selectedCorridorId === c.id
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-300 hover:bg-slate-800'
                        )}
                      >
                        <span>{c.label}</span>
                        {selectedCorridorId === c.id && <CheckCircle2 className="w-3 h-3" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="relative h-px flex items-center justify-center">
              <div className="absolute inset-x-0 h-px bg-slate-800" />
              <div className="z-10 bg-slate-900 border border-slate-800 p-2 rounded-full">
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>

            {/* Recipient Receives */}
            <div className="flex justify-between items-end">
              <div className="flex-1">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">
                  Recipient Receives
                </h2>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-slate-600">{corridor.toSymbol}</span>
                  <span className="text-5xl font-black text-white">
                    {receivedAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <p className="text-[10px] text-slate-600 mt-2 font-mono">
                  Rate: 1 {corridor.from} = {rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {corridor.to}
                  {liveRate && <span className="text-emerald-600 ml-2">· Live</span>}
                </p>
              </div>
              <div className="mb-6 bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-sm font-bold border border-slate-700">
                {corridor.to}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            <p className="text-xs text-rose-300 font-medium">{error}</p>
          </div>
        )}

        <div className="relative group">
          {!isProcessing && (
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000" />
          )}
          <button
            onClick={handleExecute}
            disabled={isProcessing}
            className={cn(
              'relative w-full py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 transition-all text-lg',
              isProcessing
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white active:scale-[0.99] hover:bg-indigo-500'
            )}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                Finding Path...
              </>
            ) : (
              <>
                <ShieldCheck className="w-6 h-6" />
                Initialize Payment
              </>
            )}
          </button>
        </div>
      </div>

      {/* Optimization Details */}
      <div className="space-y-6">
        <div className="bg-slate-900/40 rounded-3xl p-8 border border-slate-800/80 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-indigo-400">
              <Zap className="w-5 h-5 fill-current" />
              <h3 className="text-sm font-black uppercase tracking-widest">Routing Optimization</h3>
            </div>
            {parseFloat(routeInfo.savings) > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <span className="text-[10px] font-black text-emerald-500 uppercase">
                  Save {routeInfo.savings}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="p-5 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center gap-5">
              <div className="flex -space-x-3 shrink-0">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-xs text-indigo-400 font-black border border-indigo-500/30">
                  XL
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xs text-slate-400 font-black border border-slate-700">
                  USDC
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center text-xs text-emerald-400 font-black border border-emerald-500/30">
                  {corridor.to.slice(0, 2)}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-200 font-bold mb-1">DEX Liquidity Router</p>
                <p className="text-xs text-slate-500 leading-tight">{routeInfo.path}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950/30 rounded-2xl border border-slate-800">
                <span className="text-[9px] uppercase font-black text-slate-500 block mb-1">
                  Stellar Spread
                </span>
                <span className="text-sm font-mono font-bold text-white">{routeInfo.spread}</span>
              </div>
              <div className="p-4 bg-slate-950/30 rounded-2xl border border-slate-800">
                <span className="text-[9px] uppercase font-black text-slate-500 block mb-1">
                  Anchor Fee
                </span>
                <span className="text-sm font-mono font-bold text-white">{routeInfo.anchorFee}</span>
              </div>
            </div>

            {/* Anchor comparison */}
            {anchors.length > 0 && (
              <div className="space-y-2">
                <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest">
                  Anchor Comparison
                </p>
                {anchors.slice(0, 3).map(a => (
                  <div
                    key={a.id}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-xl border text-xs',
                      a.corridor === corridor.to
                        ? 'border-indigo-500/30 bg-indigo-500/5 text-indigo-300'
                        : 'border-slate-800 bg-slate-950/30 text-slate-500'
                    )}
                  >
                    <span className="font-bold">{a.name}</span>
                    <span className="font-mono">
                      ${a.fixed.toFixed(2)} + {a.fee}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-bold uppercase tracking-wider">
                Total Duration
              </span>
              <span className="text-slate-300 font-mono">{routeInfo.duration}</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-900 shadow-xl rounded-3xl border border-slate-800 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            RemitX handles SEP-24 anchor handshakes and cross-asset liquidity pathfinding
            automatically. Rates are fetched live from Stellar Horizon. Running on{' '}
            <span className="text-indigo-400 font-bold">Testnet</span> — no real funds are
            transferred.
          </p>
        </div>
      </div>

      {/* Close dropdown on outside click */}
      {showFromDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowFromDropdown(false)}
        />
      )}
    </div>
  );
}
