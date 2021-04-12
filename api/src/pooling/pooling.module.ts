import { Module } from '@nestjs/common';
import { PoolingGateway } from './pooling.gateway';

@Module({
  providers: [PoolingGateway],
})
export class PoolingModule {}
