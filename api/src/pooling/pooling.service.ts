import { Injectable } from '@nestjs/common';
import { CreatePoolingDto } from './dto/create-pooling.dto';
import { Pooling } from './entities/pooling.entity';

@Injectable()
export class PoolingService {
  poolings: Pooling[] = [];

  async createPooling(
    poolingConfig: CreatePoolingDto,
  ): Promise<Pooling | void> {
    const pool = new Pooling(poolingConfig.pullURL);
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
