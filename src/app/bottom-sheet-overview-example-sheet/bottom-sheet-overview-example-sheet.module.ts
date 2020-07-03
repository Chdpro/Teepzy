import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BottomSheetOverviewExampleSheetPageRoutingModule } from './bottom-sheet-overview-example-sheet-routing.module';

import { BottomSheetOverviewExampleSheetPage } from './bottom-sheet-overview-example-sheet.page';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    BottomSheetOverviewExampleSheetPageRoutingModule
  ],
  entryComponents: [BottomSheetOverviewExampleSheetPage],
  declarations: [BottomSheetOverviewExampleSheetPage]
})
export class BottomSheetOverviewExampleSheetPageModule {}
