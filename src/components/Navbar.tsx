import React from 'react';
import { Activity, Volume2, VolumeX, Sparkles, Radio } from 'lucide-react';
import { playClick } from '../utils/audio';

interface NavbarProps {
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  isMuted: boolean;
  onToggleMute: () => void;
  currency: 'USD' | 'EUR' | 'SEK';
  onSelectCurrency: (c: 'USD' | 'EUR' | 'SEK') => void;
  onOpenProModal: () => void;
  isPro: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  connectionStatus,
  isMuted,
  onToggleMute,
  currency,
  onSelectCurrency,
  onOpenProModal,
  isPro,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-puls-950/90 backdrop-blur-md border-b border-puls-800 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Brand Stamp */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-puls-900 border border-puls-700 shadow-cyan-glow">
            <Activity className="w-5 h-5 text-cyan-glow animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-glow animate-ping-slow pointer-events-none" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-wider text-white font-mono uppercase">
                Puls
              </span>
              <span className="text-[10px] font-mono tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-glow border border-cyan-500/20 font-semibold">
                XRPL TELEMETRY
              </span>
            </div>
            <p className="text-[11px] text-puls-400 font-sans hidden sm:block">
              Consensus Heartbeat, Native DEX/AMM Volume & RLUSD Adoption
            </p>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* WebSocket Status Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-puls-900 border border-puls-800 text-xs">
            <Radio
              className={`w-3.5 h-3.5 ${
                connectionStatus === 'connected'
                  ? 'text-emerald-400 animate-pulse'
                  : connectionStatus === 'connecting'
                  ? 'text-amber-400 animate-spin'
                  : 'text-red-400'
              }`}
            />
            <span className="text-puls-300 font-mono text-[11px] hidden xs:inline">
              {connectionStatus === 'connected'
                ? 'MAINNET LIVE'
                : connectionStatus === 'connecting'
                ? 'CONNECTING...'
                : 'OFFLINE'}
            </span>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center rounded bg-puls-900 border border-puls-800 p-0.5 text-xs font-mono">
            {(['USD', 'EUR', 'SEK'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  playClick();
                  onSelectCurrency(c);
                }}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                  currency === c
                    ? 'bg-puls-800 text-cyan-glow font-bold shadow-sm'
                    : 'text-puls-400 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Audio Mute/Unmute Button */}
          <button
            type="button"
            onClick={onToggleMute}
            className={`btn-tactile p-1.5 rounded border transition-colors ${
              isMuted
                ? 'bg-puls-900 border-puls-800 text-puls-500 hover:text-puls-300'
                : 'bg-puls-850 border-puls-700 text-cyan-glow hover:bg-puls-800'
            }`}
            title={isMuted ? 'Unmute consensus heartbeat sound' : 'Mute heartbeat audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Pro Badge / Upgrade */}
          <button
            type="button"
            onClick={onOpenProModal}
            className={`btn-tactile inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              isPro
                ? 'bg-amber-xrp/20 border border-amber-xrp/40 text-amber-glow shadow-amber-glow'
                : 'bg-puls-900 hover:bg-puls-850 border border-puls-700 text-puls-200 hover:border-cyan-dim'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-xrp" />
            <span>{isPro ? 'Pro Active' : 'Pro'}</span>
          </button>

        </div>

      </div>
    </header>
  );
};
