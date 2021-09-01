import { IonicModule } from "@ionic/angular";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Tab2Page } from "./tab2.page";
import { ExploreContainerComponentModule } from "../explore-container/explore-container.module";
import { MaterialModule } from "../material.module";
import { Tab2PageRoutingModule } from "./tab2-routing.module";
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
    ExploreContainerComponentModule,
    Tab2PageRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [Tab2Page],
})
export class Tab2PageModule {}
