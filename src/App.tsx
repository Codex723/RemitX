import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  SendDimmed, 
  History, 
  LineChart, 
  Settings as SettingsIcon, 
  ArrowRightLeft,
  ChevronRight,
  TrendingDown,
  AlertCircle
} from 'lucide-react';
import { SendFlow } from './components/SendFlow';
import { RateTracker } from './components/RateTracker';
import { TransactionHistory } from './components/TransactionHistory';
import { Settings } from './components/Settings';
import { TransactionRecord } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'send' | 'rates' | 'history' | 'settings'>('send');
  const [transactions, setTransactions] = useState<TransactionRecord[]>([
    { id: '1', timestamp: 'Oct 24, 14:20', from: 'USD', to: 'Maria Santos', amount: '150.00', currency: 'USD', status: 'completed' },
    { id: '2', timestamp: 'Oct 22, 09:12', from: 'USD', to: 'Ade Wale', amount: '2,500.00', currency: 'NGN', status: 'pending' },
    { id: '3', timestamp: 'Oct 18, 18:45', from: 'XLM', to: 'Me', amount: '50.00', currency: 'XLM', status: 'completed' },
  ]);

  const addTransaction = (amount: string) => {
    const newTx: TransactionRecord = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      from: 'USD',
      to: 'Recipient (Routed)',
      amount,
      currency: 'PHP',
      status: 'completed'
    };
    setTransactions([newTx, ...transactions]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'send': return <SendFlow onComplete={addTransaction} />;
      case 'rates': return <RateTracker />;
      case 'history': return <TransactionHistory transactions={transactions} onSync={setTransactions} />;
      case 'settings': return <Settings />;
      default: return <SendFlow onComplete={addTransaction} />;
    }
  };

  return (
    <div className="dashboard-layout font-sans text-slate-300">
      {/* Desktop Sidebar */}
      <aside className="sidebar shrink-0 hidden md:flex">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-xl shadow-indigo-500/20 text-xl">R</div>
          <div>
            <h1 className="text-xl font-bold text-white leading-none">RemitX</h1>
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">Stellar Protocol</span>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <SidebarLink 
            active={activeTab === 'send'} 
            onClick={() => setActiveTab('send')}
            icon={<ArrowRightLeft className="w-5 h-5" />}
            label="Execute Remittance"
          />
          <SidebarLink 
            active={activeTab === 'rates'} 
            onClick={() => setActiveTab('rates')}
            icon={<LineChart className="w-5 h-5" />}
            label="Market Rates"
          />
          <SidebarLink 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')}
            icon={<History className="w-5 h-5" />}
            label="Ledger History"
          />
        </nav>

        <div className="mt-auto space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase text-emerald-500">Node Connected</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-mono uppercase">horizon-testnet.stellar.org</p>
          </div>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
              activeTab === 'settings' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <SettingsIcon className={`w-5 h-5 transition-transform ${activeTab === 'settings' ? 'rotate-45 text-white' : 'group-hover:rotate-45'}`} />
            <span className="text-sm font-bold">Protocol Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-white capitalize">
              {activeTab === 'send' ? 'Transfer Funds' : 
               activeTab === 'rates' ? 'Exchange Monitoring' : 
               activeTab === 'history' ? 'Activity Ledger' : 
               'Protocol Configuration'}
            </h2>
            <p className="text-slate-500 text-sm font-medium">Global cross-border settlement powered by Stellar</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="text-xs font-bold text-slate-300">Testnet: G...A4BZ</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-bold text-xs">JP</div>
             </div>
          </div>
        </header>

        <div className="max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <nav className="md:hidden fixed bottom-6 left-4 right-4 bg-slate-900/90 backdrop-blur-xl border border-slate-800 px-6 py-3 flex justify-between items-center z-50 rounded-2xl shadow-2xl">
        <NavButton active={activeTab === 'send'} onClick={() => setActiveTab('send')} icon={<ArrowRightLeft className="w-5 h-5" />} label="Send" />
        <NavButton active={activeTab === 'rates'} onClick={() => setActiveTab('rates')} icon={<LineChart className="w-5 h-5" />} label="Rates" />
        <NavButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<History className="w-5 h-5" />} label="History" />
        <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<SettingsIcon className="w-5 h-5" />} label="Settings" />
      </nav>
    </div>
  );
}

function SidebarLink({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${
        active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
      }`}
    >
      <div className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} transition-colors`}>
        {icon}
      </div>
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </button>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all flex-1 ${active ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-400'}`}
    >
      <div className={`p-2 rounded-xl transition-all ${active ? 'bg-indigo-500/10' : ''}`}>
        {icon}
      </div>
      <span className="text-[9px] font-black uppercase tracking-wider">{label}</span>
    </button>
  );
}
