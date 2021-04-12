import { Module } from '@nestjs/common';
import { PoolingController } from './pooling.controller';
import { PoolingGateway } from './pooling.gateway';

@Module({
  controllers: [PoolingController],
  providers: [PoolingGateway],
})
export class PoolingModule {}
