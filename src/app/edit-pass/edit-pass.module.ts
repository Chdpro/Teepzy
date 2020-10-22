import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPassPageRoutingModule } from './edit-pass-routing.module';
import { MaterialModule } from '../material.module';

import { EditPassPage } from './edit-pass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    EditPassPageRoutingModule
  ],
  declarations: [EditPassPage]
})
export class EditPassPageModule {}
