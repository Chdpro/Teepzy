import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AddPostPageRoutingModule } from "./add-post-routing.module";
import { MaterialModule } from "../material.module";

import { AddPostPage } from "./add-post.page";
import { ImageCropperModule } from "ngx-image-cropper";
// import { MentionModule } from "angular-mentions";
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
    AddPostPageRoutingModule,
    ImageCropperModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoaderFactory,
        deps: [HttpClient],
      },
    }),
    // MentionModule,
  ],
  //  entryComponents: [AddPostPage],
  declarations: [AddPostPage],
})
export class AddPostPageModule {}
