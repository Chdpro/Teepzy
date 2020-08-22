import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CircleMembersPageRoutingModule } from './circle-members-routing.module';
import { MaterialModule } from '../material.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { CircleMembersPage } from './circle-members.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    Ng2SearchPipeModule,
    CircleMembersPageRoutingModule
  ],
  entryComponents: [CircleMembersPage],
  declarations: [CircleMembersPage]
})
export class CircleMembersPageModule {}
