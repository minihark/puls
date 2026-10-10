import React from 'react';
import { Coins, ArrowUpRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { AmmPoolItem } from '../types';

interface DexAmmPanelProps {
  pools: AmmPoolItem[];
  totalXrpLocked: number;
  xrpPriceUsd: number;
  txDistribution: Record<string, number>;
  totalSampled: number;
  onRefresh: () => void;
  isLoading: boolean;
}

export const DexAmmPanel: React.FC<DexAmmPanelProps> = ({
  pools,
  totalXrpLocked,
  xrpPriceUsd,
  txDistribution,
  totalSampled,
  onRefresh,
  isLoading,
}) => {
  const tvlUsd = totalXrpLocked * 2 * xrpPriceUsd;

  // Calculate percentages for top transaction types
  const types = Object.entries(txDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const getPercent = (count: number) => {
    if (!totalSampled) return 0;
    return Math.round((count / totalSampled) * 100);
  };

  return (
    <div className="telemetry-card rounded-xl p-5">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-puls-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-puls-900 border border-puls-700 flex items-center justify-center text-cyan-glow">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm font-mono text-white tracking-wide uppercase">
              Native DEX & AMM Intelligence (XLS-30D)
            </h3>
            <p className="text-xs text-puls-400 font-sans">
              On-chain Automated Market Makers & Central Limit Order Book Liquidity
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="btn-tactile inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-puls-900 border border-puls-800 text-xs font-mono text-puls-300 hover:text-white"
            title="Refresh AMM pool list"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-cyan-glow' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Top TVL Highlights & Live Activity Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
        
        {/* Total AMM TVL */}
        <div className="bg-puls-900/80 p-3.5 rounded-lg border border-puls-800">
          <div className="text-xs text-puls-400 font-mono mb-1">Total Value Locked (TVL)</div>
          <div className="text-2xl font-extrabold font-mono text-white tracking-tight text-cyan-glow">
            ${(tvlUsd / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-puls-400 font-mono mt-0.5">
            Locked XRP: <span className="text-puls-200 font-semibold">{totalXrpLocked.toLocaleString(undefined, { maximumFractionDigits: 0 })} XRP</span>
          </div>
        </div>

        {/* Active AMM Pools Count */}
        <div className="bg-puls-900/80 p-3.5 rounded-lg border border-puls-800">
          <div className="text-xs text-puls-400 font-mono mb-1">Active AMM Liquidity Pools</div>
          <div className="text-2xl font-extrabold font-mono text-white tracking-tight">
            1,000+
          </div>
          <div className="text-[11px] text-puls-400 font-mono mt-0.5">
            Protocol: <span className="text-emerald-400 font-semibold">Native XRPL Automated Market Maker</span>
          </div>
        </div>

        {/* Live Network Transaction Mix */}
        <div className="bg-puls-900/80 p-3.5 rounded-lg border border-puls-800">
          <div className="text-xs text-puls-400 font-mono mb-1 flex items-center justify-between">
            <span>Live Transaction Mix</span>
            <span className="text-puls-500 font-mono text-[10px]">{totalSampled} sampled</span>
          </div>
          
          {/* Visual progress bar */}
          <div className="h-2.5 w-full bg-puls-950 rounded-full overflow-hidden flex my-2 border border-puls-800">
            {types.map(([type, count], idx) => {
              const p = getPercent(count);
              const colors = [
                'bg-cyan-glow',
                'bg-emerald-400',
                'bg-amber-xrp',
                'bg-purple-400',
                'bg-pink-400',
              ];
              return (
                <div
                  key={type}
                  style={{ width: `${Math.max(p, 4)}%` }}
                  className={`${colors[idx % colors.length]} transition-all duration-500`}
                  title={`${type}: ${p}%`}
                />
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2 text-[10px] font-mono text-puls-400">
            {types.slice(0, 3).map(([type, count]) => (
              <span key={type} className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-puls-500" />
                <span>{type}:</span>
                <span className="text-puls-200 font-bold">{getPercent(count)}%</span>
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Top AMM Pools Table */}
      <div className="mt-4 min-w-0 max-w-full">
        <div className="text-xs font-mono font-semibold text-puls-300 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Top AMM Liquidity Pools by XRP Reserves</span>
          <span className="text-[11px] text-puls-500 font-normal hidden sm:inline">Deepest On-Chain Liquidity</span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-puls-800 max-w-full">
          <table className="w-full min-w-[620px] text-left text-xs font-mono">
            <thead className="bg-puls-900/90 text-puls-400 uppercase text-[10px] tracking-wider border-b border-puls-800">
              <tr>
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Trading Pair</th>
                <th className="py-2.5 px-3">Asset 2 Issuer</th>
                <th className="py-2.5 px-3 text-right">XRP Reserve</th>
                <th className="py-2.5 px-3 text-right">Estimated TVL</th>
                <th className="py-2.5 px-3 text-right">Fee</th>
                <th className="py-2.5 px-3 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-puls-850 bg-puls-950/40">
              {pools.map((p, idx) => {
                const pairName = p.asset2Name?.name || (p.asset2Currency.length === 40 ? 'Custom Token' : p.asset2Currency);
                const poolTvlUsd = p.xrpBalance * 2 * xrpPriceUsd;
                const isRlusd = p.asset2Name?.name === 'RLUSD' || p.asset2Currency.startsWith('524C555344');

                return (
                  <tr
                    key={p.account}
                    className={`hover:bg-puls-900/60 transition-colors ${
                      isRlusd ? 'bg-cyan-500/5' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 text-puls-500 font-bold">#{idx + 1}</td>
                    
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <span>XRP / {pairName}</span>
                        {p.asset2Name?.verified && (
                          <span title="Verified Token">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-glow" />
                          </span>
                        )}
                        {isRlusd && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-glow border border-cyan-500/30 uppercase">
                            Official RLUSD
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-puls-400">
                      {p.asset2Name?.domain ? (
                        <span className="text-puls-300 font-sans">{p.asset2Name.domain}</span>
                      ) : (
                        <span className="text-puls-500 truncate max-w-[120px] inline-block" title={p.account}>
                          {p.account.slice(0, 8)}...
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 px-3 text-right font-bold text-white">
                      {p.xrpBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })} XRP
                    </td>

                    <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">
                      ${poolTvlUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>

                    <td className="py-2.5 px-3 text-right text-puls-400">
                      {(p.tradingFeeBps / 1000).toFixed(2)}%
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <a
                        href={`https://xrpscan.com/account/${p.account}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-cyan-glow hover:text-white transition-colors"
                        title="View AMM Pool on XRPSCAN"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
