import { HttpService, Injectable } from '@nestjs/common';
import { CreatePoolingDto } from './dto/create-pooling.dto';
import { Pooling } from './entities/pooling.entity';

@Injectable()
export class PoolingService {
  constructor(private httpClient: HttpService) {}

  poolings: Pooling[] = [];

  async createPooling(
    poolingConfig: CreatePoolingDto,
  ): Promise<Pooling | void> {
    const pool = new Pooling(poolingConfig.pullURL);

    if (poolingConfig.lowFrequencyPoolingInterval) {
      pool.lowFrequencyPoolingInterval =
        poolingConfig.lowFrequencyPoolingInterval;
    }

    if (poolingConfig.highFrequencyPoolingInterval) {
      pool.highFrequencyPoolingInterval =
        poolingConfig.highFrequencyPoolingInterval;
    }

    if (poolingConfig.stockVariationThreshold) {
      pool.stockVariationThreshold = poolingConfig.stockVariationThreshold;
    }

    this.poolings.push(pool);

    return pool;
  }

  async getPoolingById(id: number) {
    return this.poolings.find((pool) => pool.id === id);
  }

  async startPooling(id: number) {
    const pool = await this.getPoolingById(id);

    if (!pool) return undefined;

    pool.start(this.httpClient);

    return pool;
  }

  async stopPooling(id: number) {
    const pool = await this.getPoolingById(id);

    if (!pool) return undefined;

    pool.stop();

    return pool;
  }
}
