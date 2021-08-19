import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { LikersPageRoutingModule } from "./likers-routing.module";

import { LikersPage } from "./likers.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, LikersPageRoutingModule],
  entryComponents: [LikersPage],
  declarations: [LikersPage],
})
export class LikersPageModule {}
