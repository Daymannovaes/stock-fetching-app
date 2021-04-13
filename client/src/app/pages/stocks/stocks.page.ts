import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Pooling } from '../../../../../domain/pooling.entity';
import { PoolingService } from '../../domain/pooling/pooling.service';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.page.html',
  styleUrls: ['./stocks.page.css']
})
export class StocksPage implements OnInit {
  constructor(private poolingService: PoolingService) {}

  pullURL = new FormControl('');

  poolId: number | undefined;
  poolResults: number[] = [];

  async ngOnInit() {}

  async onFormSubmit() {
    this.createPool({
      pullURL: this.pullURL.value
    });
  }

  async createPool(poolConfig: Partial<Pooling>) {
    const poolId = await this.poolingService.createPool(poolConfig);

    this.poolId = parseInt(poolId);
    this.poolResults = [];

    this.poolingService.startPool(this.poolId, (result: any) => {
      console.log('pool result: ', result);
      this.poolResults.push(parseFloat(result.last));
    });
  }

  async stopCurrentPooling() {
    this.poolingService.stopPool(this.poolId as number);
    this.poolId = undefined;
    this.poolResults = [];
  }
}
