import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddProjectPageRoutingModule } from './add-project-routing.module';
import { MaterialModule } from '../material.module';

import { AddProjectPage } from './add-project.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    AddProjectPageRoutingModule
  ],
  entryComponents: [AddProjectPage],
  declarations: [AddProjectPage]
})
export class AddProjectPageModule {}
