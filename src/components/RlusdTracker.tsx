import React from 'react';
import { DollarSign, ShieldCheck, Users, BarChart3, ArrowUpRight } from 'lucide-react';
import { RlusdMetrics } from '../types';

interface RlusdTrackerProps {
  metrics: RlusdMetrics;
}

export const RlusdTracker: React.FC<RlusdTrackerProps> = ({ metrics }) => {
  return (
    <div className="telemetry-card rounded-xl p-5 border border-cyan-500/20 bg-gradient-to-b from-puls-900 to-puls-950">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-puls-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-glow shadow-cyan-glow">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm font-mono text-white tracking-wide uppercase">
                Ripple USD (RLUSD) Native Adoption
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-glow border border-cyan-500/30 font-semibold">
                <ShieldCheck className="w-3 h-3" /> OFFICIAL ISSUER
              </span>
            </div>
            <p className="text-xs text-puls-400 font-sans">
              Enterprise US Dollar Stablecoin Natively Issued on the XRP Ledger
            </p>
          </div>
        </div>

        <a
          href="https://ripple.com/solutions/stablecoin"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-mono text-cyan-glow hover:text-white transition-colors"
        >
          <span>ripple.com/solutions/stablecoin</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
        
        {/* Total Minted Supply */}
        <div className="bg-puls-900/90 p-3 rounded-lg border border-puls-800">
          <div className="text-[11px] text-puls-400 font-mono mb-1">Minted Supply on XRPL</div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-cyan-glow tracking-tight">
            ${(metrics.supply / 1000000000).toFixed(3)}B
          </div>
          <div className="text-[10px] text-puls-500 font-mono mt-0.5">
            {metrics.supply.toLocaleString()} RLUSD
          </div>
        </div>

        {/* Active Trustlines */}
        <div className="bg-puls-900/90 p-3 rounded-lg border border-puls-800">
          <div className="text-[11px] text-puls-400 font-mono mb-1 flex items-center gap-1">
            <Users className="w-3 h-3 text-emerald-400" />
            <span>Active Trustlines</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-white tracking-tight">
            {metrics.trustlines.toLocaleString()}
          </div>
          <div className="text-[10px] text-puls-500 font-mono mt-0.5">
            {metrics.holders.toLocaleString()} Unique Holders
          </div>
        </div>

        {/* 24h DEX Volume */}
        <div className="bg-puls-900/90 p-3 rounded-lg border border-puls-800">
          <div className="text-[11px] text-puls-400 font-mono mb-1 flex items-center gap-1">
            <BarChart3 className="w-3 h-3 text-amber-xrp" />
            <span>24h Native DEX Volume</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-white tracking-tight">
            ${(metrics.volume24h / 1000000).toFixed(2)}M
          </div>
          <div className="text-[10px] text-puls-500 font-mono mt-0.5">
            {metrics.exchanges24h.toLocaleString()} On-Chain Trades
          </div>
        </div>

        {/* AMM Pools */}
        <div className="bg-puls-900/90 p-3 rounded-lg border border-puls-800">
          <div className="text-[11px] text-puls-400 font-mono mb-1">RLUSD AMM Pools</div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-400 tracking-tight">
            {metrics.ammsCount} Pools
          </div>
          <div className="text-[10px] text-puls-500 font-mono mt-0.5">
            Deepest: XRP/RLUSD (1.78M XRP)
          </div>
        </div>

      </div>

      {/* Issuer & Reserve Invariant Verification Box */}
      <div className="bg-puls-950/60 rounded-lg p-3 border border-puls-850 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-puls-400">
        <div className="flex items-center gap-2">
          <span className="text-puls-500">Issuer Account:</span>
          <a
            href="https://xrpscan.com/account/rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De"
            target="_blank"
            rel="noopener noreferrer"
            className="text-puls-200 hover:text-cyan-glow font-bold flex items-center gap-1 transition-colors"
          >
            <span className="truncate max-w-[140px] sm:max-w-none">rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De</span>
            <ArrowUpRight className="w-3 h-3 shrink-0" />
          </a>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-semibold">1:1 USD Cash Equivalent Backing</span>
          <span className="text-puls-500 hidden sm:inline">•</span>
          <span className="text-puls-300 hidden sm:inline">NYDFS Regulated Trust</span>
        </div>
      </div>

    </div>
  );
};
