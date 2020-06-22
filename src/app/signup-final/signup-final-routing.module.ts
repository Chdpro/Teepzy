import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupFinalPage } from './signup-final.page';

const routes: Routes = [
  {
    path: '',
    component: SignupFinalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupFinalPageRoutingModule {}
