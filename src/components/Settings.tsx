import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Globe, 
  Cpu, 
  Lock, 
  Database,
  Bell,
  Wallet
} from 'lucide-react';

export function Settings() {
  const [network, setNetwork] = useState('Testnet');
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="sleek-card p-6 bg-slate-900/40 border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white">Network Configuration</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
              <div>
                <p className="text-sm font-bold text-white">Horizon Endpoint</p>
                <p className="text-[10px] text-slate-500 font-mono uppercase">https://horizon-testnet.stellar.org</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setNetwork('Mainnet')}
                className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${network === 'Mainnet' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'}`}
              >
                Mainnet
              </button>
              <button 
                onClick={() => setNetwork('Testnet')}
                className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${network === 'Testnet' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'}`}
              >
                Testnet
              </button>
            </div>
          </div>
        </div>

        <div className="sleek-card p-6 bg-slate-900/40 border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white">Security & API</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
              <span className="text-[9px] uppercase font-black text-slate-500 block mb-1">Public Key</span>
              <p className="text-xs font-mono text-indigo-400 break-all font-bold">GCBBD47IF6LWNCZX6J6S6G7AVC2FDV57Z6S6G7AVC2FDV57Z6S6G7A</p>
            </div>

            <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-black uppercase tracking-widest border border-slate-700 transition-all flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              Manage Secrets
            </button>
          </div>
        </div>

        <div className="sleek-card p-6 bg-slate-900/40 border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white">Alert Preferences</h3>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
            <div>
              <p className="text-sm font-bold text-white">Push Notifications</p>
              <p className="text-[10px] text-slate-500">Alerts for rate swings & path shifts</p>
            </div>
            <button 
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full relative transition-colors ${notifications ? 'bg-indigo-600' : 'bg-slate-800'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifications ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>

        <div className="sleek-card p-6 bg-slate-900/40 border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <Wallet className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white">Wallet Connection</h3>
          </div>

          <div className="flex items-center gap-4">
             <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <Cpu className="w-6 h-6 text-indigo-500" />
             </div>
             <div className="flex-1">
                <p className="text-xs font-bold text-white">Freighter Wallet</p>
                <p className="text-[10px] text-emerald-500 font-bold uppercase">Extension Detected</p>
             </div>
             <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-extrabold uppercase">Reconnect</button>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-slate-500 font-bold uppercase tracking-widest">
           <Database className="w-4 h-4" />
           Storage usage: 2.4 MB / 10 MB
        </div>
        <button className="text-[10px] font-black uppercase text-rose-500 hover:text-rose-400 transition-colors">Wipe Local Ledger Cache</button>
      </div>
    </div>
  );
}
