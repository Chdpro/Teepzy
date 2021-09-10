import { Component, OnInit } from "@angular/core";
import { MenuController } from "@ionic/angular";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-debut",
  templateUrl: "./debut.page.html",
  styleUrls: ["./debut.page.scss"],
})
export class DebutPage implements OnInit {
  subscription: Subscription;
  language = "";
  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private translate: TranslateService
  ) {
    this.language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(this.language);
  }

  ngOnInit() {
    this.menuCtrl.close("first");
    this.menuCtrl.swipeGesture(false);
  }

  goToSign() {
    this.router.navigateByUrl("/signup", {
      replaceUrl: true,
    });
  }

  goToLogin() {
    this.router.navigateByUrl("/login", {
      replaceUrl: true,
    });
  }
}
