import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OutcirclePage } from './outcircle.page';

const routes: Routes = [
  {
    path: '',
    component: OutcirclePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OutcirclePageRoutingModule {}
