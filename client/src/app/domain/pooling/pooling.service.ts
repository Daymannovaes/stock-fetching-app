import { Injectable } from '@angular/core';

import io from 'socket.io-client'; // v2 because this is the version Nestjs currently supports
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PoolingService {
  constructor() {
    this.socket = io(environment.socketApiUrl);

    this.startPooling();
  }

  socket;

  startPooling() {
    this.socket.on('connect', () => {
      console.log('Connected');

      this.socket.emit('pooling', { test: 'test' });

      this.socket.emit('echo', 'hello my friend', (response: any) =>
        console.log('echo:', response),
      );
    });

    this.socket.on('pooling', function(data: any) {
      console.log('pooling', data);
    });

    this.socket.on('exception', function(data: any) {
      console.log('event', data);
    });

    this.socket.on('disconnect', function() {
      console.log('Disconnected');
    });
  }

}
