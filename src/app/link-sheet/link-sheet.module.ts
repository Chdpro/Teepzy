import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LinkSheetPageRoutingModule } from './link-sheet-routing.module';
import { MaterialModule } from '../material.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { LinkSheetPage } from './link-sheet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    Ng2SearchPipeModule,
    LinkSheetPageRoutingModule
  ],
  entryComponents: [LinkSheetPage],
  declarations: [LinkSheetPage]
})
export class LinkSheetPageModule {}
