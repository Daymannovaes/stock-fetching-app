import { Test, TestingModule } from '@nestjs/testing';
import { PoolingController } from './pooling.controller';
import { PoolingService } from './pooling.service';

describe('PoolingGateway', () => {
  let gateway: PoolingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PoolingController, PoolingService],
    }).compile();

    gateway = module.get<PoolingController>(PoolingController);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
