import { Test, TestingModule } from '@nestjs/testing';
import { PoolingGateway } from './pooling.gateway';

describe('PoolingGateway', () => {
  let gateway: PoolingGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PoolingGateway],
    }).compile();

    gateway = module.get<PoolingGateway>(PoolingGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
