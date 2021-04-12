import { Component, OnInit } from '@angular/core';
import { PoolingService } from '../../domain/pooling/pooling.service';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.page.html',
})
export class StocksPage implements OnInit {
  constructor(private poolingService: PoolingService) {}

  async ngOnInit() {}
}
