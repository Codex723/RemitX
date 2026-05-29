import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  History,
  LineChart,
  Settings as SettingsIcon,
  ArrowRightLeft,
} from 'lucide-react';
import { SendFlow } from './components/SendFlow';
import { RateTracker } from './components/RateTracker';
import { TransactionHistory } from './components/TransactionHistory';
import { Settings } from './components/Settings';
import { TransactionRecord } from './types';

type Tab = 'send' | 'rates' | 'history' | 'settings';

const TABS: { id: Tab; label: string; shortLabel: string; icon: React.ReactNode; heading: string; sub: string }[] = [
  {
    id: 'send',
    label: 'Execute Remittance',
    shortLabel: 'Send',
    icon: <ArrowRightLeft className="w-5 h-5" />,
    heading: 'Transfer Funds',
    sub: 'Global cross-border settlement powered by Stellar',
  },
  {
    id: 'rates',
    label: 'Market Rates',
    shortLabel: 'Rates',
    icon: <LineChart className="w-5 h-5" />,
    heading: 'Exchange Monitoring',
    sub: 'Live DEX rates from Stellar Horizon',
  },
  {
    id: 'history',
    label: 'Ledger History',
    shortLabel: 'History',
    icon: <History className="w-5 h-5" />,
    heading: 'Activity Ledger',
    sub: 'Your on-chain remittance records',
  },
  {
    id: 'settings',
    label: 'Protocol Settings',
    shortLabel: 'Settings',
    icon: <SettingsIcon className="w-5 h-5" />,
    heading: 'Protocol Configuration',
    sub: 'Network, wallet, and notification settings',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('send');
  const [transactions, setTransactions] = useState<TransactionRecord[]>([
    {
      id: '1',
      timestamp: 'Oct 24, 14:20',
      from: 'USD',
      to: 'Maria Santos',
      amount: '150.00',
      currency: 'USD',
      status: 'completed',
    },
    {
      id: '2',
      timestamp: 'Oct 22, 09:12',
      from: 'USD',
      to: 'Ade Wale',
      amount: '2,500.00',
      currency: 'NGN',
      status: 'pending',
    },
    {
      id: '3',
      timestamp: 'Oct 18, 18:45',
      from: 'XLM',
      to: 'Me',
      amount: '50.00',
      currency: 'XLM',
      status: 'completed',
    },
  ]);

  const addTransaction = (amount: string) => {
    const newTx: TransactionRecord = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      from: 'USD',
      to: 'Recipient (Routed)',
      amount,
      currency: 'PHP',
      status: 'completed',
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const activeTabInfo = TABS.find(t => t.id === activeTab)!;

  const renderContent = () => {
    switch (activeTab) {
      case 'send':
        return <SendFlow onComplete={addTransaction} />;
      case 'rates':
        return <RateTracker />;
      case 'history':
        return <TransactionHistory transactions={transactions} onSync={setTransactions} />;
      case 'settings':
        return <Settings />;
    }
  };

  return (
    <div className="dashboard-layout font-sans text-slate-300">
      {/* Desktop Sidebar */}
      <aside className="sidebar shrink-0 hidden md:flex">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-xl shadow-indigo-500/20 text-xl">
            R
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-none">RemitX</h1>
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">
              Stellar Protocol
            </span>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          {TABS.filter(t => t.id !== 'settings').map(tab => (
            <SidebarLink
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              icon={tab.icon}
              label={tab.label}
            />
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase text-emerald-500">
                Node Connected
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-mono uppercase">
              horizon-testnet.stellar.org
            </p>
          </div>

          <SidebarLink
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
            icon={
              <SettingsIcon
                className={`w-5 h-5 transition-transform ${
                  activeTab === 'settings' ? 'rotate-45' : 'group-hover:rotate-45'
                }`}
              />
            }
            label="Protocol Settings"
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-white">{activeTabInfo.heading}</h2>
            <p className="text-slate-500 text-sm font-medium">{activeTabInfo.sub}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-300">Testnet</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 p-[2px]">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-bold text-xs">
                JP
              </div>
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

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 bg-slate-900/90 backdrop-blur-xl border border-slate-800 px-6 py-3 flex justify-between items-center z-50 rounded-2xl shadow-2xl">
        {TABS.map(tab => (
          <NavButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            icon={tab.icon}
            label={tab.shortLabel}
          />
        ))}
      </nav>
    </div>
  );
}

function SidebarLink({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${
        active
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
      }`}
    >
      <div
        className={`${
          active ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'
        } transition-colors`}
      >
        {icon}
      </div>
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </button>
  );
}

function NavButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all flex-1 ${
        active ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-400'
      }`}
    >
      <div className={`p-2 rounded-xl transition-all ${active ? 'bg-indigo-500/10' : ''}`}>
        {icon}
      </div>
      <span className="text-[9px] font-black uppercase tracking-wider">{label}</span>
    </button>
  );
}
