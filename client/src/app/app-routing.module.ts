import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'stocks',
    loadChildren: () =>
      import('./pages/stocks/stocks.module').then((m) => m.StocksModule),
  },
  {
    path: '',
    redirectTo: '/stocks',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
