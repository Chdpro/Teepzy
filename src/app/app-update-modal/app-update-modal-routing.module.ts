import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppUpdateModalPage } from './app-update-modal.page';

const routes: Routes = [
  {
    path: '',
    component: AppUpdateModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppUpdateModalPageRoutingModule {}
