import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-forgot-pass",
  templateUrl: "./forgot-pass.page.html",
  styleUrls: ["./forgot-pass.page.scss"],
})
export class ForgotPassPage implements OnInit {
  sanitizedURL = "https://teepzy.com/reset-password-app/";
  language = "";
  constructor(
    public sanitizer: DomSanitizer,
    private ref: ChangeDetectorRef,
    private translate: TranslateService
  ) {
    this.language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(this.language);
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.ref.detach();
  }
}
