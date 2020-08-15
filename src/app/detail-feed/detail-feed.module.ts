import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailFeedPageRoutingModule } from './detail-feed-routing.module';
import { MaterialModule } from '../material.module';

import { DetailFeedPage } from './detail-feed.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    DetailFeedPageRoutingModule
  ],
  declarations: [DetailFeedPage]
})
export class DetailFeedPageModule {}
