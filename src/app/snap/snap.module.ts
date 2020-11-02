import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SnapPageRoutingModule } from './snap-routing.module';
import { MaterialModule } from '../material.module';

import { SnapPage } from './snap.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    SnapPageRoutingModule
  ],
 // entryComponents:[SnapPage],
  declarations: [SnapPage]
})
export class SnapPageModule {}
