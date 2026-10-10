import * as xrpl from 'xrpl';
import { LedgerData, LiveTransaction, TelemetryStats } from '../types';
import { playPulseBeat, playWhaleChime } from './audio';

const WS_ENDPOINTS = [
  'wss://xrplcluster.com',
  'wss://s1.ripple.com',
  'wss://s2.ripple.com'
];

export class XrplTelemetryStream {
  private client: xrpl.Client | null = null;
  private endpointIndex = 0;
  private isConnected = false;
  private reconnectTimeout: any = null;

  private lastLedgerTime = 0;
  private ledgerHistory: LedgerData[] = [];
  private recentTransactions: LiveTransaction[] = [];
  private typeCounts: Record<string, number> = {};
  private totalSampledCount = 0;
  private whaleCount = 0;
  private cumulativeBurn = 0;

  // Callbacks
  public onLedgerUpdate?: (data: LedgerData, intervalSec: number, currentTps: number) => void;
  public onTransaction?: (tx: LiveTransaction) => void;
  public onStatsUpdate?: (stats: TelemetryStats) => void;
  public onConnectionChange?: (status: 'connected' | 'connecting' | 'disconnected') => void;

  public async connect(): Promise<void> {
    if (this.client && this.isConnected) return;

    this.onConnectionChange?.('connecting');
    const endpoint = WS_ENDPOINTS[this.endpointIndex % WS_ENDPOINTS.length];

    try {
      this.client = new xrpl.Client(endpoint, {
        connectionTimeout: 10000,
      });

      this.client.on('connected', () => {
        this.isConnected = true;
        this.onConnectionChange?.('connected');
        this.subscribe();
      });

      this.client.on('disconnected', () => {
        this.isConnected = false;
        this.onConnectionChange?.('disconnected');
        this.scheduleReconnect();
      });

      this.client.on('error', (err) => {
        console.warn('[Puls] XRPL WebSocket error:', err);
      });

      await this.client.connect();
    } catch (err) {
      console.warn('[Puls] Connection failed, retrying next endpoint:', err);
      this.scheduleReconnect();
    }
  }

  private async subscribe() {
    if (!this.client || !this.isConnected) return;

    try {
      // Handle ledger closed events
      this.client.on('ledgerClosed', (l: any) => {
        this.handleLedgerClosed(l);
      });

      // Handle live transactions stream
      this.client.on('transaction', (txEvent: any) => {
        this.handleTransactionEvent(txEvent);
      });

      await this.client.request({
        command: 'subscribe',
        streams: ['ledger', 'transactions'],
      });
    } catch (err) {
      console.error('[Puls] Subscribe error:', err);
    }
  }

  private handleLedgerClosed(l: any) {
    const now = Date.now();
    let intervalSec = 3.8;
    if (this.lastLedgerTime > 0) {
      intervalSec = Math.max(1, (now - this.lastLedgerTime) / 1000);
    }
    this.lastLedgerTime = now;

    const txCount = l.txn_count || 0;
    const currentTps = Math.round((txCount / intervalSec) * 10) / 10;
    const feeBase = l.fee_base || 10;

    const ledger: LedgerData = {
      ledgerIndex: l.ledger_index,
      txCount,
      closeTimeHuman: new Date().toISOString(),
      closeTimeUnix: l.ledger_time || Math.floor(now / 1000),
      feeBase,
      reserveBase: l.reserve_base || 1000000,
      reserveInc: l.reserve_inc || 200000,
      destroyedCoins: 0,
      totalCoins: 99985590000000000,
    };

    this.ledgerHistory.unshift(ledger);
    if (this.ledgerHistory.length > 30) this.ledgerHistory.pop();

    // Play subtle tactile heartbeat tick
    playPulseBeat();

    this.onLedgerUpdate?.(ledger, Math.round(intervalSec * 10) / 10, currentTps);
    this.emitStats(currentTps);
  }

  private handleTransactionEvent(event: any) {
    const tx = event.tx_json;
    if (!tx) return;

    this.totalSampledCount++;
    const type = tx.TransactionType || 'Unknown';
    this.typeCounts[type] = (this.typeCounts[type] || 0) + 1;

    let amountXrp: number | undefined;
    let amountToken: string | undefined;
    let tokenCurrency: string | undefined;
    let isWhale = false;

    if (type === 'Payment') {
      if (typeof tx.Amount === 'string') {
        amountXrp = parseInt(tx.Amount, 10) / 1000000;
        if (amountXrp >= 5000) {
          isWhale = true;
          this.whaleCount++;
          playWhaleChime();
        }
      } else if (tx.Amount && typeof tx.Amount === 'object') {
        amountToken = tx.Amount.value;
        tokenCurrency = tx.Amount.currency === '524C555344000000000000000000000000000000'
          ? 'RLUSD'
          : (tx.Amount.currency?.length === 40 ? 'HEX-IOU' : tx.Amount.currency);
      }
    }

    const feeDrops = parseInt(tx.Fee || '10', 10);
    this.cumulativeBurn += feeDrops;

    const liveTx: LiveTransaction = {
      id: `${event.hash || Math.random()}-${Date.now()}`,
      hash: event.hash || '',
      type,
      account: tx.Account || '',
      destination: tx.Destination,
      amountXrp,
      amountToken,
      tokenCurrency,
      feeDrops,
      ledgerIndex: event.ledger_index || 0,
      timestamp: new Date().toLocaleTimeString(),
      isWhale,
    };

    this.recentTransactions.unshift(liveTx);
    if (this.recentTransactions.length > 50) this.recentTransactions.pop();

    this.onTransaction?.(liveTx);
  }

  private emitStats(currentTps: number) {
    let avgTps = currentTps;
    if (this.ledgerHistory.length > 1) {
      const totalTx = this.ledgerHistory.reduce((acc, curr) => acc + curr.txCount, 0);
      const totalInterval = (this.ledgerHistory.length - 1) * 3.8;
      avgTps = Math.round((totalTx / totalInterval) * 10) / 10;
    }

    this.onStatsUpdate?.({
      currentTps,
      averageTps: avgTps,
      txDistribution: { ...this.typeCounts },
      totalSampled: this.totalSampledCount,
      whaleCount24h: this.whaleCount,
      cumulativeBurnDrops: this.cumulativeBurn,
    });
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.endpointIndex++;
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, 3000);
  }

  public disconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    if (this.client) {
      this.client.disconnect().catch(() => {});
      this.client = null;
    }
    this.isConnected = false;
  }
}
