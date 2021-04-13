import { HttpService } from '@nestjs/common';
import { EventEmitter } from 'events';
import { POOL_RESULT } from '../../../../domain/constants';
import { Pooling as Base } from '../../../../domain/pooling.entity';

const marketstackAccessKey = '3b82d85f4173b772bd82251c113b40bc';
let ids = 0;

// @todo there's too much properties. Divide in PoolingConfig and PoolingRunner
// @todo add TypeORM
export class Pooling extends EventEmitter implements Base {
  constructor(symbol: string) {
    super();

    this.id = ids;
    ids++; // @todo change for a db generated id

    this.pullURL = `http://api.marketstack.com/v1/intraday?access_key=${marketstackAccessKey}&symbols=${symbol.toUpperCase()}&limit=1`;
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

    console.info(`pooling (${this.id}) start for url (${this.pullURL})`);

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

    console.debug(
      'fetchNext',
      this.lastPoolingStartedAt,
      nextPoolingAt,
      currentResult,
    );

    this.poolingTimeout = setTimeout(this.fetchNext.bind(this), nextPoolingAt); // call fetchNext again after some amount of time

    this.lastPoolingResult = currentResult;
  }

  async fetchAndEmitResult(): Promise<number> {
    const value = await this.fetch();
    this.emit(POOL_RESULT, value); // emit result for whoever is listening to this pooling

    return value;
  }

  async fetch() {
    return Math.random() * 100;
    // return this.httpClient.get(this.pullURL);
  }

  calculateNextPoolingTime(currentResult) {
    const previousResult = this.lastPoolingResult;
    const variation =
      (Math.abs(previousResult - currentResult) / previousResult) * 100; // percentage

    const poolingInterval =
      variation > this.stockVariationThreshold
        ? this.highFrequencyPoolingInterval
        : this.lowFrequencyPoolingInterval;

    const timeSinceLastPooling =
      Date.now() - this.lastPoolingStartedAt.valueOf();

    return Math.max(0, poolingInterval - timeSinceLastPooling);
  }
}
