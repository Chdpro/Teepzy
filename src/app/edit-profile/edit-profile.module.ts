import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditProfilePageRoutingModule } from './edit-profile-routing.module';
import { MaterialModule } from '../material.module';

import { EditProfilePage } from './edit-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    EditProfilePageRoutingModule
  ],
  declarations: [EditProfilePage]
})
export class EditProfilePageModule {}
