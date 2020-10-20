import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddPeopleRoomPage } from './add-people-room.page';

const routes: Routes = [
  {
    path: '',
    component: AddPeopleRoomPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddPeopleRoomPageRoutingModule {}
