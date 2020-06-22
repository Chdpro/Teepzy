import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupFinalPageRoutingModule } from './signup-final-routing.module';
import { MaterialModule } from '../material.module';

import { SignupFinalPage } from './signup-final.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,

    SignupFinalPageRoutingModule
  ],
  declarations: [SignupFinalPage]
})
export class SignupFinalPageModule {}
