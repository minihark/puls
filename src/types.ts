export interface LedgerData {
  ledgerIndex: number;
  txCount: number;
  closeTimeHuman: string;
  closeTimeUnix: number;
  feeBase: number;
  reserveBase: number; // in drops (1,000,000 = 1 XRP)
  reserveInc: number; // in drops
  destroyedCoins: number; // drops burned
  totalCoins: number; // total drops in existence
}

export interface MarketData {
  priceUsd: number;
  priceChangePercent24h: number;
  high24h: number;
  low24h: number;
  volume24hXrp: number;
  volume24hUsd: number;
  priceEur: number;
  priceSek: number;
  updatedAt: string;
}

export interface AmmPoolItem {
  account: string;
  asset1Currency: string;
  asset2Currency: string;
  asset2Name?: {
    name?: string;
    desc?: string;
    domain?: string;
    twitter?: string;
    verified?: boolean;
  } | null;
  xrpBalance: number; // in XRP
  tradingFeeBps: number; // in 1/100,000ths or bps
  updatedAt: string;
}

export interface RlusdMetrics {
  supply: number;
  trustlines: number;
  holders: number;
  volume24h: number;
  exchanges24h: number;
  ammsCount: number;
  marketcap: number;
  issuerDomain: string;
}

export interface LiveTransaction {
  id: string;
  hash: string;
  type: string;
  account: string;
  destination?: string;
  amountXrp?: number;
  amountToken?: string;
  tokenCurrency?: string;
  feeDrops: number;
  ledgerIndex: number;
  timestamp: string;
  isWhale: boolean;
}

export interface AmendmentItem {
  amendmentId: string;
  name: string;
  enabled: boolean;
  enabledOn?: string | null;
  introduced?: string;
  supported: boolean;
}

export interface TelemetryStats {
  currentTps: number;
  averageTps: number;
  txDistribution: Record<string, number>;
  totalSampled: number;
  whaleCount24h: number;
  cumulativeBurnDrops: number;
}
