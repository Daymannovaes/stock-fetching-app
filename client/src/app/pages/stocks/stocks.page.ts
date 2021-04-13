import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PoolingService } from '../../domain/pooling/pooling.service';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.page.html',
})
export class StocksPage implements OnInit {
  constructor(private poolingService: PoolingService) {}

  pullURL = new FormControl('');

  poolId: number | undefined;
  poolResults: number[] = [];

  async ngOnInit() {}

  async onFormSubmit() {
    const poolId = await this.poolingService.createPool({
      pullURL: this.pullURL.value
    });

    this.poolId = parseInt(poolId);
    this.poolResults = [];

    this.poolingService.startPool(this.poolId, (result: string) => {
      console.log('pool result: ', result);
      this.poolResults.push(parseFloat(result));
    });
  }
}
