import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TutoVideoPageRoutingModule } from './tuto-video-routing.module';
import { MaterialModule } from '../material.module';

import { TutoVideoPage } from './tuto-video.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    TutoVideoPageRoutingModule
  ],
  declarations: [TutoVideoPage]
})
export class TutoVideoPageModule {}
