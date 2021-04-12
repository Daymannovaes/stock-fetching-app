import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { StocksRoutingModule } from './stocks-routing.module';

import { StocksPage } from './stocks.page';
import { PoolingService } from 'src/app/domain/pooling/pooling.service';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StocksRoutingModule,
    SocketIoModule.forRoot(config),
  ],
  declarations: [StocksPage],
  providers: [PoolingService],
})
export class StocksModule {}
