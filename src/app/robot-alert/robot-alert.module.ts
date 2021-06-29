import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RobotAlertPageRoutingModule } from './robot-alert-routing.module';
import { RobotAlertPage } from './robot-alert.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RobotAlertPageRoutingModule
  ],
  declarations: [RobotAlertPage],
  entryComponents: [RobotAlertPage]
})
export class RobotAlertPageModule {}
