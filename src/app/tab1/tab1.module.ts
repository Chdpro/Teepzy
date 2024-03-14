import { IonicModule } from "@ionic/angular";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Tab1Page } from "./tab1.page";
import { ExploreContainerComponentModule } from "../explore-container/explore-container.module";
import { MaterialModule } from "../material.module";
import { Ng2SearchPipeModule } from "ng2-search-filter";

import { Tab1PageRoutingModule } from "./tab1-routing.module";
import { IonicSwipeAllModule } from "ionic-swipe-all";
//import { VgCoreModule } from "@videogular/ngx-videogular/core";
// import { VgControlsModule } from "@videogular/ngx-videogular/controls";
// import { VgOverlayPlayModule } from "@videogular/ngx-videogular/overlay-play";
// import { VgBufferingModule } from "@videogular/ngx-videogular/buffering";
import { MatSnackBarModule } from "@angular/material";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
// Factory function required during AOT compilation
export function httpTranslateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    Ng2SearchPipeModule,
    IonicSwipeAllModule,
    ExploreContainerComponentModule,
    //VgCoreModule,
    // VgControlsModule,
    // VgOverlayPlayModule,
    // VgBufferingModule,
    Tab1PageRoutingModule,
    MatSnackBarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [Tab1Page],
})
export class Tab1PageModule {}
