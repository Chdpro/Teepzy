import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AddPeopleRoomPageRoutingModule } from "./add-people-room-routing.module";
import { MaterialModule } from "../material.module";
import { Ng2SearchPipeModule } from "ng2-search-filter";

import { AddPeopleRoomPage } from "./add-people-room.page";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
// Factory function required during AOT compilation
export function httpTranslateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    Ng2SearchPipeModule,
    AddPeopleRoomPageRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  entryComponents: [AddPeopleRoomPage],
  declarations: [AddPeopleRoomPage],
})
export class AddPeopleRoomPageModule {}
