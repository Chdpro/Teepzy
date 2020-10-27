import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SnapPage } from './snap.page';

const routes: Routes = [
  {
    path: '',
    component: SnapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SnapPageRoutingModule {}
