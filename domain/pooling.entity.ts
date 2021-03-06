export class Pooling {
  id: number;

  userId: number;

  pullURL: string;

  highFrequencyPoolingInterval: number;

  lowFrequencyPoolingInterval: number;

  stockVariationThreshold: number;

  isPoolingActive: boolean;

  lastPoolingStartedAt: Date;

  createdAt: Date;

  updatedAt: Date;
}
