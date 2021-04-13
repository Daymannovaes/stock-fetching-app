import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NOT_FOUND, OK, POOL_RESULT } from '../../../domain/constants';
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

  describe('startPooling', () => {
    it('should start correctly', async () => {
      const fakeId = 123;
      const fakePooling = new Pooling('symbol');
      fakePooling.id = fakeId;

      const spy = jest.spyOn(fakePooling, 'on');

      const fakeSocket = {
        emit: jest.fn(),
      };

      jest.spyOn(service, 'startPooling').mockResolvedValue(fakePooling);

      expect(await controller.startPooling(fakeId, fakeSocket as any)).toBe(OK);
      expect(spy).toBeCalledWith(POOL_RESULT, expect.any(Function));
    });

    it('should return not found', async () => {
      const fakeId = 123;

      const fakeSocket = {
        emit: jest.fn(),
      };

      jest.spyOn(service, 'startPooling').mockResolvedValue(undefined);

      expect(await controller.startPooling(fakeId, fakeSocket as any)).toBe(
        NOT_FOUND,
      );
    });
  });

  describe('stopPooling', () => {
    it('should stop correctly', async () => {
      const fakeId = 123;
      const fakePooling = new Pooling('symbol');
      fakePooling.id = fakeId;

      const spy = jest.spyOn(fakePooling, 'removeAllListeners');

      jest.spyOn(service, 'stopPooling').mockResolvedValue(fakePooling);

      expect(await controller.stopPooling(fakeId)).toBe(OK);
      expect(spy).toBeCalledWith(POOL_RESULT);
    });

    it('should return not found', async () => {
      const fakeId = 123;

      jest.spyOn(service, 'stopPooling').mockResolvedValue(undefined);

      expect(await controller.stopPooling(fakeId)).toBe(NOT_FOUND);
    });
  });
});
