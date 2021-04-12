import { Module } from '@nestjs/common';
import { PoolingController } from './pooling.controller';
import { PoolingService } from './pooling.service';

@Module({
  providers: [PoolingController, PoolingService],
})
export class PoolingModule {}
