import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PoolingModule } from './pooling/pooling.module';

@Module({
  imports: [PoolingModule],
  controllers: [AppController],
})
export class AppModule {}
