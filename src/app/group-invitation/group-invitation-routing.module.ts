import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupInvitationPage } from './group-invitation.page';

const routes: Routes = [
  {
    path: '',
    component: GroupInvitationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupInvitationPageRoutingModule {}
