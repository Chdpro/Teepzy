import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShareSheetPageRoutingModule } from './share-sheet-routing.module';

import { ShareSheetPage } from './share-sheet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShareSheetPageRoutingModule
  ],
  entryComponents: [ShareSheetPage],
  declarations: [ShareSheetPage]
})
export class ShareSheetPageModule {}
