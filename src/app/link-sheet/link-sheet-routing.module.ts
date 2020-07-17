import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LinkSheetPage } from './link-sheet.page';

const routes: Routes = [
  {
    path: '',
    component: LinkSheetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LinkSheetPageRoutingModule {}
