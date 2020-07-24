import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddProductPageRoutingModule } from './add-product-routing.module';
import { MaterialModule } from '../material.module';

import { AddProductPage } from './add-product.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    AddProductPageRoutingModule
  ],
  entryComponents: [AddProductPage],
  declarations: [AddProductPage]
})
export class AddProductPageModule {}
