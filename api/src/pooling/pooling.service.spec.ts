import { Test, TestingModule } from '@nestjs/testing';
import { PoolingService } from './pooling.service';

describe('PoolingService', () => {
  let service: PoolingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PoolingService],
    }).compile();

    service = module.get<PoolingService>(PoolingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
