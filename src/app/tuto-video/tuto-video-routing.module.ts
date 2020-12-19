import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TutoVideoPage } from './tuto-video.page';

const routes: Routes = [
  {
    path: '',
    component: TutoVideoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutoVideoPageRoutingModule {}
