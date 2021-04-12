import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';

const marketstackAccessKey = '3b82d85f4173b772bd82251c113b40bc';
let ids = 0;

class IPooling extends EventEmitter {
  id: number;

  pullURL: string;

  highFrequencyPoolingInterval: number;

  lowFrequencyPoolingInterval: number;

  stockVariationThreshold: number;

  isPoolingActive: boolean;

  lastPoolingAt: Date;

  createdAt: Date;

  updatedAt: Date;
}

class Pooling extends IPooling {
  constructor(symbol: string) {
    super();

    this.id = ids;
    ids++; // @todo change for a db generated id

    this.pullURL = `http://api.marketstack.com/v1/intraday?access_key=${marketstackAccessKey}&symbols=${symbol.toUpperCase()}&limit=1`;
    this.stockVariationThreshold = 3; // default to 3%
    this.highFrequencyPoolingInterval = 2 * 1000; // default to 2 seconds
    this.lowFrequencyPoolingInterval = 15 * 1000; // default to 15 seconds

    this.isPoolingActive = null;
  }

  start() {
    console.log('pooling start for ', this.pullURL);

    setTimeout(() => {
      this.emit('pooled', '1 dolar');
    }, 2000);
  }
}

@Injectable()
export class PoolingService {
  poolings: Pooling[] = [];

  async createPooling(symbol: string) {
    const pool = new Pooling(symbol);
    this.poolings.push(pool);

    return pool;
  }

  async getPoolingById(id: number) {
    return this.poolings.find((pool) => pool.id === id);
  }

  async startPooling(id: number) {
    const pool = await this.getPoolingById(id);

    if (!pool) return undefined;

    pool.start();

    return pool;
  }
}
