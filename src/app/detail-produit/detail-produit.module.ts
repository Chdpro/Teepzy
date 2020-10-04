import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailProduitPageRoutingModule } from './detail-produit-routing.module';
import { MaterialModule } from '../material.module';

import { DetailProduitPage } from './detail-produit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    DetailProduitPageRoutingModule
  ],
  declarations: [DetailProduitPage]
})
export class DetailProduitPageModule {}
