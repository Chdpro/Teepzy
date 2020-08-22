import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CircleMembersPage } from './circle-members.page';

const routes: Routes = [
  {
    path: '',
    component: CircleMembersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CircleMembersPageRoutingModule {}
