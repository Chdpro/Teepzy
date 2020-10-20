import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddPeopleRoomPageRoutingModule } from './add-people-room-routing.module';
import { MaterialModule } from '../material.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { AddPeopleRoomPage } from './add-people-room.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    Ng2SearchPipeModule,
    AddPeopleRoomPageRoutingModule
  ],
  entryComponents:[AddPeopleRoomPage],
  declarations: [AddPeopleRoomPage]
})
export class AddPeopleRoomPageModule {}
