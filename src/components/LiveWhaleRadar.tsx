import React, { useState } from 'react';
import { Radar, ArrowUpRight, Filter, AlertTriangle } from 'lucide-react';
import { LiveTransaction } from '../types';

interface LiveWhaleRadarProps {
  transactions: LiveTransaction[];
  whaleCount: number;
}

export const LiveWhaleRadar: React.FC<LiveWhaleRadarProps> = ({
  transactions,
  whaleCount,
}) => {
  const [filter, setFilter] = useState<'all' | 'whales' | 'batches' | 'dex'>('all');

  const filtered = transactions.filter((tx) => {
    if (filter === 'whales') return tx.isWhale;
    if (filter === 'batches') return tx.type === 'Batch';
    if (filter === 'dex') return tx.type === 'OfferCreate' || tx.type.startsWith('AMM');
    return true;
  });

  const getTypeBadge = (type: string, isWhale: boolean) => {
    if (isWhale) {
      return (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-glow border border-amber-500/30 flex items-center gap-1 shadow-amber-glow">
          <AlertTriangle className="w-2.5 h-2.5 text-amber-xrp" />
          WHALE ({type})
        </span>
      );
    }
    if (type === 'Batch') {
      return (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-glow border border-cyan-500/30">
          XLS-56 BATCH
        </span>
      );
    }
    if (type === 'OfferCreate') {
      return (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-500/15 text-purple-300 border border-purple-500/25">
          DEX OFFER
        </span>
      );
    }
    if (type === 'Payment') {
      return (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
          PAYMENT
        </span>
      );
    }
    return (
      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-puls-800 text-puls-300 border border-puls-700">
        {type}
      </span>
    );
  };

  return (
    <div className="telemetry-card rounded-xl p-5">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-puls-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-puls-900 border border-puls-700 flex items-center justify-center text-amber-xrp">
            <Radar className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm font-mono text-white tracking-wide uppercase">
                Live Transaction & Whale Radar
              </h3>
              {whaleCount > 0 && (
                <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-glow border border-amber-500/20 text-[10px] font-mono font-bold">
                  {whaleCount} Whales Logged
                </span>
              )}
            </div>
            <p className="text-xs text-puls-400 font-sans">
              Real-time stream directly from consensus validation nodes
            </p>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 rounded bg-puls-900 border border-puls-800 p-0.5 text-xs font-mono">
          <Filter className="w-3 h-3 text-puls-500 ml-1.5 mr-0.5" />
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
              filter === 'all' ? 'bg-puls-800 text-white font-bold' : 'text-puls-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter('whales')}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
              filter === 'whales' ? 'bg-amber-xrp/20 text-amber-glow font-bold' : 'text-puls-400 hover:text-amber-glow'
            }`}
          >
            Whales (&gt;5k)
          </button>
          <button
            type="button"
            onClick={() => setFilter('batches')}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
              filter === 'batches' ? 'bg-cyan-500/20 text-cyan-glow font-bold' : 'text-puls-400 hover:text-cyan-glow'
            }`}
          >
            Batches
          </button>
          <button
            type="button"
            onClick={() => setFilter('dex')}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
              filter === 'dex' ? 'bg-purple-500/20 text-purple-300 font-bold' : 'text-puls-400 hover:text-purple-300'
            }`}
          >
            DEX Orders
          </button>
        </div>
      </div>

      {/* Transaction Stream List */}
      <div className="mt-3 overflow-y-auto max-h-[380px] divide-y divide-puls-850 rounded-lg border border-puls-800/80 bg-puls-950/40 font-mono text-xs">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-puls-500">
            Listening for transactions on XRPL Mainnet stream...
          </div>
        ) : (
          filtered.map((tx) => (
            <div
              key={tx.id}
              className={`p-3 flex items-center justify-between gap-3 hover:bg-puls-900/60 transition-colors ${
                tx.isWhale ? 'bg-amber-500/5 border-l-2 border-l-amber-xrp' : ''
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="shrink-0">{getTypeBadge(tx.type, tx.isWhale)}</div>
                
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-puls-300 font-semibold truncate max-w-[130px] sm:max-w-[200px]" title={tx.account}>
                      {tx.account}
                    </span>
                    {tx.destination && (
                      <>
                        <span className="text-puls-600">→</span>
                        <span className="text-puls-400 truncate max-w-[130px] sm:max-w-[200px]" title={tx.destination}>
                          {tx.destination}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-[10px] text-puls-500 flex items-center gap-2 mt-0.5">
                    <span>Block #{tx.ledgerIndex.toLocaleString()}</span>
                    <span>•</span>
                    <span>Fee: {tx.feeDrops} drops</span>
                    <span>•</span>
                    <span>{tx.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Amount & Link */}
              <div className="flex items-center gap-3 shrink-0 text-right">
                {tx.amountXrp !== undefined && (
                  <div>
                    <div className={`font-bold ${tx.isWhale ? 'text-amber-glow text-sm font-extrabold' : 'text-white'}`}>
                      {tx.amountXrp.toLocaleString(undefined, { maximumFractionDigits: 2 })} XRP
                    </div>
                  </div>
                )}

                {tx.amountToken && (
                  <div>
                    <div className="font-bold text-cyan-glow">
                      {parseFloat(tx.amountToken).toLocaleString(undefined, { maximumFractionDigits: 2 })} {tx.tokenCurrency}
                    </div>
                  </div>
                )}

                <a
                  href={`https://xrpscan.com/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded bg-puls-900 hover:bg-puls-800 text-puls-400 hover:text-white transition-colors border border-puls-800"
                  title="View on XRPSCAN"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
