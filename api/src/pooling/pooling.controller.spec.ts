import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Pooling } from './entities/pooling.entity';
import { PoolingController } from './pooling.controller';
import { PoolingService } from './pooling.service';

describe('PoolingController', () => {
  let controller: PoolingController;
  let service: PoolingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [PoolingController, PoolingService],
    }).compile();

    controller = module.get<PoolingController>(PoolingController);
    service = module.get<PoolingService>(PoolingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPooling', () => {
    it('should return pooling id after creation', async () => {
      const fakeId = 123;
      const fakePooling = new Pooling('symbol');
      fakePooling.id = fakeId;

      jest.spyOn(service, 'createPooling').mockResolvedValue(fakePooling);

      expect(await controller.createPooling({ pullURL: 'symbol' } as any)).toBe(
        fakeId.toString(),
      );
    });

    it('should return error if creation fails', async () => {
      jest.spyOn(service, 'createPooling').mockResolvedValue(undefined);

      expect(await controller.createPooling({ pullURL: 'symbol' } as any)).toBe(
        'error',
      );
    });
  });

  // @todo check how to test web socket

  // describe('startPooling', () => {
  //   it('should start correctly', async () => {
  //     const fakeId = 123;
  //     const fakePooling = new Pooling('symbol');
  //     fakePooling.id = fakeId;

  //     jest.spyOn(service, 'createPooling').mockResolvedValue(fakePooling);

  //     expect(await controller.startPooling('symbol', new Socket())).toBe(fakeId.toString());
  //   });

  //   it('should return not found', async () => {
  //     jest.spyOn(service, 'createPooling').mockResolvedValue(undefined);

  //     expect(await controller.createPooling('symbol')).toBe('error');
  //   });
  // });
});
