import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommentsPageRoutingModule } from './comments-routing.module';
import { MaterialModule } from '../material.module';

import { CommentsPage } from './comments.page';
import { MentionModule } from 'angular-mentions';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    CommentsPageRoutingModule,
    MentionModule
  ],
  entryComponents: [CommentsPage],
  declarations: [CommentsPage]
})
export class CommentsPageModule {}
