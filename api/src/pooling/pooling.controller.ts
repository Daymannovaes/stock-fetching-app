import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage as SubscribeTo,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PoolingService } from './pooling.service';

import {
  NOT_FOUND,
  CREATE_POOL,
  START_POOL,
  POOL_RESULT,
  OK,
  ERROR,
  STOP_POOL,
} from '../../../domain/constants';
import { CreatePoolingDto } from './dto/create-pooling.dto';

// @todo namespace for pool start, stop, result (due to nest poor integration with socket)

@WebSocketGateway()
export class PoolingController {
  constructor(private poolingService: PoolingService) {}

  @SubscribeTo(CREATE_POOL)
  async createPooling(@MessageBody() data: CreatePoolingDto): Promise<string> {
    console.log('creating pool with: ', data);
    const pool = await this.poolingService.createPooling(data);

    return pool ? pool.id.toString() : ERROR;
  }

  @SubscribeTo(START_POOL)
  async startPooling(
    @MessageBody() poolId: number,
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    const pool = await this.poolingService.startPooling(poolId);

    if (!pool) return NOT_FOUND;

    pool.on(POOL_RESULT, (result) => {
      console.log(`pool ${pool.id} result called`);
      client.emit(`pool/${pool.id}/result`, result);
    });

    return OK;
  }

  @SubscribeTo(STOP_POOL)
  async stopPooling(@MessageBody() poolId: number): Promise<string> {
    const pool = await this.poolingService.stopPooling(poolId);

    if (!pool) return NOT_FOUND;

    pool.removeAllListeners(POOL_RESULT);

    return OK;
  }
}
