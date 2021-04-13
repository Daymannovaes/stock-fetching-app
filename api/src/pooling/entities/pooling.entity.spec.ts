import { Pooling } from './pooling.entity';

describe('pooling.entity', () => {
  let pooling: Pooling;

  beforeEach(() => {
    pooling = new Pooling('symbol');
  });

  it('should be defined', () => {
    expect(Pooling).toBeDefined();
  });

  describe('start', () => {
    let httpClient;

    beforeEach(() => {
      httpClient = {
        get: jest.fn(),
      };
    });

    it('should handle isPoolingActive', () => {
      jest.spyOn(pooling, 'fetchNext' as any).mockImplementation();

      expect(pooling.isPoolingActive).toBe(false);
      pooling.start(httpClient);
      expect(pooling.isPoolingActive).toBe(true);
    });

    it('should call fetchNext', () => {
      const spy = jest.spyOn(pooling, 'fetchNext' as any).mockImplementation();

      pooling.start(httpClient);
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('fetchNext & calculateNextPoolingTime', () => {
    const lowFreqInterval = 10000;
    const highFreqInterval = 1000;

    beforeEach(() => {
      jest.useFakeTimers('modern');

      pooling.isPoolingActive = true;

      pooling.lowFrequencyPoolingInterval = lowFreqInterval;
      pooling.highFrequencyPoolingInterval = highFreqInterval;
    });

    async function testFetchNextCalledAfter({
      current = 105,
      previous = 100,
      timeSpentInFetch = 0,
      threshold,
      interval,
    }) {
      const fakeCurrentResult = current;
      pooling.lastPoolingResult = previous;
      pooling.stockVariationThreshold = threshold;

      jest.spyOn(pooling, 'fetchAndEmitResult').mockImplementation(() => {
        jest.advanceTimersByTime(timeSpentInFetch);
        return Promise.resolve(fakeCurrentResult);
      });

      const spyFetchNext = jest.spyOn(pooling, 'fetchNext' as any);
      const spyCalculate = jest.spyOn(pooling, 'calculateNextPoolingTime');

      await (pooling as any).fetchNext();

      expect(pooling.lastPoolingResult).toBe(fakeCurrentResult); // after fetch finished, previous equals current
      expect(spyCalculate).toReturnWith(interval - timeSpentInFetch);

      jest.advanceTimersByTime(interval - timeSpentInFetch - 10);
      expect(spyFetchNext).toBeCalledTimes(1); // missing 10 ms, so it shouldnt be called yet

      jest.advanceTimersByTime(11);
      expect(spyFetchNext).toBeCalledTimes(2); // after 11 ms, it should be have called again
    }

    it('should work for variation below threshold', async () => {
      const threshold = 5;
      const interval = lowFreqInterval;
      return testFetchNextCalledAfter({ threshold, interval });
    });

    it('should work for variation above threshold', async () => {
      const threshold = 2;
      const interval = highFreqInterval;
      return testFetchNextCalledAfter({ threshold, interval });
    });

    it('should work when fetch is slow', async () => {
      const threshold = 5;
      const interval = lowFreqInterval;
      return testFetchNextCalledAfter({
        threshold,
        interval,
        timeSpentInFetch: 3000,
      });
    });
  });
});
