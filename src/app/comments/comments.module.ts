import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CommentsPageRoutingModule } from "./comments-routing.module";
import { MaterialModule } from "../material.module";

import { CommentsPage } from "./comments.page";
import { MentionModule } from "angular-mentions";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { LinkifyPipe } from "../pipes/linkify.pipe";
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
    CommentsPageRoutingModule,
    MentionModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  entryComponents: [CommentsPage],
  declarations: [CommentsPage, LinkifyPipe],
})
export class CommentsPageModule {}
