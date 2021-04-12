import { EventEmitter } from 'events';
import { POOL_RESULT } from '../../../../domain/constants';
import { Pooling as Base } from '../../../../domain/pooling.entity';

const marketstackAccessKey = '3b82d85f4173b772bd82251c113b40bc';
let ids = 0;

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

    this.isPoolingActive = null;
  }

  id: number;

  userId: number;

  pullURL: string;

  highFrequencyPoolingInterval: number;

  lowFrequencyPoolingInterval: number;

  stockVariationThreshold: number;

  isPoolingActive: boolean;

  lastPoolingAt: Date;

  createdAt: Date;

  updatedAt: Date;

  start() {
    console.info(`pooling (${this.id}) start for url (${this.pullURL})`);

    setTimeout(() => {
      this.emit(POOL_RESULT, '1 dolar');
    }, 2000);
  }
}
