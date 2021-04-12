import { Injectable } from '@angular/core';

import io from 'socket.io-client'; // v2 because this is the version Nestjs currently supports
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PoolingService {
  constructor() {
    this.socket = io(environment.socketApiUrl);

    this.stablishSocketConnection();
  }

  socket;

  private stablishSocketConnection() {
    this.socket.on('connect', () => {
      console.info('Socket connected');
    });

    this.socket.on('exception', function(error: any) {
      console.error('Socket exception', error);
    });

    this.socket.on('disconnect', function() {
      console.error('Socket disconnected');
    });
  }

  public createPool(poolConfig: any) {
    this.socket.emit(
      'pool/create',
      poolConfig,
      (result: any) => console.log('pool creation result: ', result)
    );
  }

  public startPool(id: any) {
    this.socket.emit(
      'pool/start',
      { id },
      (result: any) => console.log('pool start result: ', result)
    );

    this.socket.on(`pool/${id}/result`, (result: any) => {
      console.log('pool result: ', result);
    })
  }


}
