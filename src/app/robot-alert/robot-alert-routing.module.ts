import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RobotAlertPage } from './robot-alert.page';

const routes: Routes = [
  {
    path: '',
    component: RobotAlertPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RobotAlertPageRoutingModule {}
