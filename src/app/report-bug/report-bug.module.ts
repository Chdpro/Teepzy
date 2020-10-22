import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportBugPageRoutingModule } from './report-bug-routing.module';
import { MaterialModule } from '../material.module';

import { ReportBugPage } from './report-bug.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    ReportBugPageRoutingModule
  ],
  declarations: [ReportBugPage]
})
export class ReportBugPageModule {}
