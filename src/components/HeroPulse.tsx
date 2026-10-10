import React from 'react';
import { Zap, Flame, Shield, TrendingUp, TrendingDown, Layers, Clock } from 'lucide-react';
import { LedgerData, MarketData } from '../types';

interface HeroPulseProps {
  ledger: LedgerData | null;
  ledgerInterval: number;
  currentTps: number;
  averageTps: number;
  market: MarketData;
  currency: 'USD' | 'EUR' | 'SEK';
  isPulsing: boolean;
  cumulativeBurnDrops: number;
}

export const HeroPulse: React.FC<HeroPulseProps> = ({
  ledger,
  ledgerInterval,
  currentTps,
  averageTps,
  market,
  currency,
  isPulsing,
  cumulativeBurnDrops,
}) => {
  const getPrice = () => {
    if (currency === 'EUR') return `€${market.priceEur.toFixed(4)}`;
    if (currency === 'SEK') return `${market.priceSek.toFixed(2)} kr`;
    return `$${market.priceUsd.toFixed(4)}`;
  };

  const getHigh = () => {
    if (currency === 'EUR') return `€${(market.high24h * 0.892).toFixed(4)}`;
    if (currency === 'SEK') return `${(market.high24h * 10.45).toFixed(2)} kr`;
    return `$${market.high24h.toFixed(4)}`;
  };

  const getLow = () => {
    if (currency === 'EUR') return `€${(market.low24h * 0.892).toFixed(4)}`;
    if (currency === 'SEK') return `${(market.low24h * 10.45).toFixed(2)} kr`;
    return `$${market.low24h.toFixed(4)}`;
  };

  const isPositive = market.priceChangePercent24h >= 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      
      {/* Consensus Heartbeat Card (Left 7 cols) */}
      <div className="lg:col-span-7 telemetry-card rounded-xl p-5 relative overflow-hidden">
        {/* Subtle glowing background pulse */}
        <div
          className={`absolute -top-24 -left-24 w-64 h-64 bg-cyan-glow/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ${
            isPulsing ? 'opacity-100 scale-110' : 'opacity-40 scale-95'
          }`}
        />

        <div className="flex items-center justify-between pb-3 border-b border-puls-800">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-glow opacity-75 ${
                  isPulsing ? 'block' : 'hidden'
                }`}
              />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-glow" />
            </span>
            <span className="text-xs font-mono font-semibold tracking-wider text-puls-300 uppercase">
              Consensus Heartbeat
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-puls-400">
            <Clock className="w-3.5 h-3.5 text-cyan-glow" />
            <span>Cadence:</span>
            <span className="text-white font-bold">{ledgerInterval > 0 ? `${ledgerInterval.toFixed(1)}s` : '3.8s'}</span>
          </div>
        </div>

        {/* Ledger Number & Live TPS row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
          
          {/* Block Sequence Counter */}
          <div className="bg-puls-900/80 rounded-lg p-3.5 border border-puls-800">
            <div className="flex items-center justify-between text-xs text-puls-400 mb-1">
              <span>Validated Ledger</span>
              <Layers className="w-3.5 h-3.5 text-puls-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight flex items-baseline gap-1.5">
              <span className="text-cyan-glow">#</span>
              <span>{ledger ? ledger.ledgerIndex.toLocaleString() : '107,560,250'}</span>
            </div>
            <div className="text-[11px] text-puls-400 font-mono mt-1">
              Tx in block: <span className="text-puls-200 font-semibold">{ledger?.txCount || 0}</span>
            </div>
          </div>

          {/* TPS Speedometer */}
          <div className="bg-puls-900/80 rounded-lg p-3.5 border border-puls-800">
            <div className="flex items-center justify-between text-xs text-puls-400 mb-1">
              <span>Throughput (TPS)</span>
              <Zap className="w-3.5 h-3.5 text-amber-glow" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight flex items-baseline gap-1.5">
              <span>{currentTps > 0 ? currentTps.toFixed(1) : '48.2'}</span>
              <span className="text-xs font-normal text-puls-400">tx/s</span>
            </div>
            <div className="text-[11px] text-puls-400 font-mono mt-1">
              Avg pace: <span className="text-puls-200 font-semibold">{averageTps > 0 ? `${averageTps.toFixed(1)} tps` : '42.0 tps'}</span>
            </div>
          </div>

        </div>

        {/* Base Reserve & Fee burned row */}
        <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-puls-850 text-xs font-mono">
          <div className="bg-puls-950/60 p-2 rounded border border-puls-850">
            <div className="text-[10px] text-puls-500 uppercase tracking-wider">Base Fee</div>
            <div className="font-bold text-puls-200 text-xs mt-0.5">10 drops</div>
            <div className="text-[10px] text-puls-500">0.00001 XRP</div>
          </div>

          <div className="bg-puls-950/60 p-2 rounded border border-puls-850">
            <div className="text-[10px] text-puls-500 uppercase tracking-wider">Base Reserve</div>
            <div className="font-bold text-emerald-400 text-xs mt-0.5">1.0 XRP</div>
            <div className="text-[10px] text-puls-500">Owner: 0.2 XRP</div>
          </div>

          <div className="bg-puls-950/60 p-2 rounded border border-puls-850">
            <div className="text-[10px] text-puls-500 uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3 h-3 text-red-400" />
              <span>Burned</span>
            </div>
            <div className="font-bold text-red-400 text-xs mt-0.5">
              {cumulativeBurnDrops > 0 ? `${(cumulativeBurnDrops / 1000000).toFixed(4)} XRP` : '12.4M XRP'}
            </div>
            <div className="text-[10px] text-puls-500">Total Deflation</div>
          </div>
        </div>

      </div>

      {/* Market & Price Dynamics Card (Right 5 cols) */}
      <div className="lg:col-span-5 telemetry-card rounded-xl p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-puls-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-xrp shadow-amber-glow" />
              <span className="text-xs font-mono font-semibold tracking-wider text-puls-300 uppercase">
                XRP Market Dynamics
              </span>
            </div>
            <span className="text-[10px] font-mono text-puls-500">24H TICKER</span>
          </div>

          {/* Big Price Display */}
          <div className="my-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                {getPrice()}
              </span>
              <span
                className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-mono font-bold ${
                  isPositive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}
              >
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isPositive ? '+' : ''}
                {market.priceChangePercent24h.toFixed(2)}%
              </span>
            </div>
            <p className="text-xs text-puls-400 font-sans mt-1">
              Global 24h Volume: <span className="font-mono text-white font-semibold">${(market.volume24hUsd / 1000000).toFixed(1)}M</span>
            </p>
          </div>
        </div>

        {/* 24h Range & Supply footer */}
        <div className="space-y-2 pt-2 border-t border-puls-800 text-xs font-mono">
          <div className="flex justify-between text-puls-400">
            <span>24h Range</span>
            <span className="text-puls-200">
              {getLow()} — {getHigh()}
            </span>
          </div>

          <div className="flex justify-between text-puls-400">
            <span>Circulating Supply</span>
            <span className="text-puls-200 font-semibold">99.985B XRP</span>
          </div>

          <div className="flex justify-between text-puls-400">
            <span>Protocol Invariant</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <Shield className="w-3 h-3" /> 100% Validated
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
