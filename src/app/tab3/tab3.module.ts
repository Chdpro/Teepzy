import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Tab3Page } from "./tab3.page";
import { ExploreContainerComponentModule } from "../explore-container/explore-container.module";
import { MaterialModule } from "../material.module";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { Tab3PageRoutingModule } from "./tab3-routing.module";
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
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: "", component: Tab3Page }]),
    Tab3PageRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [Tab3Page],
})
export class Tab3PageModule {}
