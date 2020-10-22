import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportBugPage } from './report-bug.page';

const routes: Routes = [
  {
    path: '',
    component: ReportBugPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportBugPageRoutingModule {}
