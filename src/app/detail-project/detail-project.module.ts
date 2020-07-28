import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailProjectPageRoutingModule } from './detail-project-routing.module';
import { MaterialModule } from '../material.module';

import { DetailProjectPage } from './detail-project.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    DetailProjectPageRoutingModule
  ],
  declarations: [DetailProjectPage]
})
export class DetailProjectPageModule {}
