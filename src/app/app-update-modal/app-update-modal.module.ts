import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AppUpdateModalPageRoutingModule } from "./app-update-modal-routing.module";

import { AppUpdateModalPage } from "./app-update-modal.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppUpdateModalPageRoutingModule,
  ],
  entryComponents: [AppUpdateModalPage],
  declarations: [AppUpdateModalPage],
})
export class AppUpdateModalPageModule {}
