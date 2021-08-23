import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ContactsPageRoutingModule } from "./contacts-routing.module";
import { MaterialModule } from "../material.module";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { ContactsPage } from "./contacts.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    Ng2SearchPipeModule,
    ContactsPageRoutingModule,
  ],
  entryComponents: [ContactsPage],
  declarations: [ContactsPage],
})
export class ContactsPageModule {}
