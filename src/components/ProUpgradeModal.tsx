import React from 'react';
import { X, Sparkles, Check, Bell, Download, Webhook, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClick } from '../utils/audio';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPro: boolean;
  onActivatePro: () => void;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({
  isOpen,
  onClose,
  isPro,
  onActivatePro,
}) => {
  if (!isOpen) return null;

  const handleUnlock = () => {
    playClick();
    onActivatePro();
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00F0FF', '#F59E0B', '#10B981'],
      });
    } catch (e) {}
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-puls-900 border border-puls-700 rounded-2xl shadow-2xl overflow-hidden p-6 text-white font-sans">
        
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-glow/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-puls-400 hover:text-white hover:bg-puls-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-glow shadow-amber-glow">
            <Sparkles className="w-5 h-5 text-amber-xrp" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold tracking-wide font-mono">
              Puls Pro Operator
            </h3>
            <p className="text-xs text-puls-400">
              Institutional-grade telemetry tools & automated whale webhooks
            </p>
          </div>
        </div>

        {/* Features list */}
        <div className="space-y-3 my-5 text-xs text-puls-300">
          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-puls-950/60 border border-puls-800">
            <Bell className="w-4 h-4 text-cyan-glow shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Custom Whale Sound Thresholds</span>
              <span>Configure audible synthesizers to trigger at custom levels (1k, 10k, 100k XRP).</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-puls-950/60 border border-puls-800">
            <Download className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Telemetry Data Export</span>
              <span>Download continuous ledger cadence, TPS, and DEX load reports in CSV / JSON.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-puls-950/60 border border-puls-800">
            <Webhook className="w-4 h-4 text-amber-glow shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Discord & Slack Webhooks</span>
              <span>Dispatch real-time whale radar alerts directly to your trading room or channel.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-puls-950/60 border border-puls-800">
            <Zap className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Deep Buffer History</span>
              <span>Expand in-memory ledger and transaction telemetry buffer up to 1,000 blocks.</span>
            </div>
          </div>
        </div>

        {/* Pricing Box */}
        <div className="p-4 rounded-xl bg-puls-950 border border-puls-800 flex items-center justify-between mb-5">
          <div>
            <div className="text-xs text-puls-400 font-mono">Single Lifetime License</div>
            <div className="text-xl font-mono font-extrabold text-white">
              15 XRP <span className="text-xs font-normal text-puls-500">or 99 SEK</span>
            </div>
          </div>
          <div className="text-right text-[11px] text-emerald-400 font-mono">
            Zero ads • Zero recurring lock-in
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleUnlock}
            className="btn-tactile flex-1 py-2.5 px-4 rounded-xl bg-cyan-glow hover:bg-cyan-300 text-puls-950 font-extrabold text-xs font-mono shadow-cyan-glow transition-all flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{isPro ? 'Keep Pro Enabled' : 'Unlock Pro Operator (1-Click)'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
