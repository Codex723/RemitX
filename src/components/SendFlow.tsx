import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  ChevronDown, 
  Globe, 
  ShieldCheck, 
  Zap,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';

export function SendFlow({ onComplete }: { onComplete: (amount: string) => void }) {
  const [amount, setAmount] = useState('100.00');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleExecute = () => {
    setIsProcessing(true);
    // Simulate Stellar network path finding and transaction submission
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onComplete((Number(amount) * 56.20).toFixed(2));
    }, 2500);
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
        <h2 className="text-2xl font-black text-white uppercase tracking-wider">Transaction Sent</h2>
        <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
          Your remittance of <span className="text-white font-bold">${amount} USD</span> has been successfully routed via the Stellar DEX and is being processed by the recipient anchor.
        </p>
        <div className="pt-6">
          <button 
            onClick={() => setIsSuccess(false)}
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
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">You Transfer</h2>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-slate-600">$</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-5xl font-black bg-transparent outline-none w-full border-b-2 border-slate-800 focus:border-indigo-500 transition-colors text-white py-2"
                    disabled={isProcessing}
                  />
                </div>
              </div>
              <div className="mt-6 bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold border border-slate-700 flex items-center gap-3 cursor-pointer hover:bg-slate-700 transition-colors">
                USD <ChevronDown className="w-4 h-4 text-slate-500" />
              </div>
            </div>

            <div className="relative h-px flex items-center justify-center">
              <div className="absolute inset-x-0 h-px bg-slate-800"></div>
              <div className="z-10 bg-slate-900 border border-slate-800 p-2 rounded-full">
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div className="flex-1">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Recipient Receives</h2>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-slate-600">₱</span>
                  <span className="text-5xl font-black text-white">{(Number(amount || 0) * 56.20).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
              <div className="mb-1 bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-sm font-bold border border-slate-700 flex items-center gap-3 cursor-pointer hover:bg-slate-700 transition-colors">
                PHP <ChevronDown className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative group">
          {!isProcessing && <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>}
          <button 
            onClick={handleExecute}
            disabled={isProcessing}
            className={cn(
              "relative w-full py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 transition-all text-lg",
              isProcessing ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-indigo-600 text-white active:scale-[0.99] hover:bg-indigo-500"
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
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
               <span className="text-[10px] font-black text-emerald-500 uppercase">Save $4.20</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center gap-5">
              <div className="flex -space-x-3 shrink-0">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-xs text-indigo-400 font-black border border-indigo-500/30">XL</div>
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xs text-slate-400 font-black border border-slate-700">USDC</div>
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center text-xs text-emerald-400 font-black border border-emerald-500/30">PH</div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-200 font-bold mb-1">DEX Liquidity Router</p>
                <p className="text-xs text-slate-500 leading-tight">Optimal path payment found via Horizon v2</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950/30 rounded-2xl border border-slate-800">
                <span className="text-[9px] uppercase font-black text-slate-500 block mb-1">Stellar Spread</span>
                <span className="text-sm font-mono font-bold text-white">0.12%</span>
              </div>
              <div className="p-4 bg-slate-950/30 rounded-2xl border border-slate-800">
                <span className="text-[9px] uppercase font-black text-slate-500 block mb-1">Anchor Fee</span>
                <span className="text-sm font-mono font-bold text-white">$1.50</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-bold uppercase tracking-wider">Total Duration</span>
              <span className="text-slate-300 font-mono">~ 45 Seconds</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-900 shadow-xl rounded-3xl border border-slate-800 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            RemitX handles SEP-24 anchor handshakes and cross-asset liquidity pathfinding automatically. Your funds are secured by multi-party atomic settlement.
          </p>
        </div>
      </div>
    </div>
  );
}
