import { Test, TestingModule } from '@nestjs/testing';
import { PoolingController } from './pooling.controller';

describe('PoolingController', () => {
  let controller: PoolingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PoolingController],
    }).compile();

    controller = module.get<PoolingController>(PoolingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
