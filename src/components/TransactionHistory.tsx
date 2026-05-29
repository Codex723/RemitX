import { useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { TransactionRecord } from '../types';

interface TransactionHistoryProps {
  transactions: TransactionRecord[];
  onSync: (txs: TransactionRecord[]) => void;
}

const STATUS_MAP = {
  completed: {
    label: 'Confirmed',
    icon: CheckCircle2,
    className: 'text-emerald-500/80',
  },
  pending: {
    label: 'Validating',
    icon: Clock,
    className: 'text-amber-500/80 animate-pulse',
  },
  failed: {
    label: 'Failed',
    icon: XCircle,
    className: 'text-rose-500/80',
  },
};

export function TransactionHistory({ transactions, onSync }: TransactionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch =
      tx.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.currency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.amount.includes(searchTerm) ||
      tx.from.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      // Simulate Stellar Horizon ledger sync
      await new Promise(res => setTimeout(res, 2000));
      // Mark any pending transactions as resolved (simulate on-chain confirmation)
      const updated = transactions.map(tx =>
        tx.status === 'pending'
          ? { ...tx, status: 'completed' as const }
          : tx
      );
      onSync(updated);
    } finally {
      setIsSyncing(false);
    }
  };

  const totalSent = transactions
    .filter(tx => tx.status === 'completed' && tx.from === 'USD')
    .reduce((sum, tx) => sum + parseFloat(tx.amount.replace(/,/g, '')), 0);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-800">
          <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest mb-1">Total Txns</p>
          <p className="text-2xl font-black text-white">{transactions.length}</p>
        </div>
        <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-800">
          <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest mb-1">Completed</p>
          <p className="text-2xl font-black text-emerald-400">
            {transactions.filter(tx => tx.status === 'completed').length}
          </p>
        </div>
        <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-800">
          <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest mb-1">Pending</p>
          <p className="text-2xl font-black text-amber-400">
            {transactions.filter(tx => tx.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            placeholder="Search ledger records..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500 transition-all text-sm text-white placeholder:text-slate-600 shadow-inner"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'completed', 'pending', 'failed'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900/40 border border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx, index) => {
            const statusInfo = STATUS_MAP[tx.status];
            const StatusIcon = statusInfo.icon;
            const isOutgoing = tx.from === 'USD' || tx.from === 'GBP';

            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 flex items-center justify-between hover:bg-slate-900/60 hover:border-slate-700 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl transition-colors ${
                      isOutgoing
                        ? 'bg-slate-800 text-slate-500 group-hover:text-indigo-400'
                        : 'bg-emerald-500/10 text-emerald-500'
                    }`}
                  >
                    {isOutgoing ? (
                      <ArrowUpRight className="w-5 h-5" />
                    ) : (
                      <ArrowDownLeft className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 group-hover:text-white transition-colors">
                      {tx.to}
                    </h4>
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black font-mono">
                      {tx.timestamp}
                    </p>
                    <p className="text-[9px] text-slate-600 font-medium mt-0.5">
                      from {tx.from}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-black tracking-tighter ${
                      isOutgoing ? 'text-white' : 'text-emerald-500'
                    }`}
                  >
                    {isOutgoing ? '−' : '+'}
                    {tx.amount} {tx.currency}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${statusInfo.className}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusInfo.label}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 text-sm font-medium">
              {searchTerm
                ? `No records matching "${searchTerm}"`
                : 'No transactions yet'}
            </p>
          </div>
        )}
      </div>

      {totalSent > 0 && (
        <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800 flex items-center justify-between">
          <span className="text-xs font-black uppercase text-slate-500 tracking-widest">
            Total Remitted
          </span>
          <span className="text-sm font-mono font-bold text-white">
            ${totalSent.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
          </span>
        </div>
      )}

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
            <>
              <RefreshCw className="w-3 h-3" />
              Sync Stellar Explorer
            </>
          )}
        </button>
      </div>
    </div>
  );
}
