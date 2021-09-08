import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { MenuController } from "@ionic/angular";
import { DomSanitizer } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-privacy",
  templateUrl: "./privacy.page.html",
  styleUrls: ["./privacy.page.scss"],
})
export class PrivacyPage implements OnInit {
  sanitizedURL = "https://teepzy.com/politique-de-confidentialite/";

  constructor(
    private menuCtrl: MenuController,
    public sanitizer: DomSanitizer,
    private ref: ChangeDetectorRef,
    private translate: TranslateService
  ) {
    this.menuCtrl.close("first");
    this.menuCtrl.swipeGesture(false);
    let language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(language);
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.ref.detach();
  }
}
