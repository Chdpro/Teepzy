import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LikersPage } from './likers.page';

const routes: Routes = [
  {
    path: '',
    component: LikersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LikersPageRoutingModule {}
