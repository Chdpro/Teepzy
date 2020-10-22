import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditPassPage } from './edit-pass.page';

const routes: Routes = [
  {
    path: '',
    component: EditPassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditPassPageRoutingModule {}
