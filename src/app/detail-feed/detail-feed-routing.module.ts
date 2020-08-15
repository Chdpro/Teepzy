import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailFeedPage } from './detail-feed.page';

const routes: Routes = [
  {
    path: '',
    component: DetailFeedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailFeedPageRoutingModule {}
