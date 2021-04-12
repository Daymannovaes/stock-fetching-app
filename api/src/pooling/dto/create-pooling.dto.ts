import { PickType } from '@nestjs/mapped-types';
import { Pooling } from '../entities/pooling.entity';

export class CreatePoolingDto extends PickType(Pooling, [
  'userId',
  'pullURL',
  'highFrequencyPoolingInterval',
  'lowFrequencyPoolingInterval',
  'stockVariationThreshold',
]) {}
