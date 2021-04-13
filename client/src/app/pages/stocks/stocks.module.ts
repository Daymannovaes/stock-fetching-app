import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StocksRoutingModule } from './stocks-routing.module';

import { StocksPage } from './stocks.page';
import { PoolingService } from 'src/app/domain/pooling/pooling.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StocksRoutingModule,
  ],
  declarations: [StocksPage],
  providers: [PoolingService],
})
export class StocksModule {}
