import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditSnapPage } from './edit-snap.page';

const routes: Routes = [
  {
    path: '',
    component: EditSnapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditSnapPageRoutingModule {}
