import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class PoolingGateway {
  @SubscribeMessage('pooling')
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    console.log('hello world');
    client.emit('pooling', 'hello world');
    return 'hello world';
  }

  @SubscribeMessage('echo')
  async identity(@MessageBody() data: string): Promise<string> {
    return data;
  }
}
