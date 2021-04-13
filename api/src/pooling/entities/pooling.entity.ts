import { HttpService } from '@nestjs/common';
import { EventEmitter } from 'events';
import { POOL_RESULT } from '../../../../domain/constants';
import { Pooling as Base } from '../../../../domain/pooling.entity';

// const marketstackAccessKey = '370eb798817c3efc2f0234f6bfb734a1';
let ids = 0;

// @see https://marketstack.com/documentation#intraday_data
interface SymbolTrade {
  date: string;
  symbol: string;

  open: number;
  high: number;
  low: number;
  close: number;
  last: number;
  volume: number;
}

// @todo there's too much properties. Divide in PoolingConfig and PoolingRunner
// @todo add TypeORM
export class Pooling extends EventEmitter implements Base {
  constructor(pullURL: string) {
    super();

    this.id = ids;
    ids++; // @todo change for a db generated id

    // this.pullURL = `http://api.marketstack.com/v1/intraday?access_key=${marketstackAccessKey}&symbols=${symbol.toUpperCase()}&limit=1`;
    this.pullURL = pullURL;
    this.stockVariationThreshold = 3; // default to 3%
    this.highFrequencyPoolingInterval = 2 * 1000; // default to 2 seconds
    this.lowFrequencyPoolingInterval = 15 * 1000; // default to 15 seconds

    this.isPoolingActive = false;
  }

  id: number;

  userId: number;

  pullURL: string;

  highFrequencyPoolingInterval: number;

  lowFrequencyPoolingInterval: number;

  stockVariationThreshold: number;

  isPoolingActive: boolean;

  lastPoolingStartedAt: Date;

  lastPoolingResult: number;

  createdAt: Date;

  updatedAt: Date;

  private httpClient: HttpService;

  private poolingTimeout;

  start(httpClient) {
    if (this.isPoolingActive) return;

    this.isPoolingActive = true;
    this.httpClient = httpClient;

    console.debug(`pooling (${this.id}) start for url (${this.pullURL})`);

    this.fetchNext();
  }

  stop() {
    this.isPoolingActive = false;
    clearTimeout(this.poolingTimeout);

    return true;
  }

  private async fetchNext() {
    this.lastPoolingStartedAt = new Date();

    const currentResult = await this.fetchAndEmitResult();

    if (!this.isPoolingActive) return this.stop();

    clearTimeout(this.poolingTimeout); // probably this isn't necessary. But just to be sure

    const nextPoolingAt = this.calculateNextPoolingTime(currentResult);

    this.poolingTimeout = setTimeout(this.fetchNext.bind(this), nextPoolingAt); // call fetchNext again after some amount of time

    this.lastPoolingResult = currentResult;
  }

  async fetchAndEmitResult(): Promise<number | undefined> {
    const trade = await this.fetchCurrentTrading();

    if (this.isPoolingActive && trade) {
      this.emit(POOL_RESULT, this.emitValue(trade));
    }

    return trade.last;
  }

  private emitValue(currentTrade) {
    return {
      ...currentTrade,
      date: this.lastPoolingStartedAt,
      variation: this.calculateStockVariation(currentTrade.last),
    };
  }

  async fetchCurrentTrading(): Promise<Partial<SymbolTrade>> {
    // return Math.random() * 100;
    try {
      const response = (await this.httpClient.get(this.pullURL).toPromise())
        .data;

      const stockResult: SymbolTrade = response.data;

      const { symbol, open, close } = stockResult[0];
      const last = stockResult[0].last ?? close ?? open; // closed market have last = null. So we fallback

      return { symbol, open, last, close };
    } catch (error) {
      console.error('error in fetchCurrentTradingValue', error);

      return undefined;
    }
  }

  calculateNextPoolingTime(currentResult: number) {
    const variation = this.calculateStockVariation(currentResult); // percentage

    const poolingInterval =
      variation > this.stockVariationThreshold
        ? this.highFrequencyPoolingInterval
        : this.lowFrequencyPoolingInterval;

    const timeSinceLastPooling =
      Date.now() - this.lastPoolingStartedAt.valueOf();

    return Math.max(0, poolingInterval - timeSinceLastPooling);
  }

  calculateStockVariation(currentResult: number) {
    const previousResult = this.lastPoolingResult;
    return (Math.abs(previousResult - currentResult) / previousResult) * 100;
  }
}
