import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroPulse } from './components/HeroPulse';
import { RlusdTracker } from './components/RlusdTracker';
import { DexAmmPanel } from './components/DexAmmPanel';
import { LiveWhaleRadar } from './components/LiveWhaleRadar';
import { AmendmentsPanel } from './components/AmendmentsPanel';
import { ProUpgradeModal } from './components/ProUpgradeModal';
import { X, Landmark, Droplets, FileCode2, Layers } from 'lucide-react';

import {
  LedgerData,
  MarketData,
  AmmPoolItem,
  RlusdMetrics,
  LiveTransaction,
  AmendmentItem,
  TelemetryStats,
} from './types';
import {
  fetchMarketData,
  fetchTopAmmPools,
  fetchRlusdMetrics,
  fetchAmendments,
} from './utils/api';
import { XrplTelemetryStream } from './utils/xrplStream';
import { setAudioMuted, playClick } from './utils/audio';

type ActiveDrawer = 'rlusd' | 'amm' | 'amendments' | null;

export const App: React.FC = () => {
  // Telemetry stream & connection
  const [connectionStatus, setConnectionStatus] = useState<
    'connected' | 'connecting' | 'disconnected'
  >('connecting');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'SEK'>('USD');
  const [isPro, setIsPro] = useState<boolean>(() => {
    return localStorage.getItem('puls_pro') === 'true';
  });
  const [isProModalOpen, setIsProModalOpen] = useState<boolean>(false);
  const [activeDrawer, setActiveDrawer] = useState<ActiveDrawer>(null);

  // Live consensus state
  const [ledger, setLedger] = useState<LedgerData | null>(null);
  const [ledgerInterval, setLedgerInterval] = useState<number>(3.8);
  const [currentTps, setCurrentTps] = useState<number>(48.2);
  const [averageTps, setAverageTps] = useState<number>(42.0);
  const [isPulsing, setIsPulsing] = useState<boolean>(false);

  // Transaction radar stream
  const [transactions, setTransactions] = useState<LiveTransaction[]>([]);
  const [stats, setStats] = useState<TelemetryStats>({
    currentTps: 48.2,
    averageTps: 42.0,
    txDistribution: { Payment: 120, OfferCreate: 240, Batch: 18 },
    totalSampled: 378,
    whaleCount24h: 3,
    cumulativeBurnDrops: 3780,
  });

  // REST Data
  const [market, setMarket] = useState<MarketData>({
    priceUsd: 1.4035,
    priceChangePercent24h: 1.23,
    high24h: 1.413,
    low24h: 1.374,
    volume24hXrp: 66104696,
    volume24hUsd: 92191230,
    priceEur: 1.252,
    priceSek: 14.67,
    updatedAt: new Date().toISOString(),
  });

  const [ammPools, setAmmPools] = useState<AmmPoolItem[]>([]);
  const [totalXrpLocked, setTotalXrpLocked] = useState<number>(10071981);
  const [isAmmLoading, setIsAmmLoading] = useState<boolean>(false);

  const [rlusdMetrics, setRlusdMetrics] = useState<RlusdMetrics>({
    supply: 1226249976,
    trustlines: 102756,
    holders: 70422,
    volume24h: 3095248,
    exchanges24h: 15931,
    ammsCount: 320,
    marketcap: 874681655,
    issuerDomain: 'ripple.com/solutions/stablecoin',
  });

  const [amendments, setAmendments] = useState<AmendmentItem[]>([]);

  const streamRef = useRef<XrplTelemetryStream | null>(null);

  // Initialize XRPL WebSocket Telemetry stream
  useEffect(() => {
    const stream = new XrplTelemetryStream();
    streamRef.current = stream;

    stream.onConnectionChange = (status) => {
      setConnectionStatus(status);
    };

    stream.onLedgerUpdate = (data, intervalSec, tps) => {
      setLedger(data);
      setLedgerInterval(intervalSec);
      setCurrentTps(tps);
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 500);
    };

    stream.onTransaction = (tx) => {
      setTransactions((prev) => [tx, ...prev.slice(0, 49)]);
    };

    stream.onStatsUpdate = (s) => {
      setStats(s);
      setAverageTps(s.averageTps);
    };

    stream.connect();

    return () => {
      stream.disconnect();
    };
  }, []);

  // Poll market data every 15s
  useEffect(() => {
    let isMounted = true;
    const loadMarket = async () => {
      try {
        const m = await fetchMarketData();
        if (isMounted) setMarket(m);
      } catch (e) {}
    };

    loadMarket();
    const interval = setInterval(loadMarket, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Fetch AMM Pools, RLUSD metrics & Amendments
  const loadAmmAndAdoption = async () => {
    setIsAmmLoading(true);
    try {
      const [ammRes, rlusdRes, amendRes] = await Promise.all([
        fetchTopAmmPools(),
        fetchRlusdMetrics(),
        fetchAmendments(),
      ]);
      setAmmPools(ammRes.pools);
      if (ammRes.totalXrpLocked > 0) setTotalXrpLocked(ammRes.totalXrpLocked);
      setRlusdMetrics(rlusdRes);
      setAmendments(amendRes);
    } catch (e) {
    } finally {
      setIsAmmLoading(false);
    }
  };

  useEffect(() => {
    loadAmmAndAdoption();
  }, []);

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    setAudioMuted(next);
    if (!next) playClick();
  };

  const handleActivatePro = () => {
    setIsPro(true);
    localStorage.setItem('puls_pro', 'true');
  };

  return (
    <div className="min-h-screen flex flex-col bg-puls-950 text-puls-100 font-sans selection:bg-cyan-glow selection:text-puls-950 overflow-x-hidden">
      
      {/* 2px Cyan Accent Line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-cyan-glow via-cyan-dim to-amber-xrp" />

      {/* Top Navbar */}
      <Navbar
        connectionStatus={connectionStatus}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        currency={currency}
        onSelectCurrency={setCurrency}
        onOpenProModal={() => setIsProModalOpen(true)}
        isPro={isPro}
      />

      {/* Main Single-Screen Telemetry Console */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 space-y-4 min-w-0">
        
        {/* Primary Telemetry Cockpit (Hero Pulse Core + Live Whale Radar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* Left 7 Columns: Master Consensus Pulse */}
          <div className="lg:col-span-7">
            <HeroPulse
              ledger={ledger}
              ledgerInterval={ledgerInterval}
              currentTps={currentTps}
              averageTps={averageTps}
              market={market}
              currency={currency}
              isPulsing={isPulsing}
              cumulativeBurnDrops={stats.cumulativeBurnDrops}
            />
          </div>

          {/* Right 5 Columns: Live Whale & Transaction Radar */}
          <div className="lg:col-span-5">
            <LiveWhaleRadar
              transactions={transactions}
              whaleCount={stats.whaleCount24h}
            />
          </div>

        </div>

        {/* Secondary Telemetry Dock (Tactile Drawers) */}
        <div className="telemetry-card rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border border-puls-800">
          <div className="flex items-center gap-2 text-xs font-mono text-puls-400">
            <span className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse" />
            <span className="uppercase tracking-wider font-semibold">Institutional Telemetry Drawers:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* RLUSD Drawer Trigger */}
            <button
              type="button"
              onClick={() => {
                playClick();
                setActiveDrawer('rlusd');
              }}
              className="btn-tactile px-3 py-1.5 rounded-lg bg-puls-900 hover:bg-puls-850 border border-puls-700 text-puls-200 flex items-center gap-1.5 shadow-xs"
            >
              <Landmark className="w-3.5 h-3.5 text-cyan-glow" />
              <span>RLUSD (${(rlusdMetrics.supply / 1000000000).toFixed(2)}B)</span>
            </button>

            {/* AMM Drawer Trigger */}
            <button
              type="button"
              onClick={() => {
                playClick();
                setActiveDrawer('amm');
              }}
              className="btn-tactile px-3 py-1.5 rounded-lg bg-puls-900 hover:bg-puls-850 border border-puls-700 text-puls-200 flex items-center gap-1.5 shadow-xs"
            >
              <Droplets className="w-3.5 h-3.5 text-emerald-400" />
              <span>AMM Pools ({ammPools.length > 0 ? `${ammPools.length} Pools` : 'DEX'})</span>
            </button>

            {/* Amendments Drawer Trigger */}
            <button
              type="button"
              onClick={() => {
                playClick();
                setActiveDrawer('amendments');
              }}
              className="btn-tactile px-3 py-1.5 rounded-lg bg-puls-900 hover:bg-puls-850 border border-puls-700 text-puls-200 flex items-center gap-1.5 shadow-xs"
            >
              <FileCode2 className="w-3.5 h-3.5 text-amber-xrp" />
              <span>Amendments ({amendments.length})</span>
            </button>
          </div>
        </div>

      </main>

      {/* Drawer Overlay Modal */}
      {activeDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-5xl bg-puls-950 border border-puls-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Drawer Header */}
            <div className="p-4 bg-puls-900 border-b border-puls-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-glow" />
                <h3 className="font-mono font-bold text-sm text-white uppercase tracking-wider">
                  {activeDrawer === 'rlusd' && 'Institutional RLUSD Stablecoin Adoption'}
                  {activeDrawer === 'amm' && 'Native DEX & AMM Intelligence (XLS-30D)'}
                  {activeDrawer === 'amendments' && 'Protocol Amendments & Consensus Upgrades'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  playClick();
                  setActiveDrawer(null);
                }}
                className="p-1 rounded-lg text-puls-400 hover:text-white bg-puls-850 hover:bg-puls-800 border border-puls-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
              {activeDrawer === 'rlusd' && (
                <RlusdTracker metrics={rlusdMetrics} />
              )}
              {activeDrawer === 'amm' && (
                <DexAmmPanel
                  pools={ammPools}
                  totalXrpLocked={totalXrpLocked}
                  xrpPriceUsd={market.priceUsd}
                  txDistribution={stats.txDistribution}
                  totalSampled={stats.totalSampled}
                  onRefresh={loadAmmAndAdoption}
                  isLoading={isAmmLoading}
                />
              )}
              {activeDrawer === 'amendments' && (
                <AmendmentsPanel amendments={amendments} />
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-3 bg-puls-900 border-t border-puls-800 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveDrawer(null)}
                className="px-4 py-1.5 rounded-lg bg-puls-800 hover:bg-puls-700 text-white font-mono text-xs font-bold transition"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-puls-850 bg-puls-950/80 py-4 px-4 sm:px-6 text-xs text-puls-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Puls</span>
            <span>•</span>
            <span>Crafted by Harkco Software Studio</span>
            <span>•</span>
            <span className="text-cyan-glow">Zero Ads</span>
          </div>

          <div className="flex items-center gap-4 text-puls-400">
            <a
              href="https://knippa.apps.harkco.se"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-glow transition-colors"
            >
              Knippa (Atomic Batch Dispatcher)
            </a>
            <a
              href="https://fakt.apps.harkco.se"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-glow transition-colors"
            >
              Fakt (Invoice Studio)
            </a>
            <a
              href="https://apps.harkco.se"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Harkco Daily Apps
            </a>
          </div>
        </div>
      </footer>

      {/* Pro Modal */}
      <ProUpgradeModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        isPro={isPro}
        onActivatePro={handleActivatePro}
      />

    </div>
  );
};

export default App;
