import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddPostPageRoutingModule } from './add-post-routing.module';
import { MaterialModule } from '../material.module';

import { AddPostPage } from './add-post.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    AddPostPageRoutingModule,
  ],
//  entryComponents: [AddPostPage],
  declarations: [AddPostPage]
})
export class AddPostPageModule {}
