import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditSnapImgPage } from './edit-snap-img.page';

const routes: Routes = [
  {
    path: '',
    component: EditSnapImgPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditSnapImgPageRoutingModule {}
