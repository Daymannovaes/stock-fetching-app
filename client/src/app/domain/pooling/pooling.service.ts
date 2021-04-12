import { Injectable } from '@angular/core';

import io from 'socket.io-client'; // v2 because this is the version Nestjs currently supports
import { environment } from '../../../environments/environment';

import {
  CREATE_POOL,
  START_POOL,
} from '../../../../../domain/constants';
import { Pooling } from '../../../../../domain/pooling.entity';

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

  public createPool(poolConfig: Partial<Pooling>) {
    this.socket.emit(
      CREATE_POOL,
      poolConfig,
      (result: any) => console.log('pool creation result: ', result)
    );
  }

  public startPool(id: number) {
    this.socket.emit(
      START_POOL,
      id,
      (result: any) => console.log('pool start result: ', result)
    );

    this.socket.on(`pool/${id}/result`, (result: any) => {
      console.log('pool result: ', result);
    })
  }


}
