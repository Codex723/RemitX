import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft,
  Search,
  RefreshCw
} from 'lucide-react';
import { TransactionRecord } from '../types';

export function TransactionHistory({ transactions }: { transactions: TransactionRecord[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const filteredTransactions = transactions.filter(tx => 
    tx.to.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tx.currency.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.amount.includes(searchTerm)
  );

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
        <input 
          type="text" 
          placeholder="Search ledger records..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500 transition-all text-sm text-white placeholder:text-slate-600 shadow-inner"
        />
      </div>

      <div className="space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx, index) => (
            <motion.div 
              key={tx.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 flex items-center justify-between hover:bg-slate-900/60 hover:border-slate-700 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl transition-colors ${tx.from === 'USD' ? 'bg-slate-800 text-slate-500 group-hover:text-indigo-400' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {tx.from === 'USD' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 group-hover:text-white transition-colors">{tx.to}</h4>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black font-mono">{tx.timestamp}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black tracking-tighter ${tx.from === 'USD' ? 'text-white' : 'text-emerald-500'}`}>
                  {tx.from === 'USD' ? '−' : '+'}{tx.amount} {tx.currency}
                </p>
                <div className="flex items-center justify-end gap-1">
                  {tx.status === 'completed' ? (
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/80 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Confirmed
                    </span>
                  ) : (
                    <span className="text-[9px] font-black uppercase tracking-widest text-amber-500/80 flex items-center gap-1 animate-pulse">
                      <Clock className="w-3 h-3" /> Validating
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 text-sm font-medium">No records matching "{searchTerm}"</p>
          </div>
        )}
      </div>

      <div className="pt-4">
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="w-full py-4 rounded-2xl border border-dotted border-slate-800 text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] hover:border-indigo-500 hover:text-indigo-400 transition-all bg-slate-950/50 flex items-center justify-center gap-2"
        >
          {isSyncing ? (
            <>
              <RefreshCw className="w-3 h-3 animate-spin" />
              Ingesting Ledger...
            </>
          ) : (
            "Sync Stellar Explorer"
          )}
        </button>
      </div>
    </div>
  );
}

