import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShareSheetPage } from './share-sheet.page';

const routes: Routes = [
  {
    path: '',
    component: ShareSheetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShareSheetPageRoutingModule {}
