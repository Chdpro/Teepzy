import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FriendsPageRoutingModule } from './friends-routing.module';
import { MaterialModule } from '../material.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { FriendsPage } from './friends.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    Ng2SearchPipeModule,
    FriendsPageRoutingModule
  ],
  declarations: [FriendsPage]
})
export class FriendsPageModule {}
