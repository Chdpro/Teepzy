import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditSnapPageRoutingModule } from './edit-snap-routing.module';
import { MaterialModule } from '../material.module';

import { EditSnapPage } from './edit-snap.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    EditSnapPageRoutingModule
  ],
  entryComponents:[EditSnapPage],
  declarations: [EditSnapPage]
})
export class EditSnapPageModule {}
