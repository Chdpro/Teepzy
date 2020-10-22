import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutorisationPage } from './autorisation.page';

const routes: Routes = [
  {
    path: '',
    component: AutorisationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutorisationPageRoutingModule {}
