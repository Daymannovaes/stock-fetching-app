import { Injectable } from '@angular/core';

import io from 'socket.io-client'; // v2 because this is the version Nestjs currently supports
import { environment } from '../../../environments/environment';

import {
  CREATE_POOL,
  START_POOL,
  STOP_POOL,
  ERROR,
  NOT_FOUND,
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

  public async createPool(poolConfig: Partial<Pooling>): Promise<string> {
    return new Promise((resolve, reject) => {
      this.socket.emit(
        CREATE_POOL,
        poolConfig,
        (result: any) => result === ERROR ? reject(result) : resolve(result)
      );
  })
  }

  public async startPool(id: number, onResult: Function = () => {}) {
      this.socket.emit(
        START_POOL,
        id,
        (result: any) => result === NOT_FOUND ? this.stopPool(id) : console.info(`pool start for ${id}`)
      );

      this.socket.on(`pool/${id}/result`, onResult);
  }

  public stopPool(id: number) {
    this.socket.emit(STOP_POOL, id);
    this.socket.off(`pool/${id}/result`);
  }
}
