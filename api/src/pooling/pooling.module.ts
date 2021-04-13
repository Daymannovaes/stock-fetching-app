import { HttpModule, Module } from '@nestjs/common';
import { PoolingController } from './pooling.controller';
import { PoolingService } from './pooling.service';

@Module({
  imports: [HttpModule],
  providers: [PoolingController, PoolingService],
})
export class PoolingModule {}
