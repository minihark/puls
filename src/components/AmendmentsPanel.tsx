import React from 'react';
import { Cpu, CheckCircle, ArrowUpRight } from 'lucide-react';
import { AmendmentItem } from '../types';

interface AmendmentsPanelProps {
  amendments: AmendmentItem[];
}

export const AmendmentsPanel: React.FC<AmendmentsPanelProps> = ({ amendments }) => {
  // Highlight landmark amendments
  const landmarkNames = [
    'BatchV1_1',
    'PermissionDelegationV1_1',
    'fixAMMv1_1',
    'AMM',
    'MPT',
    'Clawback',
    'Checks',
    'Escrow',
  ];

  const highlighted = amendments.filter((a) =>
    landmarkNames.some((l) => a.name.toLowerCase().includes(l.toLowerCase()))
  );

  return (
    <div className="telemetry-card rounded-xl p-5">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-puls-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-puls-900 border border-puls-700 flex items-center justify-center text-cyan-glow">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm font-mono text-white tracking-wide uppercase">
                Protocol Amendments & Consensus Upgrades
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                {amendments.length > 0 ? `${amendments.filter((a) => a.enabled).length} Enabled` : '50+ Enabled'}
              </span>
            </div>
            <p className="text-xs text-puls-400 font-sans">
              Decentralized validator supermajority votes (80% quorum required over 2 weeks)
            </p>
          </div>
        </div>

        <a
          href="https://xrpscan.com/amendments"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-mono text-cyan-glow hover:text-white transition-colors"
        >
          <span>All Amendments</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Grid of Highlighted Amendments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-4">
        {highlighted.map((a) => {
          const isLatest =
            a.name.toLowerCase().includes('batch') ||
            a.name.toLowerCase().includes('permissiondelegation');

          return (
            <div
              key={a.amendmentId}
              className={`p-3 rounded-lg border font-mono text-xs flex flex-col justify-between ${
                isLatest
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-white'
                  : 'bg-puls-900/80 border-puls-800 text-puls-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold text-white text-xs truncate" title={a.name}>
                    {a.name}
                  </span>
                  {a.enabled ? (
                    <span className="flex items-center gap-0.5 text-[10px] text-emerald-400 font-bold shrink-0">
                      <CheckCircle className="w-3 h-3" /> Live
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400 shrink-0">Voting</span>
                  )}
                </div>

                {isLatest && (
                  <span className="inline-block text-[9px] px-1.5 py-0.2 rounded bg-cyan-glow text-puls-950 font-bold uppercase mb-1">
                    Recently Activated (Oct 2026)
                  </span>
                )}
              </div>

              <div className="text-[10px] text-puls-400 pt-2 border-t border-puls-800/60 mt-2 flex justify-between">
                <span>Introduced: {a.introduced || 'rippled'}</span>
                {a.enabledOn && (
                  <span>{new Date(a.enabledOn).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
