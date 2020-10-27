import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditSnapImgPageRoutingModule } from './edit-snap-img-routing.module';

import { EditSnapImgPage } from './edit-snap-img.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditSnapImgPageRoutingModule
  ],
  entryComponents:[EditSnapImgPage],
  declarations: [EditSnapImgPage]
})
export class EditSnapImgPageModule {}
