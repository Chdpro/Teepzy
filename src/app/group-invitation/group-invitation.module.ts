import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupInvitationPageRoutingModule } from './group-invitation-routing.module';
import { MaterialModule } from '../material.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { GroupInvitationPage } from './group-invitation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    Ng2SearchPipeModule,
    GroupInvitationPageRoutingModule
  ],
  entryComponents: [GroupInvitationPage],
  declarations: [GroupInvitationPage]
})
export class GroupInvitationPageModule {}
