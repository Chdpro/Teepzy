import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { GroupInvitationPageRoutingModule } from "./group-invitation-routing.module";
import { MaterialModule } from "../material.module";
import { Ng2SearchPipeModule } from "ng2-search-filter";

import { GroupInvitationPage } from "./group-invitation.page";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoaderFactory,
        deps: [HttpClient],
      },
    }),
    GroupInvitationPageRoutingModule,
  ],
  entryComponents: [GroupInvitationPage],
  declarations: [GroupInvitationPage],
})
export class GroupInvitationPageModule {}
