import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionModalPage } from './permission-modal.page';

const routes: Routes = [
  {
    path: '',
    component: PermissionModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PermissionModalPageRoutingModule {}
