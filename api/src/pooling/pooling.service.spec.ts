import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Pooling } from './entities/pooling.entity';
import { PoolingService } from './pooling.service';

describe('PoolingService', () => {
  let service: PoolingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [PoolingService],
    }).compile();

    service = module.get<PoolingService>(PoolingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPooling', () => {
    it('should create pooling correctly', async () => {
      expect(service.poolings).toHaveLength(0);

      const pool = await service.createPooling({ pullURL: 'symbol' } as any);

      expect(service.poolings).toHaveLength(1);
      expect(service.poolings[0]).toBe(pool);
    });
  });

  describe('startPooling', () => {
    it('should start pooling correctly', async () => {
      const fakeId = 123;
      const fakePool = new Pooling('symbol');
      fakePool.id = fakeId;
      service.poolings = [fakePool];

      const spy = jest.spyOn(fakePool, 'start').mockImplementation();

      expect(await service.startPooling(fakeId)).toBe(fakePool);
      expect(spy).toBeCalledTimes(1);
    });

    it('should return undefined for non existing poolId', async () => {
      expect(service.poolings).toHaveLength(0);
      const fakeId = 123;

      expect(await service.startPooling(fakeId)).toBe(undefined);
      expect(service.poolings).toHaveLength(0);
    });
  });
});
