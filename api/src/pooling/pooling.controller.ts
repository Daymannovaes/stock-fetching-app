import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PoolingService } from './pooling.service';

// @todo namespace for pool start, stop, result (due to nest limitations is not possible to do it seamlessly)

@WebSocketGateway()
export class PoolingController {
  constructor(private poolingService: PoolingService) {}

  @SubscribeMessage('pool/create')
  async createPool(@MessageBody() data: any): Promise<string> {
    const pool = await this.poolingService.createPooling(data);

    return pool ? pool.id.toString() : 'error';
  }

  @SubscribeMessage('pool/start')
  async startPool(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    const pool = await this.poolingService.startPooling(data.id);

    if (!pool) return 'not_found';

    pool.on('pooled', (result) => {
      console.log(`pool ${pool.id} result called with ${result}`);
      client.emit(`pool/${pool.id}/result`, result);
    });

    return 'ok';
  }
}
