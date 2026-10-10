import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroPulse } from './components/HeroPulse';
import { RlusdTracker } from './components/RlusdTracker';
import { DexAmmPanel } from './components/DexAmmPanel';
import { LiveWhaleRadar } from './components/LiveWhaleRadar';
import { AmendmentsPanel } from './components/AmendmentsPanel';
import { ProUpgradeModal } from './components/ProUpgradeModal';

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
import { setAudioMuted, getAudioMuted, playClick } from './utils/audio';

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

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 sm:py-6 space-y-6 min-w-0">
        
        {/* Consensus Heartbeat & Market Dynamics */}
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

        {/* Institutional RLUSD Stablecoin Adoption */}
        <RlusdTracker metrics={rlusdMetrics} />

        {/* Native DEX & AMM Intelligence */}
        <DexAmmPanel
          pools={ammPools}
          totalXrpLocked={totalXrpLocked}
          xrpPriceUsd={market.priceUsd}
          txDistribution={stats.txDistribution}
          totalSampled={stats.totalSampled}
          onRefresh={loadAmmAndAdoption}
          isLoading={isAmmLoading}
        />

        {/* Live Whale Radar & Transaction Stream */}
        <LiveWhaleRadar
          transactions={transactions}
          whaleCount={stats.whaleCount24h}
        />

        {/* Protocol Amendments & Consensus Upgrades */}
        <AmendmentsPanel amendments={amendments} />

      </main>

      {/* Footer */}
      <footer className="border-t border-puls-850 bg-puls-950/80 py-6 px-4 sm:px-6 text-xs text-puls-500 font-mono">
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
