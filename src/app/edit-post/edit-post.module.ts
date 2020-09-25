import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPostPageRoutingModule } from './edit-post-routing.module';
import { MaterialModule } from '../material.module';

import { EditPostPage } from './edit-post.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    EditPostPageRoutingModule
  ],
  entryComponents: [EditPostPage],
  declarations: [EditPostPage]
})
export class EditPostPageModule {}
