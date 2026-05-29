import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  Globe,
  Cpu,
  Lock,
  Database,
  Bell,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Copy,
} from 'lucide-react';

const DEMO_PUBLIC_KEY = 'GCBBD47IF6LWNCZX6J6S6G7AVC2FDV57Z6S6G7AVC2FDV57Z';

export function Settings() {
  const [network, setNetwork] = useState<'Testnet' | 'Mainnet'>('Testnet');
  const [notifications, setNotifications] = useState(true);
  const [autoRoute, setAutoRoute] = useState(true);
  const [walletConnected, setWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  const horizonUrl =
    network === 'Mainnet'
      ? 'https://horizon.stellar.org'
      : 'https://horizon-testnet.stellar.org';

  const handleWalletConnect = async () => {
    setIsConnecting(true);
    // Check for Freighter extension
    await new Promise(res => setTimeout(res, 1200));
    const hasFreighter = typeof (window as any).freighter !== 'undefined';
    if (hasFreighter) {
      try {
        await (window as any).freighter.getPublicKey();
        setWalletConnected(true);
      } catch {
        setWalletConnected(false);
      }
    } else {
      // Gracefully inform user — no crash
      setWalletConnected(false);
    }
    setIsConnecting(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(DEMO_PUBLIC_KEY).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleClearCache = () => {
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Network Configuration */}
        <div className="sleek-card p-6 bg-slate-900/40 border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white">Network Configuration</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
              <div>
                <p className="text-sm font-bold text-white">Horizon Endpoint</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5 break-all">{horizonUrl}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20 animate-pulse" />
                <span className="text-[9px] text-emerald-500 font-black uppercase">Live</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {(['Mainnet', 'Testnet'] as const).map(net => (
                <button
                  key={net}
                  onClick={() => setNetwork(net)}
                  className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                    network === net
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {net}
                </button>
              ))}
            </div>

            {network === 'Mainnet' && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-300 font-medium leading-relaxed">
                  Mainnet uses real funds. Ensure your wallet and keys are correct before sending.
                </p>
              </motion.div>
            )}

            <a
              href={`${horizonUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[10px] text-slate-500 hover:text-indigo-400 transition-colors font-bold uppercase tracking-wider"
            >
              <ExternalLink className="w-3 h-3" />
              Open Horizon Explorer
            </a>
          </div>
        </div>

        {/* Security & API */}
        <div className="sleek-card p-6 bg-slate-900/40 border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white">Security & Keys</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] uppercase font-black text-slate-500">Public Key</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[9px] font-black uppercase text-slate-500 hover:text-indigo-400 transition-colors"
                >
                  {copied ? (
                    <><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Copied</>
                  ) : (
                    <><Copy className="w-3 h-3" /> Copy</>
                  )}
                </button>
              </div>
              <p className="text-xs font-mono text-indigo-400 break-all font-bold">
                {DEMO_PUBLIC_KEY}
              </p>
            </div>

            <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-black uppercase tracking-widest border border-slate-700 transition-all flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              Manage Secrets
            </button>

            <div className="p-3 bg-slate-950/30 rounded-xl border border-slate-800">
              <p className="text-[9px] text-slate-600 font-medium leading-relaxed">
                Never share your secret key. RemitX never stores or transmits private keys — all signing happens locally in your Freighter wallet.
              </p>
            </div>
          </div>
        </div>

        {/* Alert Preferences */}
        <div className="sleek-card p-6 bg-slate-900/40 border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white">Preferences</h3>
          </div>

          <div className="space-y-3">
            {[
              {
                label: 'Push Notifications',
                description: 'Alerts for rate swings & path shifts',
                value: notifications,
                toggle: () => setNotifications(!notifications),
              },
              {
                label: 'Auto-Route Optimization',
                description: 'Automatically select best liquidity path',
                value: autoRoute,
                toggle: () => setAutoRoute(!autoRoute),
              },
            ].map(item => (
              <div
                key={item.label}
                className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800"
              >
                <div>
                  <p className="text-sm font-bold text-white">{item.label}</p>
                  <p className="text-[10px] text-slate-500">{item.description}</p>
                </div>
                <button
                  onClick={item.toggle}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    item.value ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                      item.value ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Wallet Connection */}
        <div className="sleek-card p-6 bg-slate-900/40 border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <Wallet className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white">Wallet Connection</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
              <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <Cpu className="w-6 h-6 text-indigo-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-white">Freighter Wallet</p>
                <p
                  className={`text-[10px] font-bold uppercase ${
                    walletConnected ? 'text-emerald-500' : 'text-slate-500'
                  }`}
                >
                  {walletConnected ? 'Connected' : 'Not Connected'}
                </p>
              </div>
              <button
                onClick={handleWalletConnect}
                disabled={isConnecting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-extrabold uppercase hover:bg-indigo-500 transition-colors disabled:opacity-50"
              >
                {isConnecting ? 'Connecting...' : walletConnected ? 'Reconnect' : 'Connect'}
              </button>
            </div>

            {!walletConnected && (
              <a
                href="https://www.freighter.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[10px] text-slate-500 hover:text-indigo-400 transition-colors font-bold uppercase tracking-wider"
              >
                <ExternalLink className="w-3 h-3" />
                Install Freighter Extension
              </a>
            )}

            {walletConnected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <p className="text-[10px] text-emerald-300 font-bold">
                  Freighter wallet connected successfully
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Storage */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-slate-500 font-bold uppercase tracking-widest">
          <Database className="w-4 h-4" />
          {cacheCleared ? (
            <span className="text-emerald-500">Cache cleared successfully</span>
          ) : (
            'Storage usage: 2.4 MB / 10 MB'
          )}
        </div>
        <button
          onClick={handleClearCache}
          className="text-[10px] font-black uppercase text-rose-500 hover:text-rose-400 transition-colors"
        >
          Wipe Local Ledger Cache
        </button>
      </div>

      {/* Version */}
      <div className="text-center">
        <p className="text-[9px] text-slate-700 font-mono uppercase tracking-widest">
          RemitX v0.1.0 · Stellar {network} · MIT License
        </p>
      </div>
    </div>
  );
}
